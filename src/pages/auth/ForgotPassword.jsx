import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const actionCodeSettings = {
                url: window.location.origin + '/#/reset-password',
                handleCodeInApp: true,
            };
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            // Navigate to the verification page to inform the user
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            console.error(err);
            setError('Failed to send reset email. Please check the email address.');
        }

        setLoading(false);
    };

    return (
        <div className="font-sans min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 bg-[#f6f8f6] dark:bg-[#102216]">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
                backgroundImage: `linear-gradient(rgba(19, 236, 91, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(19, 236, 91, 0.03) 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
            }}></div>

            {/* Abstract Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#13ec5b]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#13ec5b]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* Main Card Container */}
            <main className="relative z-10 w-full max-w-md p-6">
                {/* Glassmorphism Card */}
                <div className="bg-white dark:bg-[#152e1e] border border-gray-200 dark:border-[#13ec5b]/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
                    {/* Top Accent Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#13ec5b] to-transparent opacity-60"></div>
                    <div className="p-8 sm:p-10">
                        {/* Logo Section */}
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-[#13ec5b]/10 rounded-full flex items-center justify-center border border-[#13ec5b]/20 shadow-[0_0_15px_rgba(19,236,91,0.15)]">
                                <span className="material-icons text-[#13ec5b] text-3xl">memory</span>
                            </div>
                        </div>

                        {/* Text Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight font-display">Forgot Password?</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-display">
                                Don't worry, it happens. Enter your registered email associated with <span className="font-medium text-[#13ec5b]/90">AC & DC Tech</span> to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#13ec5b]/70 ml-1 font-display" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-gray-400 dark:text-gray-500 text-lg group-focus-within:text-[#13ec5b] transition-colors">mail_outline</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-[#0c1a11] border border-gray-200 dark:border-[#13ec5b]/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all text-sm font-medium font-display"
                                        id="email"
                                        name="email"
                                        placeholder="student@acdc-institute.edu"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Primary Action */}
                            <button
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-[#102216] bg-[#13ec5b] hover:bg-[#0fd651] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13ec5b] focus:ring-offset-[#102216] transition-all duration-200 transform hover:scale-[1.01] font-display disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                                {!loading && <span className="material-icons text-lg ml-2">send</span>}
                            </button>
                        </form>

                        {/* Footer / Navigation */}
                        <div className="mt-8 text-center border-t border-gray-100 dark:border-white/5 pt-6">
                            <Link className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#13ec5b] dark:hover:text-[#13ec5b] transition-colors group font-display" to="/admin-login">
                                <span className="material-icons text-base mr-1 transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative detail */}
                <div className="flex justify-between items-end px-4 py-2 bg-gray-50 dark:bg-[#0f2417] border-t border-gray-100 dark:border-white/5 text-[10px] text-gray-400 dark:text-gray-600 font-mono uppercase tracking-widest mt-4 rounded-b-lg opacity-80">
                    <span>Sys.Id: 489-B</span>
                    <span>Secure // SSL</span>
                </div>

                {/* Copyright / Footer */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8 font-mono">
                    © 2024 AC & DC Technical Institute.
                </p>
            </main>
        </div>
    );
}
