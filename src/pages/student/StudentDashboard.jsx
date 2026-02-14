import React from "react";

export default function StudentDashboard() {
    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Dashboard Overview
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back. Here's your learning progress for this semester.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Active Course & Subjects */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. My Enrolled Courses Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group">
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#13ec5b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                        <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                            {/* Course Thumbnail */}
                            <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-lg overflow-hidden relative shadow-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <span className="material-icons text-6xl text-slate-400">precision_manufacturing</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <span className="absolute bottom-3 left-3 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                                    IN PROGRESS
                                </span>
                            </div>
                            {/* Course Details */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                                        Current Module
                                    </span>
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                        MOD-04
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Advanced Inverter Refrigerator Systems
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-slate-400 text-lg">
                                            schedule
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Duration
                                            </span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">6 Months</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-slate-400 text-lg">
                                            person
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Instructor
                                            </span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">Eng. Sarah Connor</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="flex-1 bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span>Continue Learning</span>
                                        <span className="material-icons text-lg">
                                            arrow_forward
                                        </span>
                                    </button>
                                    <button className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Course Details">
                                        <span className="material-icons">info</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Overall Progress Line at bottom */}
                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full bg-primary w-[65%]"></div>
                        </div>
                    </div>

                    {/* 2. Subjects & Progress List */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">
                                    playlist_add_check
                                </span>
                                Subject Progress
                            </h3>
                            <button className="text-sm text-primary hover:text-primary-dark font-medium hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="space-y-6">
                            {/* Subject Item 1 */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                            DC Compressors &amp; Logic Boards
                                        </h4>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            12/15 Lessons Completed
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">80%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 group-hover:bg-primary-dark w-[80%]"></div>
                                </div>
                            </div>
                            {/* Subject Item 2 */}
                            <div className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                            Thermodynamics in Inverters
                                        </h4>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            4/10 Lessons Completed
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">40%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 group-hover:bg-primary-dark w-[40%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Performance & Certs */}
                <div className="lg:col-span-4 space-y-6">
                    {/* 3. Academic Performance */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-primary">insights</span>
                            Academic Performance
                        </h3>
                        <div className="relative h-64 w-full flex items-end justify-between gap-2 pt-8">
                            {/* Simplified Bar Chart visualization */}
                            {['Theory', 'Labs', 'Safety', 'Quiz'].map((label, idx) => {
                                const heights = ['92%', '78%', '85%', '64%'];
                                return (
                                    <div key={label} className="relative z-10 w-full flex flex-col items-center group">
                                        <div className="w-full bg-primary/20 dark:bg-primary/10 rounded-t-sm h-full flex items-end relative overflow-hidden">
                                            <div className="w-full bg-primary group-hover:bg-primary-dark transition-colors duration-300" style={{ height: heights[idx] }}></div>
                                        </div>
                                        <span className="text-[10px] mt-2 font-medium text-slate-500 uppercase tracking-wide">{label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* 4. My Certificates */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-icons text-primary">
                                workspace_premium
                            </span>
                            My Certificates
                        </h3>
                        <div className="space-y-4">
                            {/* Certificate Item 1 */}
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                    <span className="material-icons">description</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        Basic Electronics
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Issued: Aug 2023
                                    </p>
                                </div>
                                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black hover:scale-110 transition-transform shadow-md shadow-primary/20" title="Download Certificate">
                                    <span className="material-icons text-sm">download</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Event */}
                    <div className="bg-slate-800 dark:bg-slate-900 rounded-xl border border-white/5 p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">Next Exam</span>
                            <h3 className="text-xl font-bold text-white mb-2">Practical Assessment</h3>
                            <p className="text-sm text-slate-400 mb-4">Lab 3 • Building B</p>
                            <div className="flex items-center gap-2 text-white">
                                <span className="bg-white/10 p-2 rounded text-center min-w-[3rem]">
                                    <span className="block text-xs uppercase text-slate-400">Oct</span>
                                    <span className="block text-lg font-bold">24</span>
                                </span>
                                <div className="h-10 w-px bg-white/10 mx-1"></div>
                                <div>
                                    <span className="block text-xs text-slate-400">Time</span>
                                    <span className="block font-medium">09:00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
