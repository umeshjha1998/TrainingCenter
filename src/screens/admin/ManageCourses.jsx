import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CourseModal from "../../components/admin/CourseModal";
import ResetConfirmationModal from "../../components/admin/ResetConfirmationModal";
import ConfirmationModal from "../../components/admin/ConfirmationModal";
import { INITIAL_COURSES } from "../../data/courses";

export default function ManageCourses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false); // NEW state
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    // Fetch courses from Firestore with real-time updates
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
            const coursesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching courses: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleResetCourses = async () => {
        setLoading(true);

        // Validation: Check if INITIAL_COURSES are valid
        const invalidCourses = INITIAL_COURSES.filter(course =>
            !course.subjects ||
            course.subjects.length === 0 ||
            course.subjects.some(sub => typeof sub === 'string' && sub.trim() === "")
        );

        if (invalidCourses.length > 0) {
            alert(`Error: Cannot reset. The following default courses have missing or empty subjects: ${invalidCourses.map(c => c.name).join(", ")}`);
            setLoading(false);
            return;
        }

        try {
            // 1. Delete all existing courses
            const coursesSnapshot = await getDocs(collection(db, "courses"));
            const deleteCoursePromises = coursesSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteCoursePromises);

            // 2. Delete all existing certificates (as requested)
            const certsSnapshot = await getDocs(collection(db, "certificates"));
            const deleteCertPromises = certsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteCertPromises);

            // 3. Add initial courses
            const addCoursePromises = INITIAL_COURSES.map(course => {
                return addDoc(collection(db, "courses"), {
                    ...course,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });
            await Promise.all(addCoursePromises);

            alert("Courses and certificates have been reset successfully.");
            setIsResetModalOpen(false); // Close modal
        } catch (error) {
            console.error("Error resetting data: ", error);
            alert("Failed to reset data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const confirmDelete = (courseId) => {
        setCourseToDelete(courseId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCourse = async () => {
        if (!courseToDelete) return;

        try {
            await deleteDoc(doc(db, "courses", courseToDelete));
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
        } catch (error) {
            console.error("Error deleting course: ", error);
            alert("Failed to delete course");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading courses...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:tracking-tight">
                        Course Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        View, edit, and schedule exams for all technical courses.
                    </p>
                </div>
                <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95"
                    >
                        <span className="material-icons text-lg mr-2">add</span>
                        Add New Course
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsResetModalOpen(true)} // Open modal instead of function
                        className="ml-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all active:scale-95"
                    >
                        <span className="material-icons text-lg mr-2">refresh</span>
                        Reset Default Courses
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:pl-6">
                                    Course Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Duration
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Instructor
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Subject Count
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Next Exam
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                        No courses found. Add a new course to get started.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden mr-3 border border-slate-200 dark:border-slate-700">
                                                    {course.image ? (
                                                        <img src={course.image} alt={course.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30">
                                                            <span className="material-icons text-lg">school</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">{course.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">ID: {course.id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
                                                {course.duration}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {course.instructor || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="text-slate-900 dark:text-white font-medium">
                                                {Array.isArray(course.subjects) ? course.subjects.length : (course.subjects || 0)} Subjects
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="text-slate-900 dark:text-white">
                                                {(() => {
                                                    if (!course.nextExam) return "-";
                                                    try {
                                                        // Check if it's a valid date string (e.g. from datetime-local which sends YYYY-MM-DDTHH:mm)
                                                        const date = new Date(course.nextExam);
                                                        if (isNaN(date.getTime())) return course.nextExam; // Return original if not a valid date
                                                        // Format: 16/02/2026 11:30 PM
                                                        return date.toLocaleString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        }).toUpperCase();
                                                    } catch (e) {
                                                        return course.nextExam;
                                                    }
                                                })()}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="text-slate-400 hover:text-primary p-1.5 hover:bg-primary/10 rounded transition-colors"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(course)}
                                                >
                                                    <span className="material-icons text-lg">edit</span>
                                                </button>
                                                <button
                                                    className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Delete"
                                                    onClick={() => confirmDelete(course.id)}
                                                >
                                                    <span className="material-icons text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCourse}
            />

            <ResetConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleResetCourses}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCourse}
                title="Delete Course"
                message="Are you sure you want to delete this course? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
