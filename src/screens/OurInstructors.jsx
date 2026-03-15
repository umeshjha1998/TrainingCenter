"use client";

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export default function OurInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch instructors
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

    // Fetch courses for assignment info
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
            const coursesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesList);
        });

        return () => unsubscribe();
    }, []);

    // Get unique departments/expertise
    const departments = ["All Departments", ...new Set(instructors.map(inst => inst.expertise).filter(Boolean))];

    const filteredInstructors = instructors.filter(inst => {
        const matchesDepartment = selectedDepartment === "All Departments" || inst.expertise === selectedDepartment;
        const matchesSearch = inst.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.expertise?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDepartment && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center py-20 min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="flex-1 flex justify-center py-12 px-4 sm:px-8 max-w-[1240px] mx-auto w-full">
            <div className="layout-content-container flex flex-col w-full flex-1">
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap gap-2 py-2 mb-6">
                    <a className="text-slate-500 dark:text-[#9db9a6] hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors" href="/">Home</a>
                    <span className="text-slate-500 dark:text-[#9db9a6] text-sm font-medium leading-normal">/</span>
                    <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Faculty</span>
                </nav>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div className="flex flex-col gap-3 max-w-2xl">
                        <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            Our Faculty & Instructors
                        </h1>
                        <p className="text-slate-600 dark:text-[#9db9a6] text-lg font-normal leading-relaxed">
                            Meet the industry veterans and certified experts shaping the next generation of technical professionals at AC & DC Institute.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <label className="flex flex-col min-w-40 !h-10 w-full sm:w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-[#28392e] overflow-hidden focus-within:border-primary dark:focus-within:border-primary transition-colors">
                                <div className="text-slate-500 dark:text-[#9db9a6] flex border-none bg-slate-50 dark:bg-[#28392e] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-icons text-xl notranslate" translate="no">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-50 dark:bg-[#28392e] focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-[#9db9a6] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                                    placeholder="Search faculty..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 pb-8 flex-wrap overflow-x-auto scrollbar-hide scroll-smooth">
                    {departments.map((dept, idx) => {
                        const isSelected = selectedDepartment === dept;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-transform active:scale-95 ${isSelected
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                                    : "bg-slate-200 dark:bg-[#28392e] hover:bg-slate-300 dark:hover:bg-[#344a3c] border border-transparent hover:border-slate-300 dark:hover:border-[#405849]"
                                    }`}
                            >
                                <p className={`text-sm leading-normal ${isSelected ? 'font-bold' : 'font-medium text-slate-700 dark:text-white'}`}>{dept}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                    {filteredInstructors.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                            No instructors found.
                        </div>
                    ) : (
                        filteredInstructors.map(instructor => {
                            const instructorCourses = courses.filter(c => c.instructor === instructor.name || c.instructor === instructor.id);

                            // Check if image URL exists (for future expansion)
                            const imageUrl = instructor.photoUrl || instructor.imageUrl || null;
                            const initials = instructor.name ? instructor.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() : "I";

                            return (
                                <div key={instructor.id} className="group flex flex-col gap-4 bg-white dark:bg-[#1a271f] p-4 rounded-xl border border-slate-200 dark:border-[#28392e] hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-[#28392e]">
                                        {imageUrl ? (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${imageUrl})` }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-[#28392e] transition-transform duration-500 group-hover:scale-110 text-slate-400 dark:text-[#344a3c] text-6xl font-black">
                                                {initials}
                                            </div>
                                        )}
                                        {/* Optional "Lead" badge logic - e.g., if highly experienced */}
                                        {instructor.isLead && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-primary flex items-center gap-1">
                                                <span className="material-icons text-sm notranslate" translate="no">star</span>
                                                Lead
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                            {instructor.name}
                                        </h3>
                                        <p className="text-primary text-sm font-semibold uppercase tracking-wide truncate">
                                            {instructor.expertise || "Instructor"}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {instructorCourses.slice(0, 3).map((c, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-[#28392e] rounded text-xs text-slate-600 dark:text-slate-300 truncate max-w-full">
                                                    {c.name}
                                                </span>
                                            ))}
                                            {instructorCourses.length > 3 && (
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-[#28392e] rounded text-xs text-slate-600 dark:text-slate-300">
                                                    +{instructorCourses.length - 3} more
                                                </span>
                                            )}
                                            {instructorCourses.length === 0 && (
                                                <span className="text-slate-400 text-xs italic">No associated courses</span>
                                            )}
                                        </div>

                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-[#28392e] flex items-center gap-2 text-slate-500 dark:text-[#9db9a6] text-sm">
                                            <span className="material-icons text-lg notranslate" translate="no">contact_mail</span>
                                            <span className="truncate">{instructor.email}</span>
                                        </div>

                                        {instructor.certifications && (
                                            <div className="mt-1 flex items-center gap-2 text-slate-500 dark:text-[#9db9a6] text-sm">
                                                <span className="material-icons text-lg notranslate" translate="no">verified</span>
                                                <span className="truncate">{instructor.certifications}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    );
}
