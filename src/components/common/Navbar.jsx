import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import GoogleTranslate from "./GoogleTranslate";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

    const currentUser = session?.user;
    const isAdmin = currentUser?.role === "admin";

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-12 w-12 flex items-center justify-center text-primary">
                                <svg
                                    className="w-full h-full"
                                    fill="currentColor"
                                    viewBox="0 0 100 100"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M40 30 V70 C40 70 75 70 75 50 C75 30 40 30 40 30 Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                    ></path>
                                    <path d="M15 40 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M15 50 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M15 60 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M75 50 H90" stroke="currentColor" strokeWidth="6"></path>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="20"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        x="40"
                                        y="25"
                                    >
                                        AC
                                    </text>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="20"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        x="85"
                                        y="75"
                                    >
                                        DC
                                    </text>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="22"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        x="50"
                                        y="58"
                                    >
                                        &amp;
                                    </text>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                                    AC &amp; DC
                                </span>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                                    Technical Institute
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link className="text-primary font-semibold px-3 py-2 text-sm" href="/">
                            Home
                        </Link>
                        <Link
                            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                            href="/#courses"
                        >
                            Courses
                        </Link>
                        <Link
                            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                            href="/#about"
                        >
                            About Us
                        </Link>
                        <Link
                            className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                            href="/#verify"
                        >
                            <span className="material-icons text-sm notranslate" translate="no">qr_code_scanner</span>{" "}
                            Verification
                        </Link>
                        <div className="flex items-center">
                            <GoogleTranslate />
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        {!currentUser ? (
                            <Link
                                className="bg-white dark:bg-slate-900 text-primary hover:text-primary-dark border border-primary/40 hover:border-primary hover:bg-green-50/50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                                href="/login"
                            >
                                <span className="material-icons text-sm notranslate" translate="no">person_outline</span> Login
                                / Register
                            </Link>
                        ) : (
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Hello, {currentUser.email}
                            </div>
                        )}

                        {isAdmin && (
                            <Link
                                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                                href="/admin"
                            >
                                <span className="material-icons text-sm notranslate" translate="no">dashboard</span> Admin
                            </Link>
                        )}
                        {currentUser && !isAdmin && (
                            <Link
                                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                                href="/student-dashboard"
                            >
                                <span className="material-icons text-sm notranslate" translate="no">school</span> Dashboard
                            </Link>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-icons notranslate" translate="no">menu</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
                    <Link className="block text-primary font-semibold px-3 py-2 text-sm" href="/" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link
                        className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium"
                        href="/#courses"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Courses
                    </Link>
                    <div className="px-3 py-1">
                        <GoogleTranslate />
                    </div>
                    {!currentUser ? (
                        <Link
                            className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium"
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login / Register
                        </Link>
                    ) : (
                        <>
                            <div className="block px-3 py-2 text-sm font-medium text-slate-500">
                                Hello, {currentUser.email}
                            </div>
                            {isAdmin && (
                                <Link
                                    className="block text-primary font-semibold px-3 py-2 text-sm"
                                    href="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            {currentUser && !isAdmin && (
                                <Link
                                    className="block text-primary font-semibold px-3 py-2 text-sm"
                                    href="/student-dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Student Dashboard
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
