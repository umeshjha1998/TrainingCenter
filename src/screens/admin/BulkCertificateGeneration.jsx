"use client";

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "sonner"; // Using sonner for toasts as seen elsewhere
import * as XLSX from "xlsx"; // Optional: for parsing CSV/Excel

export default function BulkCertificateGeneration() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [certificates, setCertificates] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

    // UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [studentScores, setStudentScores] = useState({}); // studentId -> score string
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Fetch data
    useEffect(() => {
        // Fetch courses
        const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
            setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch students
        const qStudents = query(collection(db, "users"), where("role", "==", "student"));
        const unsubStudents = onSnapshot(qStudents, (snapshot) => {
            setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch certificates to calculate 'Generated Today' and sequence
        const unsubCerts = onSnapshot(collection(db, "certificates"), (snapshot) => {
            setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubCourses();
            unsubStudents();
            unsubCerts();
        };
    }, []);

    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    // Filter students based on search
    const filteredStudents = students.filter(student => {
        const name = (student.fullName || student.name || "").toLowerCase();
        const email = (student.email || "").toLowerCase();
        const search = searchQuery.toLowerCase();
        return name.includes(search) || email.includes(search);
    });

    const isAllSelected = filteredStudents.length > 0 &&
        filteredStudents.every(s => selectedStudentIds.has(s.id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            const newSet = new Set(selectedStudentIds);
            filteredStudents.forEach(s => newSet.delete(s.id));
            setSelectedStudentIds(newSet);
        } else {
            const newSet = new Set(selectedStudentIds);
            filteredStudents.forEach(s => newSet.add(s.id));
            setSelectedStudentIds(newSet);
        }
    };

    const toggleStudent = (id) => {
        const newSet = new Set(selectedStudentIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedStudentIds(newSet);
    };

    const handleScoreChange = (id, score) => {
        setStudentScores(prev => ({ ...prev, [id]: score }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            // Very simple CSV/XLSX parsing using xlsx
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Assuming data has columns: email, score
                const newSelection = new Set(selectedStudentIds);
                const newScores = { ...studentScores };

                let matches = 0;
                data.forEach(row => {
                    // Try to match by email
                    const email = row.email || row.Email || row.EMAIL;
                    const score = row.score || row.Score || row.SCORE || row.marks || row.Marks;

                    if (email) {
                        const student = students.find(s => s.email?.toLowerCase() === email.toLowerCase());
                        if (student) {
                            newSelection.add(student.id);
                            if (score !== undefined) {
                                newScores[student.id] = String(score);
                            }
                            matches++;
                        }
                    }
                });

                setSelectedStudentIds(newSelection);
                setStudentScores(newScores);
                toast.success(`Matched ${matches} students from file.`);
            } catch (err) {
                console.error("Error parsing file:", err);
                toast.error("Error reading file. Ensure it's a valid CSV/Excel with an 'email' column.");
            }
        };
        reader.readAsBinaryString(file);
        // Reset input
        e.target.value = null;
    };

    const handleGenerate = async () => {
        if (!selectedCourseId) {
            toast.error("Please select a course first.");
            return;
        }
        if (selectedStudentIds.size === 0) {
            toast.error("Please select at least one student.");
            return;
        }

        setIsGenerating(true);
        setProgress(0);

        const studentsToProcess = Array.from(selectedStudentIds);
        const total = studentsToProcess.length;
        let generatedCount = 0;

        try {
            for (let i = 0; i < total; i++) {
                const studentId = studentsToProcess[i];
                const student = students.find(s => s.id === studentId);
                const score = studentScores[studentId] || "100"; // default if empty

                if (!student) continue;

                // 1. Check existing certs for versioning
                const q = query(
                    collection(db, "certificates"),
                    where("studentId", "==", studentId),
                    where("courseId", "==", selectedCourseId)
                );
                const querySnapshot = await getDocs(q);
                const version = querySnapshot.size + 1;

                // 2. Generate display ID
                const currentYear = new Date().getFullYear();
                const prefix = `CERT-${currentYear}-`;
                // To avoid reading all certs every iteration, we use the local state `certificates`
                // But we need to account for newly added ones in this loop. 
                // We'll calculate the maxSeq once and increment it.
                // Wait, another admin might generate at the same time, but standard UI pattern is fine for this scope.

                // Let's refetch maxSeq based on current total certs + generatedCount
                const maxSeq = certificates.reduce((max, cert) => {
                    if (cert.displayId && cert.displayId.startsWith(prefix)) {
                        const seq = parseInt(cert.displayId.split('-').pop(), 10);
                        return seq > max ? seq : max;
                    }
                    return max;
                }, 0);

                // Use a safe incremented ID
                const nextSeq = maxSeq + generatedCount + 1;
                const displayId = `${prefix}${String(nextSeq).padStart(4, '0')}`;

                const certData = {
                    student: student.fullName || student.name || "Student",
                    studentId: studentId,
                    course: selectedCourse.name,
                    courseId: selectedCourseId,
                    instructorName: selectedCourse.instructorName || "Instructor", // Ensure course has instructor or fallback
                    marks: score,
                    date: new Date(issueDate).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                    isoDate: issueDate,
                    status: "Issued",
                    version: version,
                    displayId: displayId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isBulkGenerated: true
                };
                await addDoc(collection(db, "certificates"), certData);

                // Auto-Email Certificate
                if (student.email) {
                    try {
                        await fetch('/api/send-certificate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: student.email,
                                certificateId: displayId,
                                studentName: certData.student,
                                courseName: certData.course
                            })
                        });
                    } catch (err) {
                        console.error("Failed to email certificate", err);
                    }
                }

                generatedCount++;
                setProgress(Math.round((generatedCount / total) * 100));
            }

            toast.success(`Successfully generated ${generatedCount} certificates!`);
            setSelectedStudentIds(new Set()); // Clear selection
            setStudentScores({});
        } catch (error) {
            console.error("Bulk generation error:", error);
            toast.error("An error occurred during bulk generation.");
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    // Calculate stats
    const todayStr = new Date().toDateString();
    const generatedToday = certificates.filter(c => {
        if (!c.createdAt) return false;
        // handle both Firestore Timestamp and JS Date
        const date = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
        return date.toDateString() === todayStr;
    }).length;

    return (
        <div className="flex-1 flex flex-col h-full relative">
            {/* Header */}
            <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Bulk Generate Certificates</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage, upload, and issue certificates for completed courses.</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 pb-20 overflow-y-auto pr-2">
                <div className="flex flex-col gap-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Students</p>
                                <span className="material-icons text-primary notranslate" translate="no">groups</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">{students.length}</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Selected</p>
                                <span className="material-icons text-blue-500 notranslate" translate="no">check_box</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">{selectedStudentIds.size}</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Generated Today</p>
                                <span className="material-icons text-primary notranslate" translate="no">verified</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">{generatedToday}</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Config */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* Course Selection */}
                            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-xs font-bold">1</span>
                                    Certificate Details
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Select Course</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                value={selectedCourseId}
                                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                            >
                                                <option value="" disabled>-- Choose a Course --</option>
                                                {courses.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <span className="material-icons notranslate" translate="no">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Issue Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Upload Section */}
                            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-xs font-bold">2</span>
                                    Upload Data (Optional)
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                        <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                                        <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                                            <span className="material-icons text-primary text-[32px] notranslate" translate="no">cloud_upload</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-slate-900 dark:text-white">Click to upload Excel/CSV</p>
                                            <p className="text-xs text-slate-500 mt-1">Select students by matching emails</p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || selectedStudentIds.size === 0 || !selectedCourseId}
                                className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isGenerating ? "Generating..." : "Generate Certificates"}</span>
                                {!isGenerating && <span className="material-icons group-hover:translate-x-1 transition-transform notranslate" translate="no">bolt</span>}
                                {isGenerating && <span className="material-icons animate-spin notranslate" translate="no">sync</span>}
                            </button>

                            {/* Progress Overlay/State */}
                            {isGenerating && (
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-white/10 mt-2">
                                    <div className="flex justify-between text-xs mb-2 font-medium">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right Column: Students */}
                        <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col h-full shadow-sm overflow-hidden pb-4">
                                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center bg-white dark:bg-slate-900">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-xs font-bold">3</span>
                                        Select Students ({selectedStudentIds.size})
                                    </h2>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] notranslate" translate="no">search</span>
                                        <input
                                            type="text"
                                            className="pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                                            placeholder="Search student..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/10">
                                            <tr>
                                                <th className="px-6 py-4 w-12">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-current bg-transparent cursor-pointer"
                                                        checked={isAllSelected}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th className="px-6 py-4">Student</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4 w-32 text-right">Score/Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {filteredStudents.map(student => (
                                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={(e) => {
                                                    // Don't toggle if clicking input
                                                    if (e.target.tagName !== 'INPUT') toggleStudent(student.id);
                                                }}>
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent cursor-pointer"
                                                            checked={selectedStudentIds.has(student.id)}
                                                            onChange={() => toggleStudent(student.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                                                                {(student.fullName || student.name || "?").substring(0, 2)}
                                                            </div>
                                                            <span className="font-medium text-slate-900 dark:text-white">{student.fullName || student.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{student.email}</td>
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="text"
                                                            className="w-20 px-2 py-1 text-right text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-primary focus:outline-none dark:text-white"
                                                            placeholder="Score"
                                                            value={studentScores[student.id] || ""}
                                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredStudents.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                                                        No students found matching your search.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
