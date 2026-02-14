import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginAsAdmin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = loginAsAdmin(username, password);

        if (success) {
            navigate("/admin");
        } else {
            setError("Invalid admin credentials");
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col antialiased transition-colors duration-300">
            <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-black/50 overflow-hidden relative z-10 border border-slate-200 dark:border-slate-800">
                    <div className="px-8 pt-10 pb-6 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Please sign in to access the admin dashboard.
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
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <button
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login to Admin Console"}
                                </button>
                            </div>
                        </form>
                        <div className="mt-6 text-center">
                            <Link
                                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                                to="/"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
