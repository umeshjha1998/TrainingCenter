import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

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

                // No need to manual update local state 'students' because parent uses onSnapshot 
                // and passes updated list via props.

                alert("Course assigned successfully!");
                setSelectedCourseId(""); // Reset selection
            }
        } catch (error) {
            console.error("Error assigning course:", error);
            alert("Failed to assign course");
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

                // No need to manually update local state since parent wrapper handles real-time updates
                alert("Course dropped successfully.");
            }
        } catch (error) {
            console.error("Error dropping course:", error);
            alert("Failed to drop course");
        } finally {
            setLoading(false);
            setIsDropModalOpen(false);
            setCourseToDrop(null);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                            Manage Student Courses
                        </h3>

                        <div className="space-y-6">
                            {/* Student Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Student</label>
                                <select
                                    required
                                    disabled={!!studentId}
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border disabled:opacity-50"
                                    value={selectedStudentId}
                                    onChange={e => setSelectedStudentId(e.target.value)}
                                >
                                    <option value="">-- Select Student --</option>
                                    {parentStudents && parentStudents.map(s => (
                                        <option key={s.id} value={s.id}>{s.fullName || s.name} ({s.email})</option>
                                    ))}
                                </select>
                            </div>

                            {selectedStudentId && (
                                <>
                                    {/* Enrolled Courses List */}
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Enrolled Courses</h4>
                                        {studentEnrolledCourses.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic">No active enrollments.</p>
                                        ) : (
                                            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2">
                                                {studentEnrolledCourses.map((c, idx) => {
                                                    const liveCourse = courses.find(course => course.id === c.id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                {liveCourse ? liveCourse.name : c.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    confirmDropCourse(c.id);
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                            >
                                                                Dropout
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Assign New Course */}
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Enroll New Course</h4>
                                        <form onSubmit={handleAssign} className="flex gap-2">
                                            <select
                                                required
                                                className="flex-1 rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                                value={selectedCourseId}
                                                onChange={e => setSelectedCourseId(e.target.value)}
                                            >
                                                <option value="">-- Select Course --</option>
                                                {getAvailableCourses().map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                disabled={loading || !selectedCourseId}
                                                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                                            >
                                                {loading ? "..." : "Enroll"}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDropModalOpen}
                onClose={() => setIsDropModalOpen(false)}
                onConfirm={handleDropCourse}
                title="Drop Course"
                message="Are you sure you want to drop this course? This will remove the student from the enrollment list."
                confirmText="Dropout"
                isDanger={true}
            />
        </div>,
        document.body
    );
}
