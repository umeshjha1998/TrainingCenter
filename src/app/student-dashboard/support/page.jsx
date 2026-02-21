"use client";
import React from "react";

export default function ComingSoon() {
    return (
        <div className="flex flex-col flex-1 h-[60vh] items-center justify-center text-slate-500">
            <span className="material-icons text-6xl mb-4 text-slate-300 notranslate" translate="no">construction</span>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Coming Soon</h2>
            <p className="text-slate-500 max-w-md text-center">This feature is currently under development. Please check back later.</p>
        </div>
    );
}
