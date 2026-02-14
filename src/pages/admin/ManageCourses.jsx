import React, { useState } from "react";

export default function ManageCourses() {
    const [courses, setCourses] = useState([
        { id: "CR-001", name: "Inverter Refrigerator Repair", duration: "6 Months", subjects: 8, nextExam: "Oct 12, 2023" },
        { id: "CR-002", name: "3-Phase Motor Winding", duration: "3 Months", subjects: 4, nextExam: "Nov 01, 2023" },
        { id: "CR-003", name: "PCB Circuit Design", duration: "4 Months", subjects: 6, nextExam: "Not Scheduled" },
        { id: "CR-004", name: "Advanced HVAC Systems", duration: "6 Months", subjects: 10, nextExam: "Dec 15, 2023" },
    ]);

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
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                            <span className="material-icons text-lg">school</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold">{course.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">ID: {course.id}</div>
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
                                        <button className="text-slate-400 hover:text-primary p-1.5 hover:bg-primary/10 rounded transition-colors" title="Edit">
                                            <span className="material-icons text-lg">edit</span>
                                        </button>
                                        <button className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
