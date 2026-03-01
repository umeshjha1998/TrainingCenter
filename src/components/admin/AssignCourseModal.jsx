import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AssignCourseModal({ isOpen, onClose, studentId, students: parentStudents }) {
    const [courses, setCourses] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(studentId || "");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [loading, setLoading] = useState(false);
    const [studentEnrolledCourses, setStudentEnrolledCourses] = useState([]);

    // Confirmation Modal State
    const [isDropModalOpen, setIsDropModalOpen] = useState(false);
    const [courseToDrop, setCourseToDrop] = useState(null);

    // Fetch courses with real-time updates
    useEffect(() => {
        if (isOpen) {
            setSelectedStudentId(studentId || "");
            const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
                const coursesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCourses(coursesList);
            }, (error) => {
                console.error("Error fetching courses: ", error);
            });

            return () => unsubscribe();
        }
    }, [isOpen, studentId]);

    // Update enrolled courses whenever the selected student or the students list changes
    useEffect(() => {
        if (selectedStudentId && parentStudents) {
            const student = parentStudents.find(s => s.id === selectedStudentId);
            setStudentEnrolledCourses(student?.enrolledCourses || []);
        } else {
            setStudentEnrolledCourses([]);
        }
    }, [selectedStudentId, parentStudents]);

    const getAvailableCourses = () => {
        const enrolledIds = studentEnrolledCourses.map(c => c.id);
        return courses.filter(c => !enrolledIds.includes(c.id));
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const course = courses.find(c => c.id === selectedCourseId);
            const student = parentStudents.find(s => s.id === selectedStudentId);

            if (course && student) {
                const studentRef = doc(db, "users", student.id);
                const newEnrollment = {
                    id: course.id,
                    name: course.name,
                    assignedAt: new Date()
                };

                await updateDoc(studentRef, {
                    enrolledCourses: arrayUnion(newEnrollment)
                });

                // Notification
                try {
                    const { addDoc, collection } = await import("firebase/firestore");
                    await addDoc(collection(db, "notifications"), {
                        title: "Course Assigned",
                        message: `You have been enrolled in ${course.name}.`,
                        userId: student.id,
                        isGlobal: false,
                        type: "info",
                        read: false,
                        createdAt: new Date()
                    });
                } catch (error) {
                    console.error("Error creating notification", error);
                }

                toast.success("Course assigned successfully!");
                setSelectedCourseId(""); // Reset selection
            }
        } catch (error) {
            console.error("Error assigning course:", error);
            toast.error("Failed to assign course");
        }
        setLoading(false);
    };

    const confirmDropCourse = (courseId) => {
        setCourseToDrop(courseId);
        setIsDropModalOpen(true);
    };

    const handleDropCourse = async () => {
        if (!courseToDrop) return;

        const courseId = courseToDrop;
        setLoading(true);
        try {
            const student = parentStudents.find(s => s.id === selectedStudentId);
            const course = courses.find(c => c.id === courseId);
            if (student) {
                const studentRef = doc(db, "users", student.id);
                // Ensure we filter correctly
                const updatedEnrolledCourses = (student.enrolledCourses || []).filter(c => c.id && c.id !== courseId);

                await updateDoc(studentRef, {
                    enrolledCourses: updatedEnrolledCourses
                });

                // Notification for dropped course
                try {
                    const { addDoc, collection } = await import("firebase/firestore");
                    await addDoc(collection(db, "notifications"), {
                        title: "Course Dropped",
                        message: `You have been removed from the course: ${course ? course.name : "Unknown Course"}.`,
                        userId: student.id,
                        isGlobal: false,
                        type: "warning",
                        read: false,
                        createdAt: new Date()
                    });
                } catch (error) {
                    console.error("Error creating drop notification", error);
                }

                toast.success("Course dropped successfully.");
            }
        } catch (error) {
            console.error("Error dropping course:", error);
            toast.error("Failed to drop course");
        } finally {
            setLoading(false);
            setIsDropModalOpen(false);
            setCourseToDrop(null);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Manage Student Courses</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Student Selection */}
                        <div className="space-y-2">
                            <Label>Select Student</Label>
                            <Select
                                disabled={!!studentId}
                                value={selectedStudentId}
                                onValueChange={setSelectedStudentId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Select Student --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parentStudents && parentStudents.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.fullName || s.name} ({s.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedStudentId && (
                            <>
                                {/* Enrolled Courses List */}
                                <div className="space-y-2">
                                    <Label>Enrolled Courses</Label>
                                    {studentEnrolledCourses.length === 0 ? (
                                        <p className="text-sm text-slate-500 italic">No active enrollments.</p>
                                    ) : (
                                        <ScrollArea className="h-40 border border-slate-200 dark:border-slate-700 rounded-md p-2">
                                            <div className="space-y-2">
                                                {studentEnrolledCourses.map((c, idx) => {
                                                    const liveCourse = courses.find(course => course.id === c.id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                {liveCourse ? liveCourse.name : c.name}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    confirmDropCourse(c.id);
                                                                }}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium h-8"
                                                            >
                                                                Dropout
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>

                                {/* Assign New Course */}
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                    <Label>Enroll New Course</Label>
                                    <form onSubmit={handleAssign} className="flex gap-2">
                                        <Select
                                            value={selectedCourseId}
                                            onValueChange={setSelectedCourseId}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="-- Select Course --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableCourses().map(c => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="submit"
                                            disabled={loading || !selectedCourseId}
                                        >
                                            {loading ? "..." : "Enroll"}
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                isOpen={isDropModalOpen}
                onClose={() => setIsDropModalOpen(false)}
                onConfirm={handleDropCourse}
                title="Drop Course"
                message="Are you sure you want to drop this course? This will remove the student from the enrollment list."
                confirmText="Dropout"
                isDanger={true}
            />
        </>
    );
}
