import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "../../firebase";
import AssignCourseModal from "../../components/admin/AssignCourseModal";
import RegisterStudentModal from "../../components/admin/RegisterStudentModal";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Fetch students with real-time updates
    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(studentsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching students: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch courses with real-time updates
    useEffect(() => {
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
    }, []);

    const openAssignModal = (student) => {
        setSelectedStudent(student);
        setIsAssignModalOpen(true);
    };

    const openRegisterModal = (student = null) => {
        setSelectedStudent(student);
        setIsRegisterModalOpen(true);
    };

    const confirmDelete = (studentId) => {
        setStudentToDelete(studentId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteStudent = async () => {
        if (!studentToDelete) return;

        const studentUid = studentToDelete;
        const toastId = toast.loading("Deleting student and all associated data...");

        try {
            // 1. Delete from Firebase Authentication via our secure API
            const authResponse = await fetch('/api/admin/delete-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: studentUid })
            });
            const authResult = await authResponse.json();
            
            if (!authResult.success) {
                console.warn("Auth deletion warning:", authResult.error);
                // We proceed with Firestore cleanup even if Auth fails (e.g. user already gone or config missing)
                // but we notify the admin if it's a major error.
            }

            // 2. Cascade Delete Firestore Data using a Batch
            const { writeBatch, collection, query, where, getDocs } = await import("firebase/firestore");
            const batch = writeBatch(db);

            // a. Prepare deletion for Enrollment Requests
            const requestsQuery = query(collection(db, "enrollmentRequests"), where("studentId", "==", studentUid));
            const requestsSnap = await getDocs(requestsQuery);
            requestsSnap.forEach(doc => batch.delete(doc.ref));

            // b. Prepare deletion for Certificates
            const certsQuery = query(collection(db, "certificates"), where("studentId", "==", studentUid));
            const certsSnap = await getDocs(certsQuery);
            certsSnap.forEach(doc => batch.delete(doc.ref));

            // c. Prepare deletion for Notifications (Student specific)
            const notifsQuery = query(collection(db, "notifications"), where("userId", "==", studentUid));
            const notifsSnap = await getDocs(notifsQuery);
            notifsSnap.forEach(doc => batch.delete(doc.ref));

            // d. Delete primary user record
            batch.delete(doc(db, "users", studentUid));

            // e. Commit all Firestore deletions
            await batch.commit();

            setIsDeleteModalOpen(false);
            setStudentToDelete(null);
            toast.success("Student and all related data deleted successfully", { id: toastId });
        } catch (error) {
            console.error("Error during cascading deletion: ", error);
            toast.error("Failed to fully delete student data. Some records might remain.", { id: toastId });
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
                        A list of all registered students. Assign courses and manage registrations.
                    </p>
                </div>
                <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => openRegisterModal(null)}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95"
                    >
                        <span className="material-icons text-lg mr-2 notranslate" translate="no">person_add</span>
                        Register Student
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:pl-6">
                                    Name
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
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                        No students registered yet.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">
                                            <div className="flex items-center gap-3">
                                                {student.profilePhotoUrl ? (
                                                    <img src={student.profilePhotoUrl} alt={student.fullName || student.name || 'Student'} className="h-10 w-10 min-w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                                ) : (
                                                    <div className="h-10 w-10 min-w-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border border-slate-300 dark:border-slate-600">
                                                        {(student.fullName || student.name || 'S').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span>{student.fullName || student.name}</span>
                                            </div>
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
                                                    {student.enrolledCourses.map((c, idx) => {
                                                        const liveCourse = courses.find(course => course.id === c.id);
                                                        return (
                                                            <span key={idx} className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                                                                {liveCourse ? liveCourse.name : c.name}
                                                            </span>
                                                        );
                                                    })}
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
                                                    className="text-primary hover:text-primary-dark transition-colors font-semibold flex items-center gap-1"
                                                    title="Assign Course"
                                                >
                                                    <span className="material-icons text-base notranslate" translate="no">add_circle_outline</span>
                                                </button>
                                                <button
                                                    className="text-slate-400 hover:text-primary transition-colors"
                                                    title="Edit Student"
                                                    onClick={() => openRegisterModal(student)}
                                                >
                                                    <span className="material-icons notranslate" translate="no">edit</span>
                                                </button>
                                                <button
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete Student"
                                                    onClick={() => confirmDelete(student.id)}
                                                >
                                                    <span className="material-icons notranslate" translate="no">delete</span>
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

            {/* Modals with Portals */}
            <AssignCourseModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                studentId={selectedStudent?.id}
                students={students}
            />

            <RegisterStudentModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                initialData={isRegisterModalOpen && !isAssignModalOpen ? selectedStudent : null}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteStudent}
                title="Delete Student"
                message="Are you sure you want to delete this student? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
