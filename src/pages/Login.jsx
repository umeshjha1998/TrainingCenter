import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Failed to log in: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col antialiased transition-colors duration-300">
            <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#3e8e41_1px,transparent_0)] [background-size:40px_40px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-black/50 overflow-hidden relative z-10 border border-slate-200 dark:border-slate-800">
                    <div className="px-8 pt-10 pb-6 text-center">
                        <div className="mx-auto h-24 w-auto flex items-center justify-center mb-6">
                            <svg
                                fill="none"
                                height="90"
                                viewBox="0 0 140 100"
                                width="120"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M50 35 H90 C110 35 125 48 125 65 C125 82 110 95 90 95 H50 V35 Z"
                                    fill="none"
                                    stroke="#4F6F45"
                                    strokeWidth="8"
                                ></path>
                                <rect fill="#4F6F45" height="6" width="40" x="10" y="42"></rect>
                                <rect fill="#4F6F45" height="6" width="40" x="10" y="62"></rect>
                                <rect fill="#4F6F45" height="6" width="40" x="10" y="82"></rect>
                                <rect fill="#4F6F45" height="6" width="15" x="125" y="62"></rect>
                                <path
                                    d="M55 30 L60 10 H68 L73 30 M58 22 H70"
                                    stroke="#4F6F45"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="6"
                                ></path>
                                <path
                                    d="M85 30 C80 30 78 25 78 20 C78 15 80 10 85 10 C88 10 90 12 90 15"
                                    fill="none"
                                    stroke="#4F6F45"
                                    strokeLinecap="round"
                                    strokeWidth="6"
                                ></path>
                                <text
                                    fill="#4F6F45"
                                    fontFamily="Arial, sans-serif"
                                    fontSize="30"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    x="75"
                                    y="75"
                                >
                                    &amp;
                                </text>
                                <path
                                    d="M110 95 V75 C110 75 120 75 120 85 C120 95 110 95 110 95 Z"
                                    fill="#4F6F45"
                                    stroke="#4F6F45"
                                    strokeWidth="0"
                                    transform="translate(10, 10) scale(0.4)"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            AC &amp; DC Technical Institute
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Welcome back! Please sign in to continue.
                        </p>
                    </div>

                    <div className="px-8 pb-10">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-slate-400 text-lg">
                                            mail_outline
                                        </span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                                        id="email"
                                        name="email"
                                        placeholder="student@acdc-institute.edu"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-slate-400 text-lg">
                                            lock_outline
                                        </span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer bg-slate-50 dark:bg-black/20 dark:border-slate-600"
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                    />
                                    <label
                                        className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                                        htmlFor="remember-me"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        className="font-medium text-primary hover:text-primary-dark dark:hover:text-green-400 hover:underline decoration-primary decoration-2 underline-offset-2 transition-colors"
                                        href="#"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                                        Don't have an account?
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 text-center">
                                <Link
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-bright transition-colors"
                                    to="/register"
                                >
                                    Create an Account
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
                </div>
            </main>
            <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
                <p>© 2024 AC &amp; DC Technical Institute. All rights reserved.</p>
            </footer>
        </div>
    );
}
