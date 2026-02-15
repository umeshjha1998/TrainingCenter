import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function StudentLayout() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch {
            console.error("Failed to log out");
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary";
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Area */}
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-4 group">
                                <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                                    <span className="material-icons text-2xl">memory</span>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold tracking-tight uppercase leading-none text-slate-900 dark:text-white">AC &amp; DC</h1>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Technical Institute</span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/student-dashboard" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard')}`}>Dashboard</Link>
                            <Link to="/student-dashboard/courses" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/courses')}`}>Courses</Link>
                            <Link to="/student-dashboard/schedule" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/schedule')}`}>Schedule</Link>
                            <Link to="/student-dashboard/support" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/support')}`}>Support</Link>
                        </nav>

                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-icons">notifications</span>
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                                </button>

                                {/* Notification Dropdown */}
                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                                            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Exam Schedule Released</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The schedule for the upcoming semester exams has been published.</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New Course Material</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">New lecture notes added to Web Development course.</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">Yesterday</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 shrink-0"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Fee Payment Reminder</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Reminder to pay your semester fees by the end of the week.</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">2 days ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
                                            <Link to="/student-dashboard/notifications" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">View all notifications</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">Student</p>
                                    <p className="text-xs text-primary mt-1">{currentUser?.email}</p>
                                </div>
                                <div className="relative group">
                                    <button className="flex items-center focus:outline-none">
                                        <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-primary/30 text-slate-500">
                                            <span className="material-icons">person</span>
                                        </div>
                                    </button>
                                    {/* Dropdown for logout */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ring-1 ring-black ring-opacity-5">
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
