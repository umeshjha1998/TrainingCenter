import React, { useState } from "react";
import Link from "next/link";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import GenerateCertificateModal from "../../components/admin/GenerateCertificateModal";
import AssignCourseModal from "../../components/admin/AssignCourseModal";
import RegisterStudentModal from "../../components/admin/RegisterStudentModal";
import useDashboardStats from "../../hooks/useDashboardStats";

export default function AdminDashboard() {
    const {
        totalStudents,
        totalCertificates,
        newRegistrations,
        recentCertificates,
        recentActivity,
        loading
    } = useDashboardStats();

    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleGenerateCertificate = async (data) => {
        try {
            const certData = {
                student: data.studentName,
                studentId: data.studentId || "unknown",
                course: data.courseName,
                courseId: data.courseId || "unknown",
                marks: data.marks,
                date: new Date(data.issueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                isoDate: data.issueDate,
                status: "Issued",
                updatedAt: new Date(),
                createdAt: new Date()
            };

            const displayId = `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            await addDoc(collection(db, "certificates"), {
                ...certData,
                displayId: displayId
            });
            setIsGenerateModalOpen(false);
            alert("Certificate Generated Successfully!");
        } catch (error) {
            console.error("Error saving certificate:", error);
            alert("Failed to generate certificate.");
        }
    };

    if (loading) {
        return <div className="text-center p-10 text-slate-500">Loading dashboard data...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <GenerateCertificateModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGenerateCertificate}
            />
            <AssignCourseModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
            />
            <RegisterStudentModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />

            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, Admin.
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Here's what's happening at the institute today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-icons text-6xl text-primary">school</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Total Students
                        </p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                                {totalStudents}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="material-icons text-xs mr-1">trending_up</span>
                                Live
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Active enrollments
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-primary w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-icons text-6xl text-primary">verified</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Certificates Issued
                        </p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                                {totalCertificates}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="material-icons text-xs mr-1">trending_up</span>
                                Live
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Total certified graduates
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-primary w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-icons text-6xl text-primary">person_add</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            New Registrations
                        </p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                                {newRegistrations}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-green-800 dark:text-green-300">
                                Last 30 Days
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Recently joined students</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-primary w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons text-primary">bolt</span> Quick
                            Actions
                        </h3>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full flex flex-col gap-4">
                            <button
                                onClick={() => setIsGenerateModalOpen(true)}
                                className="group w-full bg-primary hover:bg-primary-dark text-white p-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 flex items-center justify-between text-left"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-lg">Generate Certificate</span>
                                    <span className="text-xs font-medium opacity-90">
                                        Create new for graduate
                                    </span>
                                </div>
                                <span className="material-icons bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                                    add
                                </span>
                            </button>

                            <button
                                onClick={() => setIsRegisterModalOpen(true)}
                                className="group w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 p-4 rounded-lg transition-all transform hover:-translate-y-1 flex items-center justify-between text-left"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-lg">Register Student</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Add new student record
                                    </span>
                                </div>
                                <span className="material-icons bg-slate-200 dark:bg-slate-700 p-2 rounded-full group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                    person_add
                                </span>
                            </button>

                            <button
                                onClick={() => setIsAssignModalOpen(true)}
                                className="group w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 p-4 rounded-lg transition-all transform hover:-translate-y-1 flex items-center justify-between text-left"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-lg">Assign Course</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Link student to course
                                    </span>
                                </div>
                                <span className="material-icons bg-slate-200 dark:bg-slate-700 p-2 rounded-full group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                    school
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Certifications
                            </h3>
                            <Link href="/admin/certificates" className="text-sm text-primary font-medium hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                ID Number
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                Course
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentCertificates.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No certificates issued yet.</td>
                                            </tr>
                                        ) : (
                                            recentCertificates.map((cert) => (
                                                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                                                                {cert.student ? cert.student.charAt(0) : '?'}
                                                            </div>
                                                            <span className="font-medium text-slate-900 dark:text-white">{cert.student}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                                                        {cert.displayId || cert.id.substring(0, 8)}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{cert.course}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                            {cert.status || 'Issued'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="xl:col-span-1 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-primary">history</span> Recent Activity
                    </h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full max-h-[500px] overflow-y-auto">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-slate-500">No recent activity.</p>
                        ) : (
                            <ul className="space-y-6">
                                {recentActivity.map((activity, index) => (
                                    <li key={index} className="flex gap-4 items-start">
                                        <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${activity.type === 'student' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {activity.date.toLocaleString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
