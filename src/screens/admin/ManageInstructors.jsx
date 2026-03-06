"use client";

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import InstructorModal from "../../components/admin/InstructorModal";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

export default function ManageInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [instructorToDelete, setInstructorToDelete] = useState(null);

    // Fetch instructors with real-time updates
    useEffect(() => {
        const q = query(collection(db, "instructors"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const instructorsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInstructors(instructorsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching instructors: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch courses with real-time updates for assignment counts
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

    const openCreateModal = () => {
        setSelectedInstructor(null);
        setIsInstructorModalOpen(true);
    };

    const openEditModal = (instructor) => {
        setSelectedInstructor(instructor);
        setIsInstructorModalOpen(true);
    };

    const confirmDelete = (instructorId) => {
        setInstructorToDelete(instructorId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteInstructor = async () => {
        if (!instructorToDelete) return;

        try {
            await deleteDoc(doc(db, "instructors", instructorToDelete));
            setIsDeleteModalOpen(false);
            setInstructorToDelete(null);
        } catch (error) {
            console.error("Error deleting instructor: ", error);
            alert("Failed to delete instructor");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading instructors...</div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Manage Instructors</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">View and manage instructor details, assignments, and access.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
                        <span className="material-icons text-[20px] notranslate" translate="no">file_download</span>
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white dark:text-slate-900 shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                    >
                        <span className="material-icons text-[20px] notranslate" translate="no">person_add</span>
                        <span>Register New Instructor</span>
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <span className="material-icons notranslate" translate="no">groups</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Instructors</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{instructors.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <span className="material-icons notranslate" translate="no">check_circle</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Now</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{instructors.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <span className="material-icons notranslate" translate="no">school</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Courses</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <span className="material-icons notranslate" translate="no">star</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Rated</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">All</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium" scope="col">Instructor Name</th>
                                <th className="px-6 py-4 font-medium" scope="col">Expertise</th>
                                <th className="px-6 py-4 font-medium" scope="col">Assigned Courses</th>
                                <th className="px-6 py-4 font-medium" scope="col">Contact Info</th>
                                <th className="px-6 py-4 font-medium text-right" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {instructors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                        No instructors registered yet.
                                    </td>
                                </tr>
                            ) : (
                                instructors.map((instructor) => {
                                    // Use the assignedCourses array on the instructor object itself
                                    const instructorCourses = instructor.assignedCourses || [];

                                    return (
                                        <tr key={instructor.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                                        {instructor.imageUrl ? (
                                                            <img src={instructor.imageUrl} alt={instructor.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary-dark font-bold text-lg uppercase">
                                                                {instructor.name ? instructor.name.charAt(0) : "I"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">{instructor.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">ID: {instructor.id.slice(0, 8).toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                    {instructor.expertise || "General"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {instructorCourses.length > 0 ? (
                                                        instructorCourses.slice(0, 2).map((c, idx) => (
                                                            <span key={idx} className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                                {c.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-500">None Assigned</span>
                                                    )}
                                                    {instructorCourses.length > 2 && (
                                                        <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                            +{instructorCourses.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-white">{instructor.email}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{instructor.phone}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(instructor)}
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                                                    >
                                                        <span className="material-icons text-[20px] notranslate" translate="no">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(instructor.id)}
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <span className="material-icons text-[20px] notranslate" translate="no">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <InstructorModal
                isOpen={isInstructorModalOpen}
                onClose={() => setIsInstructorModalOpen(false)}
                initialData={selectedInstructor}
                courses={courses}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteInstructor}
                title="Delete Instructor"
                message="Are you sure you want to delete this instructor? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
