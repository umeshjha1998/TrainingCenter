"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { collection, query, orderBy, limit, onSnapshot, writeBatch, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminLayout({ children }) {
    const { data: session } = useSession();
    const currentUser = session?.user;

    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [searchResults, setSearchResults] = useState({ students: [], courses: [], certificates: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch Notifications
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "notifications"),
            where("userId", "in", ["admin", "global", "all"]),
            orderBy("createdAt", "desc"),
            limit(20)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setNotifications(list);
            setUnreadCount(list.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleMarkAllRead = async () => {
        try {
            const batch = writeBatch(db);
            const unreadDocs = notifications.filter(n => !n.read);

            // Note: Batch limit is 500, we limit query to 20 so it's safe.
            // However, we need doc references. Ideally we query purely unread ones to mark read, 
            // but here we just mark the visible ones as read for UX simplicity.

            // To be robust: Query all unread notifications in DB? 
            // Or just update the ones we loaded. Let's update loaded ones for now.
            // Actually, let's just fetch all unread and batch update them to be safe.

            const qUnread = query(
                collection(db, "notifications"),
                where("userId", "in", ["admin", "global", "all"]),
                where("read", "==", false)
            );
            const snapshot = await getDocs(qUnread);

            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });

            await batch.commit();
            // State updates automatically via onSnapshot
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
        return pathname === path ? "bg-primary text-black shadow-sm shadow-primary/30" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";
    }

    // Helper to format time
    const formatTime = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const handleSearchFocus = async () => {
        if (!searchData) {
            try {
                const studentsSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
                const coursesSnap = await getDocs(collection(db, "courses"));
                const certsSnap = await getDocs(collection(db, "certificates"));

                setSearchData({
                    students: studentsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    courses: coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    certificates: certsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                });
            } catch (error) {
                console.error("Error fetching search data:", error);
            }
        }
        if (searchQuery.length >= 2) setIsSearchOpen(true);
    };

    useEffect(() => {
        if (searchQuery.length < 2 || !searchData) {
            setSearchResults({ students: [], courses: [], certificates: [] });
            setIsSearchOpen(false);
            return;
        }

        const queryLower = searchQuery.toLowerCase();

        const filteredStudents = searchData.students.filter(s =>
            (s.fullName || s.name || "").toLowerCase().includes(queryLower) ||
            (s.email || "").toLowerCase().includes(queryLower)
        ).slice(0, 5);

        const filteredCourses = searchData.courses.filter(c =>
            (c.name || "").toLowerCase().includes(queryLower) ||
            (c.instructor || "").toLowerCase().includes(queryLower)
        ).slice(0, 5);

        const filteredCerts = searchData.certificates.filter(c =>
            (c.displayId || "").toLowerCase().includes(queryLower) ||
            (c.student || "").toLowerCase().includes(queryLower) ||
            (c.course || "").toLowerCase().includes(queryLower)
        ).slice(0, 5);

        setSearchResults({
            students: filteredStudents,
            courses: filteredCourses,
            certificates: filteredCerts
        });
        setIsSearchOpen(true);
    }, [searchQuery, searchData]);

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
                        <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin')}`}>
                            <span className="material-icons">dashboard</span>
                            <span>Dashboard</span>
                        </Link>
                        <Link href="/admin/students" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/students')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">people</span>
                            <span>Manage Students</span>
                        </Link>
                        <Link href="/admin/courses" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/courses')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">library_books</span>
                            <span>Manage Courses</span>
                        </Link>
                        <Link href="/admin/certificates" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/certificates')}`}>
                            <span className="material-icons group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">workspace_premium</span>
                            <span>Generated Certs</span>
                        </Link>
                        <Link href="/admin/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${isActive('/admin/reports')}`}>
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
                            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link>
                            <span className="material-icons text-xs">chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 text-slate-900 dark:text-white placeholder-slate-500"
                                placeholder="Search students, courses..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                            />

                            {/* Search Dropdown */}
                            {isSearchOpen && (searchResults.students.length > 0 || searchResults.courses.length > 0 || searchResults.certificates.length > 0) && (
                                <div className="absolute top-12 left-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">

                                    {searchResults.students.length > 0 && (
                                        <div className="px-3">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-2">Students</h4>
                                            {searchResults.students.map(s => (
                                                <Link href="/admin/students" key={s.id} className="flex items-center gap-2 px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg group">
                                                    <span className="material-icons text-slate-400 group-hover:text-primary text-sm flex-shrink-0">person</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{s.fullName || s.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{s.email}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.courses.length > 0 && (
                                        <div className={`px-3 ${searchResults.students.length > 0 ? "mt-2 border-t border-slate-100 dark:border-slate-700 pt-2" : "mt-2"}`}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Courses</h4>
                                            {searchResults.courses.map(c => (
                                                <Link href="/admin/courses" key={c.id} className="flex items-center gap-2 px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg group">
                                                    <span className="material-icons text-slate-400 group-hover:text-primary text-sm flex-shrink-0">library_books</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.certificates.length > 0 && (
                                        <div className={`px-3 ${(searchResults.students.length > 0 || searchResults.courses.length > 0) ? "mt-2 border-t border-slate-100 dark:border-slate-700 pt-2" : "mt-2"}`}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Certificates</h4>
                                            {searchResults.certificates.map(c => (
                                                <Link href="/admin/certificates" key={c.id} className="flex items-center gap-2 px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg group">
                                                    <span className="material-icons text-slate-400 group-hover:text-primary text-sm flex-shrink-0">workspace_premium</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.displayId}</p>
                                                        <p className="text-xs text-slate-500 truncate">{c.student} - {c.course}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            )}

                            {isSearchOpen && searchResults.students.length === 0 && searchResults.courses.length === 0 && searchResults.certificates.length === 0 && (
                                <div className="absolute top-12 left-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-4 px-4 z-50 text-center text-sm text-slate-500">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-icons">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
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
                                            <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                                No system notifications.
                                            </div>
                                        ) : (
                                            notifications.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors ${!note.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                                        <div>
                                                            <p className={`text-sm font-medium ${!note.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                {note.title}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                                        <Link href="/admin/reports" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                                            View Reports
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
}
