import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function ManageCourses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: "", duration: "", subjects: "", nextExam: "" });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        if (!newCourse.name || !newCourse.duration || !newCourse.subjects || !newCourse.nextExam) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "courses"), {
                ...newCourse,
                subjects: parseInt(newCourse.subjects) || 0,
                createdAt: new Date()
            });

            const addedCourse = {
                id: docRef.id,
                ...newCourse,
                subjects: parseInt(newCourse.subjects) || 0
            };

            setNewCourse({ name: "", duration: "", subjects: "", nextExam: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding course: ", error);
            alert("Failed to add course");
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            await deleteDoc(doc(db, "courses", id));
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
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95"
                    >
                        <span className="material-icons text-lg mr-2">add</span>
                        Add New Course
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                                            <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                                <span className="material-icons text-lg">school</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold">{course.name}</div>
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
                                        <div className="text-slate-900 dark:text-white font-medium">{course.subjects} Subjects</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="text-slate-900 dark:text-white">{course.nextExam}</span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                                                title="Delete"
                                                onClick={() => handleDeleteCourse(course.id)}
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
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleAddCourse}>
                                <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4" id="modal-title">
                                        Add New Course
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Course Name</label>
                                            <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={newCourse.name} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Duration</label>
                                            <input type="text" id="duration" name="duration" required placeholder="e.g. 6 Months" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={newCourse.duration} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="subjects" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject Count</label>
                                            <input type="number" id="subjects" name="subjects" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={newCourse.subjects} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="nextExam" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Next Exam Date</label>
                                            <input type="text" id="nextExam" name="nextExam" placeholder="e.g. Oct 12, 2023" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={newCourse.nextExam} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                                        Add Course
                                    </button>
                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
