import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function GenerateCertificateModal({ isOpen, onClose, onGenerate, initialData }) {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");

    // Marks state: { [subjectName]: { obtained: "", total: 100 } }
    const [marks, setMarks] = useState({});

    // Helper to get local ISO string for datetime-local input
    const getLocalISOString = (date = new Date()) => {
        const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    };

    const [issueDate, setIssueDate] = useState(getLocalISOString());

    // Fetch Students and Courses
    useEffect(() => {
        if (!isOpen) return;

        const qStudents = query(collection(db, "users"), where("role", "==", "student"));
        const unsubStudents = onSnapshot(qStudents, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => (a.fullName || a.name || "").localeCompare(b.fullName || b.name || ""));
            setStudents(list);
        });

        const qCourses = collection(db, "courses");
        const unsubCourses = onSnapshot(qCourses, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            setCourses(list);
        });

        setLoadingData(false);

        return () => {
            unsubStudents();
            unsubCourses();
        };
    }, [isOpen]);

    // Initialize form with initialData or defaults
    useEffect(() => {
        if (isOpen && initialData) {
            // Edit mode may be tricky if we don't have IDs. 
            // Assuming initialData has studentName and courseName, we try to match them.
            // But ideally we should store studentId and courseId in certificate.
            // For now, if we can't match ID, we might need to rely on names or just basic edit.
            // BUT the prompt implies specific generation flow. Editing might just be basic details update?
            // Let's try to match by name if ID missing, or just set text values if no match.
            // Provided instructions focus on GENERATION.

            // If we have IDs in initialData (which we should add to certificate creation), use them.
            // If not, we might fall back to manual text or just simple matching.
            // For this implementation, I will prioritize the "Generate" flow.

            // Assuming initialData might have 'studentId' and 'courseId' from previous saves,
            // or we try to find them by name.

            // NOTE: The current ManageCertificates mapping only sends { student: name, course: name }.
            // We might want to upgrade ManageCertificates to send full object if possible, 
            // OR find the student/course by name here.

            const findStudent = students.find(s => (s.fullName || s.name) === initialData.student);
            const findCourse = courses.find(c => c.name === initialData.course);

            if (findStudent) setSelectedStudentId(findStudent.id);
            if (findCourse) setSelectedCourseId(findCourse.id);

            // Handle date conversion for datetime-local input
            let initialDateStr = initialData.isoDate || initialData.date;
            if (initialDateStr) {
                const d = new Date(initialDateStr);
                if (!isNaN(d.getTime())) {
                    setIssueDate(getLocalISOString(d));
                } else {
                    setIssueDate(getLocalISOString());
                }
            } else {
                setIssueDate(getLocalISOString());
            }

            if (initialData.marks) {
                setMarks(initialData.marks);
            } else {
                setMarks({});
            }
        } else {
            // Reset for new entry
            setSelectedStudentId("");
            setSelectedCourseId("");
            setMarks({});
            setIssueDate(getLocalISOString());
        }
    }, [isOpen, initialData, students, courses]);

    // When course changes, initialize marks for subjects
    useEffect(() => {
        if (!selectedCourseId) {
            // Keep marks if we are in edit mode and just loaded data? 
            // Only reset if user explicitly changes course.
            // We can check if the current marks match the selected course subjects.
            return;
        }

        const course = courses.find(c => c.id === selectedCourseId);
        if (course && course.subjects) {
            setMarks(prev => {
                const newMarks = { ...prev };
                course.subjects.forEach(sub => {
                    if (!newMarks[sub.name]) {
                        newMarks[sub.name] = { obtained: "", total: 100 };
                    }
                });
                return newMarks;
            });
        }
    }, [selectedCourseId, courses]);

    const handleMarkChange = (subjectName, field, value) => {
        setMarks(prev => ({
            ...prev,
            [subjectName]: {
                ...prev[subjectName],
                [field]: value
            }
        }));
    };

    const [duplicateWarning, setDuplicateWarning] = useState(null);

    // Check for duplicate certificates
    useEffect(() => {
        if (selectedStudentId && selectedCourseId && !initialData) {
            const q = query(
                collection(db, "certificates"),
                where("studentId", "==", selectedStudentId),
                where("courseId", "==", selectedCourseId)
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const count = snapshot.size;
                if (count > 0) {
                    setDuplicateWarning(`Warning: This certificate already exists (Version ${count}). Generating will create Version ${count + 1}.`);
                } else {
                    setDuplicateWarning(null);
                }
            });
            return () => unsubscribe();
        } else {
            setDuplicateWarning(null);
        }
    }, [selectedStudentId, selectedCourseId, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const student = students.find(s => s.id === selectedStudentId);
        const course = courses.find(c => c.id === selectedCourseId);

        if (!student || !course) {
            alert("Please select a valid student and course.");
            return;
        }

        // Validate marks
        if (course.subjects) {
            for (let sub of course.subjects) {
                const m = marks[sub.name];
                if (!m || m.obtained === "" || m.total === "") {
                    alert(`Please enter marks for ${sub.name}`);
                    return;
                }
                if (parseFloat(m.obtained) > parseFloat(m.total)) {
                    alert(`Marks obtained for ${sub.name} cannot be greater than total marks.`);
                    return;
                }
            }
        }

        const dataToSave = {
            id: initialData?.id,
            studentName: student.fullName || student.name,
            studentId: student.id,
            courseName: course.name,
            courseId: course.id,
            instructorName: course.instructor || "Principal",
            issueDate: issueDate,
            marks: marks
        };

        onGenerate(dataToSave);

        // Trigger Notification
        try {
            const { addDoc, collection } = await import("firebase/firestore");
            await addDoc(collection(db, "notifications"), {
                title: "Certificate Generated",
                message: `Certificate generated for ${student.fullName || student.name} in ${course.name}`,
                type: "success",
                read: false,
                createdAt: new Date()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }

        onClose();
    };

    if (!isOpen) return null;

    const selectedStudent = students.find(s => s.id === selectedStudentId);

    // Filter enrolled courses for dropdown
    const enrolledCourses = selectedStudent?.enrolledCourses || []; // Array of { id, name }

    // Get selected course details for subjects
    const fullSelectedCourse = courses.find(c => c.id === selectedCourseId);

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                                {initialData ? "Edit Certificate" : "Generate New Certificate"}
                            </h3>

                            <div className="space-y-4">
                                {/* Student Selection */}
                                <div>
                                    <label htmlFor="student" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Select Student
                                    </label>
                                    <select
                                        id="student"
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                        value={selectedStudentId}
                                        onChange={e => {
                                            setSelectedStudentId(e.target.value);
                                            setSelectedCourseId(""); // Reset course when student changes
                                        }}
                                        disabled={!!initialData} // Disable changing student in edit mode to avoid complexity/mismatch
                                    >
                                        <option value="">-- Choose Student --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.fullName || s.name} ({s.email})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Course Selection (Enrolled only) */}
                                <div>
                                    <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Select Course
                                    </label>
                                    <select
                                        id="course"
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                        value={selectedCourseId}
                                        onChange={e => setSelectedCourseId(e.target.value)}
                                        disabled={!selectedStudentId || !!initialData}
                                    >
                                        <option value="">-- Choose Enrolled Course --</option>
                                        {enrolledCourses.map(c => {
                                            const liveCourse = courses.find(course => course.id === c.id);
                                            return (
                                                <option key={c.id} value={c.id}>{liveCourse ? liveCourse.name : c.name}</option>
                                            );
                                        })}
                                    </select>
                                    {!selectedStudentId && <p className="text-xs text-slate-500 mt-1">Select a student first.</p>}
                                    {selectedStudentId && enrolledCourses.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">This student has no enrolled courses.</p>
                                    )}
                                </div>

                                {duplicateWarning && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <span className="material-icons text-red-400">warning</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">
                                                    {duplicateWarning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subjects & Marks */}
                                {fullSelectedCourse && fullSelectedCourse.subjects && fullSelectedCourse.subjects.length > 0 && (
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Subject Marks</h4>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {fullSelectedCourse.subjects.map((sub, idx) => (
                                                <div key={idx} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                    <div className="flex-1 font-medium text-sm text-slate-700 dark:text-slate-300">
                                                        {sub.name}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20">
                                                            <label className="sr-only">Obtained</label>
                                                            <input
                                                                type="number"
                                                                placeholder="Score"
                                                                required
                                                                className="w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 border text-center"
                                                                value={marks[sub.name]?.obtained || ""}
                                                                onChange={e => handleMarkChange(sub.name, 'obtained', e.target.value)}
                                                            />
                                                        </div>
                                                        <span className="text-slate-400">/</span>
                                                        <div className="w-20">
                                                            <label className="sr-only">Total</label>
                                                            <input
                                                                type="number"
                                                                placeholder="Total"
                                                                required
                                                                className="w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 border text-center"
                                                                value={marks[sub.name]?.total || 100}
                                                                onChange={e => handleMarkChange(sub.name, 'total', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Details */}
                                <div>
                                    <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Issue Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="issueDate"
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                        value={issueDate}
                                        onChange={e => setIssueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                {initialData ? "Update Certificate" : "Generate"}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}
