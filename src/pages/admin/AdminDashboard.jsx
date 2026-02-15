import React, { useState } from "react";
import { Link } from "react-router-dom";
import GenerateCertificateModal from "../../components/admin/GenerateCertificateModal";
import AssignCourseModal from "../../components/admin/AssignCourseModal";
import RegisterStudentModal from "../../components/admin/RegisterStudentModal";

export default function AdminDashboard() {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Dummy handler for certificate generation (just to close modal)
    // In a real app, this would save to DB. ManageCertificates page uses localStorage though.
    // For now, we just close the modal to satisfy the UI requirement.
    const handleGenerateCertificate = (data) => {
        console.log("Generating certificate for:", data);
        // Ideally we should save this to localStorage or Firestore to persist it
        const saved = localStorage.getItem('certificates');
        const certificates = saved ? JSON.parse(saved) : [];
        const newCert = {
            id: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            student: data.studentName,
            course: data.courseName,
            date: new Date(data.issueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: "Issued"
        };
        localStorage.setItem('certificates', JSON.stringify([newCert, ...certificates]));
        setIsGenerateModalOpen(false);
        alert("Certificate Generated Successfully!");
    };

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
                                1,240
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="material-icons text-xs mr-1">trending_up</span>
                                12%
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Active enrollments this semester
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
                                856
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="material-icons text-xs mr-1">trending_up</span>
                                5%
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Total certified graduates to date
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
                                45
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-green-800 dark:text-green-300">
                                This Month
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Waiting for approval</p>
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
                            <Link to="/admin/certificates" className="text-sm text-primary font-medium hover:underline">
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
                                                Certificate Type
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {/* Placeholder rows */}
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">JD</div>
                                                    <span className="font-medium text-slate-900 dark:text-white">John Doe</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">AC-2023-891</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Electrical Engineering</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Issued
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section - Placeholder */}
                <div className="xl:col-span-1 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-primary">history</span> Recent Activity
                    </h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full">
                        <p className="text-sm text-slate-500">No recent activity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
