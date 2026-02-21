import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function StudentDashboard() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [enrolledCoursesDetails, setEnrolledCoursesDetails] = useState([]);
    const [myCertificates, setMyCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            try {
                // 1. Fetch User Data (for Enrolled Courses list)
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setUserData(data);

                    // 2. Fetch Details of Enrolled Courses
                    if (data.enrolledCourses && data.enrolledCourses.length > 0) {
                        const coursesProms = data.enrolledCourses.map(async (c) => {
                            const courseRef = doc(db, "courses", c.id);
                            const courseSnap = await getDoc(courseRef);
                            if (courseSnap.exists()) {
                                return { id: c.id, ...courseSnap.data(), assignedAt: c.assignedAt };
                            }
                            return c; // Fallback to basic info
                        });
                        const coursesResults = await Promise.all(coursesProms);
                        setEnrolledCoursesDetails(coursesResults);
                    }
                }

                // 3. Fetch Certificates
                const qCerts = query(collection(db, "certificates"), where("studentId", "==", currentUser.uid));
                const certsSnap = await getDocs(qCerts);
                const certsList = certsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setMyCertificates(certsList);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const calculateProgressPercentage = (assignedAt, durationStr) => {
        if (!assignedAt) return 0;

        let totalDays = 30; // fallback to 30 days if unrecognized
        if (durationStr) {
            const str = durationStr.toLowerCase();
            const val = parseInt(str.match(/\d+/)?.[0] || '0');
            if (!isNaN(val) && val > 0) {
                if (str.includes('month')) totalDays = val * 30;
                else if (str.includes('week')) totalDays = val * 7;
                else if (str.includes('year')) totalDays = val * 365;
                else if (str.includes('day')) totalDays = val;
                else totalDays = val;
            }
        }

        const startDate = assignedAt.toDate ? assignedAt.toDate() : new Date(assignedAt);
        const currentDate = new Date();
        const diffTime = currentDate - startDate;
        let diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 0) diffDays = 0;

        let progress = (diffDays / totalDays) * 100;
        if (progress > 100) progress = 100;
        return Math.round(progress);
    };

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Dashboard Overview
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back, {userData?.fullName || currentUser?.email}. Here's your learning progress.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Active Course & Subjects */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. My Enrolled Courses Cards */}
                    {enrolledCoursesDetails.length > 0 ? (
                        enrolledCoursesDetails.map(course => (
                            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group mb-6">
                                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#13ec5b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                                    {/* Thumbnail Placeholder */}
                                    <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-lg overflow-hidden relative shadow-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="material-icons text-6xl text-slate-400">school</span>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <span className="absolute bottom-3 left-3 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                                            ENROLLED
                                        </span>
                                    </div>
                                    {/* Course Details */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {course.name}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-slate-400 text-lg">schedule</span>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Duration</span>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{course.duration || "N/A"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-slate-400 text-lg">person</span>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Instructor</span>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {course.instructor || "Not Assigned"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button className="flex-1 bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                <span>View Content</span>
                                                <span className="material-icons text-lg">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Subjects List within Course */}
                                {course.subjects && course.subjects.length > 0 && (
                                    <div className="px-6 pb-4 md:px-8 md:pb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Subjects</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.subjects.map((sub, idx) => (
                                                <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-xs px-2 py-1 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    {sub.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Progress Bar */}
                                <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Course Progress</h4>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-1 overflow-hidden">
                                        <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${calculateProgressPercentage(course.assignedAt, course.duration)}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <span>Enrolled: {course.assignedAt ? (course.assignedAt.toDate ? course.assignedAt.toDate().toLocaleDateString() : new Date(course.assignedAt).toLocaleDateString()) : 'N/A'}</span>
                                        <span>{calculateProgressPercentage(course.assignedAt, course.duration)}% Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 text-center">
                            <p className="text-slate-500">You are not enrolled in any courses yet.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Performance & Certs */}
                <div className="lg:col-span-4 space-y-6">
                    {/* 4. My Certificates */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-icons text-primary">workspace_premium</span>
                            My Certificates
                        </h3>
                        <div className="space-y-4">
                            {myCertificates.length > 0 ? (
                                myCertificates.map(cert => (
                                    <div key={cert.id} className="flex items-center gap-4 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                            <span className="material-icons">description</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                {cert.course}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Issued: {cert.date}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.open(`/c/${cert.displayId || cert.id}`, '_blank')}
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-black hover:scale-110 transition-transform shadow-md shadow-primary/20"
                                            title="View Certificate">
                                            <span className="material-icons text-sm">visibility</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No certificates issued yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
