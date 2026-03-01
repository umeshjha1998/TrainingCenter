"use client";

import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, Timestamp, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "sonner"; // Assuming sonner is used for toasts

export default function ManageRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'denied'

    useEffect(() => {
        const q = query(collection(db, "enrollmentRequests"), orderBy("requestDate", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(reqList);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (reqId, studentId, courseId, courseName) => {
        setProcessingId(reqId);
        try {
            // Update request status
            await updateDoc(doc(db, "enrollmentRequests", reqId), {
                status: "approved",
                processedAt: Timestamp.now()
            });

            // Enroll student
            const assignedAt = Timestamp.now();
            await updateDoc(doc(db, "users", studentId), {
                enrolledCourses: arrayUnion({
                    id: courseId,
                    name: courseName,
                    assignedAt: assignedAt
                })
            });

            // Send Notification to student
            await addDoc(collection(db, "notifications"), {
                userId: studentId,
                title: "Course Enrollment Approved",
                message: `Your request to enroll in ${courseName} has been approved.`,
                createdAt: Timestamp.now(),
                read: false
            });

            toast.success("Request approved and student enrolled.");
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Failed to approve request.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeny = async (reqId, studentId, courseName) => {
        if (!confirm("Are you sure you want to deny this request?")) return;

        setProcessingId(reqId);
        try {
            await updateDoc(doc(db, "enrollmentRequests", reqId), {
                status: "denied",
                processedAt: Timestamp.now()
            });

            // Send Notification to student
            await addDoc(collection(db, "notifications"), {
                userId: studentId,
                title: "Course Enrollment Denied",
                message: `Your request to enroll in ${courseName} was not approved.`,
                createdAt: Timestamp.now(),
                read: false
            });

            toast.success("Request denied.");
        } catch (error) {
            console.error("Error denying request:", error);
            toast.error("Failed to deny request.");
        } finally {
            setProcessingId(null);
        }
    };

    // Calculate stats focusing on 'today' logic if needed, simplify for now
    const pendingCount = requests.filter(r => r.status === "pending").length;

    const todayStr = new Date().toDateString();
    const approvedToday = requests.filter(r =>
        r.status === "approved" &&
        r.processedAt &&
        r.processedAt.toDate().toDateString() === todayStr
    ).length;
    const deniedToday = requests.filter(r =>
        r.status === "denied" &&
        r.processedAt &&
        r.processedAt.toDate().toDateString() === todayStr
    ).length;

    // Filter logic
    const filteredRequests = requests.filter(req => {
        // Status filter
        if (filter !== "all" && req.status !== filter) return false;

        // Search text
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            return (req.studentName?.toLowerCase().includes(lowerQuery) ||
                req.studentEmail?.toLowerCase().includes(lowerQuery) ||
                req.courseName?.toLowerCase().includes(lowerQuery));
        }

        return true;
    });

    return (
        <div className="flex-1 flex flex-col h-full relative">
            {/* Top Header Area */}
            <header className="flex-shrink-0 mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Course Enrollment Requests</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Review and manage pending student enrollment applications.</p>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 pb-20">
                <div className="flex flex-col gap-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 rounded-xl p-5 border border-primary/20 bg-primary/5">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Pending</p>
                                <span className="material-icons text-primary notranslate" translate="no">pending_actions</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold mt-2">{pendingCount}</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Approved Today</p>
                                <span className="material-icons text-green-500 notranslate" translate="no">check_circle</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold mt-2">{approvedToday}</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Denied Today</p>
                                <span className="material-icons text-red-500 notranslate" translate="no">cancel</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold mt-2">{deniedToday}</p>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-icons text-slate-400 notranslate" translate="no">search</span>
                            </div>
                            <input
                                className="block w-full p-2.5 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-primary focus:border-primary placeholder-slate-400 dark:placeholder-slate-500"
                                placeholder="Search by student or course..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Chips */}
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === 'all' ? 'bg-primary text-black shadow-lg shadow-primary/20 font-bold' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'}`}>
                                <span className="material-icons text-[18px] notranslate" translate="no">list</span>
                                All Requests
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === 'pending' ? 'bg-primary text-black shadow-lg shadow-primary/20 font-bold' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'}`}>
                                <span className="material-icons text-[18px] notranslate" translate="no">pending</span>
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === 'approved' ? 'bg-primary text-black shadow-lg shadow-primary/20 font-bold' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'}`}>
                                <span className="material-icons text-[18px] notranslate" translate="no">check_circle</span>
                                Approved
                            </button>
                            <button
                                onClick={() => setFilter('denied')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === 'denied' ? 'bg-primary text-black shadow-lg shadow-primary/20 font-bold' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'}`}>
                                <span className="material-icons text-[18px] notranslate" translate="no">cancel</span>
                                Denied
                            </button>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading requests...</div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No requests found.</div>
                        ) : (
                            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Student Name</th>
                                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Requested Course</th>
                                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date Requested</th>
                                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {filteredRequests.map(req => {
                                        const dateStr = req.requestDate?.toDate ? req.requestDate.toDate().toLocaleDateString() : 'Unknown';

                                        return (
                                            <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                            <span className="material-icons notranslate" translate="no">person</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-900 dark:text-white font-medium text-base">{req.studentName}</span>
                                                            <span className="text-xs">{req.studentEmail}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-900 dark:text-white font-medium">{req.courseName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-icons text-[18px] notranslate" translate="no">calendar_today</span>
                                                        {dateStr}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap uppercase text-xs font-bold tracking-wider">
                                                    {req.status === "pending" && <span className="text-yellow-600 dark:text-yellow-400">Pending</span>}
                                                    {req.status === "approved" && <span className="text-primary-dark dark:text-primary">Approved</span>}
                                                    {req.status === "denied" && <span className="text-red-600 dark:text-red-400">Denied</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {req.status === "pending" ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDeny(req.id, req.studentId, req.courseName)}
                                                                disabled={processingId === req.id}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-xs font-semibold disabled:opacity-50">
                                                                <span className="material-icons text-[16px] notranslate" translate="no">close</span>
                                                                Deny
                                                            </button>
                                                            <button
                                                                onClick={() => handleApprove(req.id, req.studentId, req.courseId, req.courseName)}
                                                                disabled={processingId === req.id}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-black hover:bg-primary-dark transition-colors text-xs font-bold shadow-lg shadow-primary/20 disabled:opacity-50">
                                                                <span className="material-icons text-[16px] notranslate" translate="no">check</span>
                                                                Approve
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic">No actions</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
