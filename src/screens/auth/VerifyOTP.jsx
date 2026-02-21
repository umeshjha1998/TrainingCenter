"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

function VerifyOTPContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || "your email";
    const [resendStatus, setResendStatus] = useState('');

    const handleResend = async () => {
        setResendStatus('Sending...');
        try {
            const actionCodeSettings = {
                url: window.location.origin + '/#/reset-password',
                handleCodeInApp: true,
            };
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setResendStatus('Sent!');
        } catch (error) {
            console.error(error);
            setResendStatus('Failed to send.');
        }
    };

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-display text-slate-800 dark:text-slate-200 antialiased min-h-screen flex flex-col relative overflow-hidden items-center justify-center">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#135bec]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#135bec]/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#135bec 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    opacity: 0.05
                }}></div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4 relative z-10 w-full max-w-md">
                {/* Verification Card */}
                <div className="w-full bg-white dark:bg-[#161e2e] border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl p-8 md:p-10 transform transition-all text-center">
                    {/* Branding Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-[#135bec]/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-[#135bec]/20">
                            <span className="material-icons text-[#135bec] text-3xl">mark_email_read</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center tracking-tight mb-2 font-display">Check your email</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed max-w-xs mx-auto font-display mb-6">
                            We've sent a password reset link to <span className="text-[#135bec] font-medium">{email}</span>
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Click the link in the email to reset your password.
                        </p>
                    </div>

                    {/* Footer / Resend */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-display">
                            Didn't receive the email?
                            <button
                                onClick={handleResend}
                                className="text-[#135bec] hover:text-[#135bec]/80 font-medium ml-1 transition-colors focus:outline-none focus:underline font-display"
                                disabled={resendStatus === 'Sending...'}
                            >
                                {resendStatus || 'Resend Link'}
                            </button>
                        </p>
                        <div className="mt-6">
                            <Link href="/admin-login" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-1">
                                <span className="material-icons text-sm">arrow_back</span> Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 opacity-60">
                        <span className="material-icons text-slate-400 text-sm">shield</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold font-display">Secure Verification</span>
                    </div>
                </div>
            </main>

            {/* Simple Footer Copyright */}
            <footer className="py-6 text-center relative z-10">
                <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                    © 2023 AC & DC Logic Systems. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default function VerifyOTP() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
