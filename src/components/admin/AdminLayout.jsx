import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        return location.pathname === path ? "bg-primary text-black shadow-sm shadow-primary/30" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex overflow-hidden text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div>
                    <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary-dark dark:text-primary">
                                <span className="material-icons text-2xl">memory</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">AC &amp; DC</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Technical Institute</p>
                            </div>
                        </div>
                        <button className="md:hidden ml-auto text-slate-500" onClick={() => setIsSidebarOpen(false)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <nav className="mt-6 px-4 space-y-2">
                        <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin')}`}>
                            <span className="material-icons">dashboard</span>
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/admin/students" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/students')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">people</span>
                            <span>Manage Students</span>
                        </Link>
                        <Link to="/admin/courses" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/courses')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">library_books</span>
                            <span>Manage Courses</span>
                        </Link>
                        <Link to="/admin/certificates" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/certificates')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">workspace_premium</span>
                            <span>Generated Certs</span>
                        </Link>
                        <Link to="/admin/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/reports')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">analytics</span>
                            <span>Reports</span>
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left text-slate-700 dark:text-slate-300">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                <span className="material-icons">person</span>
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                        </div>
                        <span className="material-icons text-slate-400">logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative h-screen">
                {/* Topbar */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-500" onClick={() => setIsSidebarOpen(true)}>
                            <span className="material-icons">menu</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link>
                            <span className="material-icons text-xs">chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 text-slate-900 dark:text-white placeholder-slate-500"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-icons">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
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
                                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New Student Registration</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">John Doe has registered for Web Development.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors">
                                            <div className="flex gap-3">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">System Update</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">System maintenance scheduled for tonight.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors">
                                            <div className="flex gap-3">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Database Backup</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Weekly backup completed successfully.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">5 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
                                        <Link to="/admin/notifications" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">View all notifications</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
}
