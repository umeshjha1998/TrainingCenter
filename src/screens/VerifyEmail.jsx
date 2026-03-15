"use client";
import React from "react";
import Link from "next/link";

export default function VerifyEmail() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
            <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-primary">AC & DC Technical Institute</Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="material-icons text-primary text-3xl notranslate" translate="no">mark_email_unread</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify your email</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                    </p>

                    <Link href="/login" className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors">
                        Return to Login
                    </Link>
                </div>
            </main>
        </div>
    );
}
