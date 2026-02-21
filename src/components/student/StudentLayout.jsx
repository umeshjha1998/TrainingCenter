"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function StudentLayout({ children }) {
    const { data: session } = useSession();
    const currentUser = session?.user;

    const router = useRouter();
    const pathname = usePathname();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch Notifications
    React.useEffect(() => {
        if (!currentUser) return;

        // Query for notifications directed at this student OR global ones
        const q = query(
            collection(db, "notifications"),
            where("userId", "in", [currentUser.uid, "global", "all"]),
            orderBy("createdAt", "desc"),
            limit(15)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setNotifications(list);
            setUnreadCount(list.filter(n => !n.read).length);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            // Fallback for missing index or other errors
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleMarkAllRead = async () => {
        try {
            const { writeBatch, getDocs, where } = await import("firebase/firestore");
            const batch = writeBatch(db);
            const q = query(
                collection(db, "notifications"),
                where("userId", "==", currentUser.uid),
                where("read", "==", false)
            );
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            console.error("Failed to log out");
        }
    };

    const isActive = (path) => {
        return pathname === path ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary";
    }

    // Helper to format time
    const formatTime = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Area */}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-4 group">
                                <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                                    <span className="material-icons text-2xl notranslate" translate="no">memory</span>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold tracking-tight uppercase leading-none text-slate-900 dark:text-white">AC &amp; DC</h1>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Technical Institute</span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/student-dashboard" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard')}`}>Dashboard</Link>
                            <Link href="/student-dashboard/courses" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/courses')}`}>Courses</Link>
                            <Link href="/student-dashboard/schedule" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/schedule')}`}>Schedule</Link>
                            <Link href="/student-dashboard/support" className={`text-sm font-medium transition-colors ${isActive('/student-dashboard/support')}`}>Support</Link>
                        </nav>

                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-icons notranslate" translate="no">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications ({unreadCount})</h3>
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-primary font-medium cursor-pointer hover:underline disabled:opacity-50"
                                                disabled={unreadCount === 0}
                                            >
                                                Mark all read
                                            </button>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                                    <span className="material-icons text-3xl opacity-20 block mb-2 notranslate" translate="no">notifications_off</span>
                                                    <p className="text-sm">No new notifications</p>
                                                </div>
                                            ) : (
                                                notifications.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors ${!note.read ? 'bg-primary/5' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${note.type === 'success' ? 'bg-green-500' : (note.type === 'warning' ? 'bg-yellow-500' : 'bg-primary')}`}></div>
                                                            <div>
                                                                <p className={`text-sm font-medium ${!note.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                    {note.title}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 lines-clamp-2">
                                                                    {note.message}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 mt-1">
                                                                    {formatTime(note.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
                                            <Link href="/student-dashboard" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">Close Overview</Link>
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
                                            <span className="material-icons notranslate" translate="no">person</span>
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
                {children}
            </main>
        </div>
    );
}
