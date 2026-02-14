import React from "react";

export default function Reports() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:tracking-tight">
                    System Reports
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Analyze institute performance, student attendance, and course popularity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Enrollment Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                        Chart Placeholder
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Certificate Issuance</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
