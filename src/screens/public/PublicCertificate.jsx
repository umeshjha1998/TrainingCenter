"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CertificateTemplate from '../../components/certificate/CertificateTemplate';

export default function PublicCertificate() {
    const { id } = useParams();
    const certificateRef = useRef();
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id) return;

            try {
                // Dynamic import to keep bundle size small if this is a standalone page
                const { doc, getDoc, collection, query, where, getDocs } = await import("firebase/firestore");
                const { db } = await import("../../firebase");

                // 1. Try fetching by Document ID (direct match)
                let certDataRaw = null;
                const docRef = doc(db, "certificates", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    certDataRaw = docSnap.data();
                } else {
                    // 2. Try fetching by Display ID (field match)
                    const q = query(collection(db, "certificates"), where("displayId", "==", id));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        certDataRaw = querySnapshot.docs[0].data();
                    }
                }

                if (certDataRaw) {
                    const data = certDataRaw;

                    let studentName = data.student;
                    let courseName = data.course;
                    let courseDuration = data.duration; // Fallback if stored directly
                    let instructorName = data.instructorName || data.instructor; // Snapshot or fallback

                    // Fetch latest names and duration if IDs exist
                    try {
                        if (data.studentId) {
                            const studentRef = doc(db, "users", data.studentId);
                            const studentSnap = await getDoc(studentRef);
                            if (studentSnap.exists()) {
                                const sData = studentSnap.data();
                                studentName = sData.fullName || sData.name || studentName;
                            }
                        }
                        if (data.courseId) {
                            const courseRef = doc(db, "courses", data.courseId);
                            const courseSnap = await getDoc(courseRef);
                            if (courseSnap.exists()) {
                                const cData = courseSnap.data();
                                courseName = cData.name || courseName;
                                // Fetch duration from Course
                                if (cData.duration) {
                                    courseDuration = cData.duration;
                                }
                                // If instructor missing in cert, use current course instructor
                                if (!instructorName && cData.instructor) {
                                    instructorName = cData.instructor;
                                }
                            }
                        }
                    } catch (e) {
                        console.warn("Failed to fetch referenced entities", e);
                    }

                    // Transform marks object to array for template
                    let marksArray = [];
                    if (data.marks && !Array.isArray(data.marks)) {
                        marksArray = Object.entries(data.marks).map(([subject, details]) => ({
                            subject,
                            score: `${details.obtained} / ${details.total}`
                        }));
                    } else if (Array.isArray(data.marks)) {
                        // Fallback for any old data or mock structure
                        marksArray = data.marks;
                    }

                    console.log("Certificate source data:", data);

                    setCertificateData({
                        studentName: studentName,
                        courseName: courseName,
                        courseDuration: courseDuration, // Add duration
                        instructorName: instructorName,
                        certificateId: data.displayId || id,
                        issueDate: data.date,
                        marks: marksArray
                    });
                } else {
                    setCertificateData(null);
                }
            } catch (error) {
                console.error("Error fetching certificate:", error);
                setCertificateData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading Certificate...</div>;
    }

    if (!certificateData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="text-red-500 mb-6 text-xl font-medium">Certificate not found.</div>
                <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span className="material-icons text-sm notranslate" translate="no">home</span>
                    Back to Home
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-8 sm:py-12 print:bg-white print:p-0">
            {/* Actions Bar - Hidden in Print */}
            <div className="w-full max-w-[1024px] px-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <span className="material-icons text-lg text-green-600 notranslate" translate="no">verified_user</span>
                    <span>Official Digital Record</span>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">
                        <button title="Share via Email" onClick={() => window.open(`mailto:?subject=${encodeURIComponent("My Certificate")}&body=${encodeURIComponent("Check out my certificate: " + window.location.href)}`, '_blank')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </button>
                        <button title="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-slate-500 hover:text-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                        </button>
                        <button title="Share on X (Twitter)" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out my certificate from AC & DC Technical Institute!")}`, '_blank')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-black dark:hover:text-white flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        </button>
                        <button title="Share on Reddit" onClick={() => window.open(`https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent("My Certificate from AC & DC Technical Institute")}`, '_blank')} className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors text-slate-500 hover:text-orange-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.896-12.871a2.126 2.126 0 00-2.072 1.631c-.394.019-.8.083-1.203.18-.885.215-1.57.51-2.054.88-.636.486-.968 1.12-.968 1.848 0 1.95 2.805 3.535 6.257 3.535s6.258-1.585 6.258-3.535c0-.728-.332-1.362-.968-1.848-.483-.37-1.169-.665-2.054-.88-.403-.097-.809-.161-1.203-.18a2.126 2.126 0 10-2.887 1.252l-1.096.002a1.868 1.868 0 01-1.3-.474l-.946-.946a2.126 2.126 0 10-2.766-1.465zM9.54 14.503a1.442 1.442 0 110-2.884 1.442 1.442 0 010 2.884zm4.92 0a1.442 1.442 0 110-2.884 1.442 1.442 0 010 2.884zm-3.834 1.4a.456.456 0 00.1-.013c.277.065.688.113 1.272.113s.995-.048 1.271-.113a.455.455 0 00.32-1.07.455.455 0 00-.312.083 4.148 4.148 0 01-1.28.188A4.14 4.14 0 0110.72 15a.455.455 0 00-.093 1.09z"></path></svg>
                        </button>
                        <button title="Share on WhatsApp" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my certificate: " + window.location.href)}`, '_blank')} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors text-slate-500 hover:text-green-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413L20.464 3.488z"></path></svg>
                        </button>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium"
                    >
                        <span className="material-icons text-lg notranslate" translate="no">print</span>
                        Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* Certificate Component */}
            <CertificateTemplate ref={certificateRef} data={certificateData} />

            {/* Footer - Hidden in Print */}
            <div className="mt-8 text-center pb-8 print:hidden">
                <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
                    <span className="material-icons text-base text-green-600 notranslate" translate="no">check_circle</span>
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
