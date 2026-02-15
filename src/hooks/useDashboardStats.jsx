import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function useDashboardStats() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCertificates: 0,
        newRegistrations: 0,
        totalCourses: 0,
        recentActivity: [],
        courseData: [],
        enrollmentData: [],
        certificateData: [],
        recentCertificates: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
        const coursesQuery = collection(db, "courses");
        const certificatesQuery = query(collection(db, "certificates"), orderBy("createdAt", "desc")); // Keep assuming createdAt exists

        // We use a local state to hold data from different listeners before aggregating
        let studentsData = [];
        let coursesData = [];
        let certificatesData = [];

        // Helper to update stats
        const updateStats = () => {
            // 1. Basic Counts
            const totalStudents = studentsData.length;
            const totalCourses = coursesData.length;
            const totalCertificates = certificatesData.length;

            // 2. New Registrations (Last 30 days)
            const now = new Date();
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            const newRegistrations = studentsData.filter(s => {
                const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
                return date >= thirtyDaysAgo;
            }).length;

            // 3. Recent Activity (Combine all)
            // Create events from students and certificates
            const studentEvents = studentsData.map(s => ({
                id: s.id,
                type: "student",
                title: `New Student Registered: ${s.fullName || s.name}`,
                date: s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0),
                rawDate: s.createdAt
            }));

            // Certificates usually have createdAt, but fallback to date string if needed
            const certEvents = certificatesData.map(c => ({
                id: c.id,
                type: "certificate",
                title: `Certificate Issued to ${c.student}`,
                date: c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.date || 0),
                rawDate: c.createdAt
            }));

            const allActivity = [...studentEvents, ...certEvents]
                .sort((a, b) => b.date - a.date)
                .slice(0, 5); // Top 5 recent activities

            // 4. Course Performance (Students per Course)
            // We need to count occurrences of course names in student.enrolledCourses
            const courseCounts = {};
            studentsData.forEach(s => {
                if (s.enrolledCourses && Array.isArray(s.enrolledCourses)) {
                    s.enrolledCourses.forEach(c => {
                        const cName = c.name || "Unknown";
                        courseCounts[cName] = (courseCounts[cName] || 0) + 1;
                    });
                }
            });

            const courseData = Object.entries(courseCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5); // Top 5 courses

            // 5. Enrollment Growth (Students per Month)
            // Group students by month of registration
            // Initialize with last 6 months to ensure continuity
            const enrollmentMap = {};
            // Helper for month keys
            const getMonthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            // Populate last 6 months with 0
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                enrollmentMap[getMonthKey(d)] = 0;
            }

            studentsData.forEach(s => {
                const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt || 0);
                const key = getMonthKey(date);
                if (enrollmentMap.hasOwnProperty(key)) {
                    enrollmentMap[key]++;
                }
            });

            const enrollmentData = Object.entries(enrollmentMap)
                .map(([date, count]) => {
                    const [year, month] = date.split('-');
                    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
                    return { name: monthName, students: count };
                });

            // 6. Certificate Status Distribution
            const certStatusCounts = { Issued: 0, Pending: 0 };
            certificatesData.forEach(c => {
                const status = c.status || 'Issued';
                certStatusCounts[status] = (certStatusCounts[status] || 0) + 1;
            });
            const certificateData = Object.entries(certStatusCounts).map(([name, value]) => ({ name, value }));

            setStats({
                totalStudents,
                totalCertificates,
                newRegistrations,
                totalCourses,
                recentActivity: allActivity,
                courseData,
                enrollmentData,
                certificateData,
                recentCertificates: certificatesData.slice(0, 5) // Recent 5 certs for table
            });
            setLoading(false);
        };

        const unsubStudents = onSnapshot(studentsQuery, (snap) => {
            studentsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            updateStats();
        });

        const unsubCourses = onSnapshot(coursesQuery, (snap) => {
            coursesData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            updateStats();
        });

        const unsubCerts = onSnapshot(certificatesQuery, (snap) => {
            certificatesData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            updateStats();
        });

        return () => {
            unsubStudents();
            unsubCourses();
            unsubCerts();
        };
    }, []);

    return { ...stats, loading };
}
