"use client";
import React, { useEffect, useState, useRef } from "react";

const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "bho", label: "Bhojpuri" },
    { code: "mai", label: "Maithili" },
];

export default function GoogleTranslate() {
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en", // Default page language
                        includedLanguages: "en,hi,bho,mai", // Restrict languages
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };

        // Check if the script is already added to avoid duplicates
        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.type = "text/javascript";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        setIsOpen(false);
        const selectElement = document.querySelector(".goog-te-combo");
        if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    if (!isClient) return null; // Avoid SSR mismatches with Next.js

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Hidden native Google Translate element */}
            <div id="google_translate_element" className="hidden"></div>

            <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
            >
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '24px' }}>
                    language
                </span>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="py-1">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors notranslate"
                                translate="no"
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Global style to hide the Google Translate top banner if it drops down */}
            <style jsx global>{`
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                .VIpgJd-ZVi9od-ORHb-OEVmcd {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
