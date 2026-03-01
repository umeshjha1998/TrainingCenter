import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        if (!selectedCourseId) return;

        const course = courses.find(c => c.id === selectedCourseId);
        if (course && course.subjects) {
            if (initialData && initialData.course === course.name) {
                // If we're editing and we didn't change the course, keep existing marks
            } else {
                setMarks(prev => {
                    const newMarks = { ...prev };
                    course.subjects.forEach(sub => {
                        const subjectName = typeof sub === 'string' ? sub : sub.name;
                        if (!newMarks[subjectName]) {
                            newMarks[subjectName] = { obtained: "", total: 100 };
                        }
                    });
                    return newMarks;
                });
            }
        }
    }, [selectedCourseId, courses, initialData]);

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
            toast.error("Please select a valid student and course.");
            return;
        }

        // Validate marks
        if (course.subjects) {
            for (let sub of course.subjects) {
                const subjectName = typeof sub === 'string' ? sub : sub.name;
                const m = marks[subjectName];
                if (!m || m.obtained === "" || m.total === "") {
                    toast.error(`Please enter marks for ${subjectName}`);
                    return;
                }
                if (parseFloat(m.obtained) > parseFloat(m.total)) {
                    toast.error(`Marks obtained for ${subjectName} cannot be greater than total marks.`);
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
                message: `Your certificate for ${course.name} has been issued.`,
                userId: student.id,
                isGlobal: false,
                type: "success",
                read: false,
                createdAt: new Date()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }

        onClose();
    };


    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const enrolledCourses = selectedStudent?.enrolledCourses || [];
    const fullSelectedCourse = courses.find(c => c.id === selectedCourseId);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {initialData ? "Edit Certificate" : "Generate New Certificate"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Student Selection */}
                        <div className="space-y-2">
                            <Label>Select Student</Label>
                            <Select
                                disabled={!!initialData}
                                value={selectedStudentId}
                                onValueChange={(val) => {
                                    setSelectedStudentId(val);
                                    setSelectedCourseId(""); // Reset course when student changes
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Choose Student --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.fullName || s.name} ({s.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Course Selection (Enrolled only) */}
                        <div className="space-y-2">
                            <Label>Select Course</Label>
                            <Select
                                disabled={!selectedStudentId || !!initialData}
                                value={selectedCourseId}
                                onValueChange={setSelectedCourseId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Choose Enrolled Course --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {enrolledCourses.map(c => {
                                        const liveCourse = courses.find(course => course.id === c.id);
                                        return (
                                            <SelectItem key={c.id} value={c.id}>
                                                {liveCourse ? liveCourse.name : c.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {!selectedStudentId && <p className="text-xs text-slate-500 mt-1">Select a student first.</p>}
                            {selectedStudentId && enrolledCourses.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">This student has no enrolled courses.</p>
                            )}
                        </div>

                        {duplicateWarning && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="material-icons text-red-400 notranslate" translate="no">warning</span>
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
                                <ScrollArea className="h-60 pr-1">
                                    <div className="space-y-3">
                                        {fullSelectedCourse.subjects.map((sub, idx) => {
                                            const subjectName = typeof sub === 'string' ? sub : sub.name;
                                            return (
                                                <div key={idx} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                    <div className="flex-1 font-medium text-sm text-slate-700 dark:text-slate-300">
                                                        {subjectName}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20">
                                                            <Input
                                                                type="number"
                                                                placeholder="Obtained"
                                                                required
                                                                className="text-center"
                                                                value={marks[subjectName]?.obtained || ""}
                                                                onChange={e => handleMarkChange(subjectName, 'obtained', e.target.value)}
                                                            />
                                                        </div>
                                                        <span className="text-slate-400">/</span>
                                                        <div className="w-20">
                                                            <Input
                                                                type="number"
                                                                placeholder="Total"
                                                                required
                                                                className="text-center"
                                                                value={marks[subjectName]?.total || 100}
                                                                onChange={e => handleMarkChange(subjectName, 'total', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        {/* Other Details */}
                        <div className="space-y-2">
                            <Label htmlFor="issueDate">Issue Date</Label>
                            <Input
                                type="datetime-local"
                                id="issueDate"
                                required
                                value={issueDate}
                                onChange={e => setIssueDate(e.target.value)}
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? "Update Certificate" : "Generate"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
