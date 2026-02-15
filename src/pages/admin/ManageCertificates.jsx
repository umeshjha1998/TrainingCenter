import React, { useState } from "react";

import GenerateCertificateModal from "../../components/admin/GenerateCertificateModal";

export default function ManageCertificates() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialize from localStorage or use default data
    const [certificates, setCertificates] = useState(() => {
        const saved = localStorage.getItem('certificates');
        if (saved) return JSON.parse(saved);
        return [
            { id: "CERT-2023-8421", student: "Jane Cooper", course: "Advanced React Patterns", date: "Oct 12, 2023", status: "Issued" },
            { id: "CERT-2023-8422", student: "Cody Fisher", course: "Full Stack Bootcamp", date: "Oct 10, 2023", status: "Issued" },
            { id: "CERT-2023-8423", student: "Esther Howard", course: "Python for Data Science", date: "Oct 08, 2023", status: "Pending" },
            { id: "CERT-2023-8424", student: "Jenny Doe", course: "Machine Learning A-Z", date: "Oct 05, 2023", status: "Issued" },
        ];
    });

    // Update localStorage whenever certificates change
    React.useEffect(() => {
        localStorage.setItem('certificates', JSON.stringify(certificates));
    }, [certificates]);

    const handleGenerate = (data) => {
        const newCert = {
            id: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            student: data.studentName,
            course: data.courseName,
            date: new Date(data.issueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: "Issued"
        };
        setCertificates([newCert, ...certificates]);
    };

    return (
        <div className="space-y-6">
            <GenerateCertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGenerate}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Manage Generated Certificates
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        View, verify, and manage all issued training certificates.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md hover:shadow-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95">
                    <span className="material-icons text-base mr-2">add_circle</span>
                    Generate New Certificate
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Course
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Certificate ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Date Issued
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {certificates.map((cert) => (
                                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                                                    {cert.student.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{cert.student}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 dark:text-white">{cert.course}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                                            {cert.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {cert.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${cert.status === 'Issued' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ring-green-600/20' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ring-yellow-600/20'}`}>
                                            {cert.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                className="text-slate-400 hover:text-primary transition-colors"
                                                title="View"
                                                onClick={() => window.open(`#/c/${cert.id}`, '_blank')}
                                            >
                                                <span className="material-icons text-xl">visibility</span>
                                            </button>
                                            <button
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this certificate?")) {
                                                        setCertificates(certificates.filter(c => c.id !== cert.id));
                                                    }
                                                }}
                                            >
                                                <span className="material-icons text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
