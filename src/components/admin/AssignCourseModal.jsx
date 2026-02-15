import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

export default function AssignCourseModal({ isOpen, onClose }) {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const studentsSnapshot = await getDocs(collection(db, "users"));
                const coursesSnapshot = await getDocs(collection(db, "courses"));

                setStudents(studentsSnapshot.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(u => u.role === 'student'));

                setCourses(coursesSnapshot.docs
                    .map(d => ({ id: d.id, ...d.data() })));
            };
            fetchData();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const course = courses.find(c => c.id === selectedCourseId);
            const student = students.find(s => s.id === selectedStudentId);

            if (course && student) {
                const studentRef = doc(db, "users", student.id);
                await updateDoc(studentRef, {
                    enrolledCourses: arrayUnion({
                        id: course.id,
                        name: course.name,
                        assignedAt: new Date()
                    })
                });
                alert("Course assigned successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error assigning course:", error);
            alert("Failed to assign course");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                                Assign Course
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Student</label>
                                    <select
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                        value={selectedStudentId}
                                        onChange={e => setSelectedStudentId(e.target.value)}
                                    >
                                        <option value="">-- Select Student --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.fullName || s.name} ({s.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Course</label>
                                    <select
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                        value={selectedCourseId}
                                        onChange={e => setSelectedCourseId(e.target.value)}
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                {loading ? "Assigning..." : "Assign"}
                            </button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
