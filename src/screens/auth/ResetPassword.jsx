"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Get the OOB code from the query parameters
    const oobCode = searchParams.get('oobCode');

    // Initialize error state based on oobCode presence
    const [message, setMessage] = useState('');
    const [error, setError] = useState(oobCode ? '' : 'Invalid or missing reset code. Please try requesting a new password reset link.');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!oobCode) {
            setError("Missing reset code.");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setMessage("Password has been reset successfully. Redirecting to login...");
            setTimeout(() => {
                router.push('/admin-login');
            }, 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. The link may have expired or is invalid.");
        }
    };

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        <div className="bg-[#f6f8f6] dark:bg-[#102216] min-h-screen flex flex-col justify-center items-center p-4 font-display">
            {/* Navbar / Header Area */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    {/* AC & DC Logic Gate Logo Representation */}
                    <div className="h-10 w-10 bg-[#13ec5b]/20 dark:bg-[#13ec5b]/10 rounded-lg flex items-center justify-center border border-[#13ec5b]/30">
                        <span className="material-icons text-[#13ec5b] text-2xl notranslate" translate="no">all_inclusive</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-display">LogicGate</span>
                </div>
            </header>

            {/* Main Content Container */}
            <main className="w-full max-w-md relative z-20">
                {/* Background decorative glows */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#13ec5b]/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#13ec5b]/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                {/* Card */}
                <div className="bg-white dark:bg-[#152e1e] border border-gray-200 dark:border-[#13ec5b]/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
                    {/* Progress Indicator */}
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-2/3 bg-[#13ec5b] shadow-[0_0_10px_rgba(19,236,91,0.5)]"></div>
                    </div>

                    <div className="p-8 sm:p-10">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#13ec5b]/10 mb-4 border border-[#13ec5b]/20">
                                <span className="material-icons text-[#13ec5b] text-3xl notranslate" translate="no">lock_reset</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">Set new password</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-display">
                                Your new password must be different from previously used passwords.
                            </p>
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password Field */}
                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-display" htmlFor="new-password">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-gray-400 text-xl notranslate" translate="no">lock</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-10 py-3 border-gray-300 dark:border-[#13ec5b]/20 rounded-lg bg-gray-50 dark:bg-[#1a3825] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent transition-all duration-200 font-display"
                                        id="new-password"
                                        placeholder="Enter new password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#13ec5b] transition-colors cursor-pointer"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-icons text-xl notranslate" translate="no">{showPassword ? "visibility" : "visibility_off"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-100 dark:border-[#13ec5b]/10">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 font-display">Password Strength</p>
                                <ul className="space-y-2 text-sm font-display">
                                    <li className={`flex items-center ${hasMinLength ? 'text-[#13ec5b]' : 'text-gray-500 dark:text-gray-400'}`}>
                                        <span className={`material-icons text-sm mr-2 ${hasMinLength ? '' : 'text-gray-400 dark:text-gray-600'} notranslate`} translate="no">
                                            {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span>At least 8 characters</span>
                                    </li>
                                    <li className={`flex items-center ${hasNumber ? 'text-[#13ec5b]' : 'text-gray-500 dark:text-gray-400'}`}>
                                        <span className={`material-icons text-sm mr-2 ${hasNumber ? '' : 'text-gray-400 dark:text-gray-600'} notranslate`} translate="no">
                                            {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span>Contains a number</span>
                                    </li>
                                    <li className={`flex items-center ${hasSpecialChar ? 'text-[#13ec5b]' : 'text-gray-500 dark:text-gray-400'}`}>
                                        <span className={`material-icons text-sm mr-2 ${hasSpecialChar ? '' : 'text-gray-400 dark:text-gray-600'} notranslate`} translate="no">
                                            {hasSpecialChar ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span>Contains a special character</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-display" htmlFor="confirm-password">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-gray-400 text-xl notranslate" translate="no">verified_user</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-10 py-3 border-gray-300 dark:border-[#13ec5b]/20 rounded-lg bg-gray-50 dark:bg-[#1a3825] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent transition-all duration-200 font-display"
                                        id="confirm-password"
                                        placeholder="Retype new password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#13ec5b] transition-colors cursor-pointer"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-icons text-xl notranslate" translate="no">{showConfirmPassword ? "visibility" : "visibility_off"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#102216] bg-[#13ec5b] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13ec5b] focus:ring-offset-[#102216] transition-all duration-200 uppercase tracking-wide font-display"
                                type="submit"
                            >
                                Update Password
                            </button>

                            <div className="text-center mt-4">
                                <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#13ec5b] dark:hover:text-[#13ec5b] transition-colors flex items-center justify-center gap-1 font-display" href="/admin-login">
                                    <span className="material-icons text-sm notranslate" translate="no">arrow_back</span> Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 font-mono">
                    © 2023 AC & DC Logic Gate Inc. Secure System.
                </p>
            </main>

            {/* Image for decorative purposes - kept from original but hidden on mobile */}
            <div className="hidden lg:block fixed right-0 bottom-0 h-full w-1/3 z-0 pointer-events-none opacity-10">
                <img
                    alt="Abstract Pattern"
                    className="object-cover h-full w-full mask-image-gradient"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaYvvD_jazOU_aFscCGzyGXzznvsGpOwMOeMscZlm-KjHCQw1_lrRzTCAeq3m5JfMrqQKEpimCxTxU4OiVzfe8UKKQ198epyRhlEW3xJeRDgoaN1CWLk0Phjlh0FVdeQo9A2s757iwI3DRKFOhVuZ29ClvF-kjCGE-3TjjHazjlYqHIInhNUd3-INUZeJ9xsERbhiuAJ_Aj7eTuLdidvxmVJID02fuZpeqxFxGt35xDKSs8prWwYejNj2my9LqOeyViFhTPtjPgPo"
                />
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
