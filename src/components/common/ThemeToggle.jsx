"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none w-10 h-10">
                <span className="material-icons opacity-0" translate="no">light_mode</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none w-10 h-10"
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
        >
            {theme === 'dark' ? (
                <span className="material-icons notranslate text-yellow-500" translate="no">light_mode</span>
            ) : (
                <span className="material-icons notranslate text-slate-700" translate="no">dark_mode</span>
            )}
        </button>
    );
}
