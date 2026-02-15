import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);

    // Fetch students and courses with real-time updates
    useEffect(() => {
        // Subscribe to Students (Fetch all users)
        const q = query(collection(db, "users"));
        const unsubscribeStudents = onSnapshot(q, (snapshot) => {
            const studentsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(studentsList);
            setLoading(false); // Can update loading when first data arrives
        }, (error) => {
            console.error("Error fetching students: ", error);
            setLoading(false);
        });

        // Subscribe to Courses (for dropdown)
        const unsubscribeCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
            const coursesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesList);
        }, (error) => {
            console.error("Error fetching courses: ", error);
        });

        return () => {
            unsubscribeStudents();
            unsubscribeCourses();
        };
    }, []);

    const openAssignModal = (student) => {
        setSelectedStudent(student);
        setSelectedCourseId("");
        setIsAssignModalOpen(true);
    };

    const handleAssignCourse = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !selectedStudent) return;

        const courseToAssign = courses.find(c => c.id === selectedCourseId);
        if (!courseToAssign) return;

        setAssignLoading(true);

        try {
            const studentRef = doc(db, "users", selectedStudent.id);
            // We store a simplified course object or just the name. 
            // Let's store the name and ID for reference.
            const courseData = {
                id: courseToAssign.id,
                name: courseToAssign.name,
                assignedAt: new Date()
            };

            await updateDoc(studentRef, {
                enrolledCourses: arrayUnion(courseData)
            });

            setIsAssignModalOpen(false);
            alert(`Course assigned to ${selectedStudent.fullName || selectedStudent.name}`);

        } catch (error) {
            console.error("Error assigning course: ", error);
            alert("Failed to assign course");
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "users", id));
        } catch (error) {
            console.error("Error deleting student: ", error);
            alert("Failed to delete student");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading students...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:tracking-tight">
                        Manage Students
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        A list of all registered users. Assign courses to new registrations here.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:pl-6">
                                Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Role
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Contact
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Enrolled Courses
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                    No users registered yet.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">
                                        {student.fullName || student.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 capitalize">
                                        {student.role || "student"}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col">
                                            <span>{student.email}</span>
                                            <span className="text-xs text-slate-400">{student.phone}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {student.enrolledCourses.map((c, idx) => (
                                                    <span key={idx} className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">
                                                Not Assigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => openAssignModal(student)}
                                                className="text-primary hover:text-primary-dark transition-colors font-semibold"
                                            >
                                                Assign Course
                                            </button>
                                            <button
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete Student"
                                                onClick={() => handleDeleteStudent(student.id)}
                                            >
                                                <span className="material-icons">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Course Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={() => setIsAssignModalOpen(false)} aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleAssignCourse}>
                                <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4" id="modal-title">
                                        Assign Course to {selectedStudent?.fullName || selectedStudent?.name}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Course</label>
                                            <select
                                                id="course"
                                                required
                                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                                value={selectedCourseId}
                                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                            >
                                                <option value="">-- Select a Course --</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} ({course.duration})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={assignLoading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {assignLoading ? "Assigning..." : "Assign Course"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={assignLoading}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setIsAssignModalOpen(false)}
                                    >
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
