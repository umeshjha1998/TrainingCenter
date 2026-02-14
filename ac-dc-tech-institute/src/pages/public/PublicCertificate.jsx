import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CertificateTemplate from '../../components/certificate/CertificateTemplate';

export default function PublicCertificate() {
    const { id } = useParams();
    const certificateRef = useRef();
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        // In a real app, fetch from Firestore using 'id'
        setTimeout(() => {
            setCertificateData({
                studentName: "John Doe",
                courseName: "Single Door Refrigerator Repair",
                certificateId: id || "ACDC-2023-TEST",
                issueDate: "Oct 24, 2023",
                marks: [
                    { subject: "Electrical Safety", score: 92 },
                    { subject: "Compressor Systems", score: 88 },
                    { subject: "Gas Charging", score: 95 },
                    { subject: "Troubleshooting", score: 89 }
                ]
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading Certificate...</div>;
    }

    if (!certificateData) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500">Certificate not found.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-8 sm:py-12 print:bg-white print:p-0">
            {/* Actions Bar - Hidden in Print */}
            <div className="w-full max-w-[1024px] px-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <span className="material-icons text-lg text-green-600">verified_user</span>
                    <span>Official Digital Record</span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium"
                    >
                        <span className="material-icons text-lg">print</span>
                        Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* Certificate Component */}
            <CertificateTemplate ref={certificateRef} data={certificateData} />

            {/* Footer - Hidden in Print */}
            <div className="mt-8 text-center pb-8 print:hidden">
                <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
                    <span className="material-icons text-base text-green-600">check_circle</span>
                    Verified by AC &amp; DC Technical Institute System
                </p>
                <p className="text-slate-300 dark:text-slate-600 text-xs mt-2">
                    © 2023 AC &amp; DC Technical Institute. All rights reserved.
                </p>
            </div>

            <style>{`
        @media print {
            body {
                background: white;
            }
            .print\\:hidden {
                display: none;
            }
            .print-container {
                box-shadow: none;
                margin: 0;
                width: 100%;
                max-width: 100%;
            }
        }
      `}</style>
        </div>
    );
}
