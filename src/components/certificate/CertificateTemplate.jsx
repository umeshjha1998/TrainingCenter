import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateTemplate = forwardRef(({ data }, ref) => {
    if (!data) return null;

    return (
        <div ref={ref} className="print-container relative w-full max-w-[1024px] min-h-[1100px] print:min-h-0 bg-white shadow-2xl rounded-none sm:rounded-sm overflow-hidden flex flex-col mx-auto text-slate-900 print:shadow-none certificate-bg">
            <style jsx>{`
                .certificate-bg {
                    background-color: #ffffff;
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233a5a40' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
                @media print {
                    .certificate-border {
                        border: 2px solid #3a5a40 !important;
                    }
                }
            `}</style>
            {/* Borders */}
            <div className="absolute inset-4 border-2 border-primary/40 pointer-events-none certificate-border z-0"></div>
            <div className="absolute inset-6 border border-primary/20 pointer-events-none z-0"></div>

            {/* Corner Ornaments */}
            <svg className="absolute top-4 left-4 w-16 h-16 text-primary z-0" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path>
            </svg>
            <svg className="absolute top-4 right-4 w-16 h-16 text-primary transform rotate-90 z-0" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path>
            </svg>
            <svg className="absolute bottom-4 left-4 w-16 h-16 text-primary transform -rotate-90 z-0" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path>
            </svg>
            <svg className="absolute bottom-4 right-4 w-16 h-16 text-primary transform rotate-180 z-0" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path>
            </svg>

            <div className="relative z-10 flex flex-col h-full p-12 sm:p-16 text-center flex-grow">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-center mb-6">
                        <svg className="h-32 w-auto" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
                            <path d="M120 80 L120 180 C180 180, 220 160, 220 130 C220 100, 180 80, 120 80 Z" fill="#E8F1EB" stroke="#4A6741" strokeWidth="8"></path>
                            <line stroke="#4A6741" strokeWidth="8" x1="60" x2="120" y1="95" y2="95"></line>
                            <line stroke="#4A6741" strokeWidth="8" x1="40" x2="120" y1="120" y2="120"></line>
                            <line stroke="#4A6741" strokeWidth="8" x1="60" x2="120" y1="145" y2="145"></line>
                            <line stroke="#4A6741" strokeWidth="8" x1="220" x2="280" y1="130" y2="130"></line>
                            <text fill="#2F4F2F" fontFamily="monospace" fontSize="40" fontWeight="bold" x="120" y="70">AC</text>
                            <text fill="#2F4F2F" fontFamily="monospace" fontSize="40" fontWeight="bold" x="240" y="180">DC</text>
                            <text fill="#2F4F2F" fontFamily="monospace" fontSize="50" fontWeight="bold" x="155" y="145">&amp;</text>
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase mb-2">AC &amp; DC Technical Institute</h1>
                    <p className="text-primary font-medium tracking-widest text-sm uppercase">Excellence in Technical Training</p>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h2 className="text-4xl sm:text-5xl font-serif text-slate-800 mb-4 italic">Certificate of Completion</h2>
                    <div className="w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto"></div>
                </div>

                {/* Content */}
                <div className="mb-6 flex-grow flex flex-col justify-center">
                    <p className="text-slate-500 text-lg mb-4 font-serif italic">This is to certify that</p>
                    <h3 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-6 border-b-2 border-slate-200 inline-block px-10 pb-2 self-center">
                        {data.studentName}
                    </h3>
                    <p className="text-slate-500 text-lg mb-2 font-serif italic">has successfully completed the {data.courseDuration || "6 Months"} training course in</p>
                    <h4 className="text-2xl font-bold text-primary mb-8 uppercase tracking-wide">
                        {data.courseName}
                    </h4>

                    {/* Marks Table */}
                    {data.marks && data.marks.length > 0 && (
                        <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden mb-8 shadow-sm text-base">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 w-1/2">Subject</th>
                                        <th className="px-6 py-3 text-right">Max Marks</th>
                                        <th className="px-6 py-3 text-right">Obtained</th>
                                        <th className="px-6 py-3 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {data.marks.map((item, index) => {
                                        // Try to parse max marks and obtained if it's in a string like "80 / 100" or passed as an object directly
                                        let displayMax = "100";
                                        let displayObtained = "N/A";
                                        let displayGrade = "-";
                                        let obtainedVal = 0;
                                        let totalVal = 100;

                                        // Depending on how marks were transformed in PublicCertificate.jsx
                                        // It might be formatted as "95 / 100" in item.score
                                        if (item.score && typeof item.score === 'string' && item.score.includes('/')) {
                                            const parts = item.score.split('/').map(p => p.trim());
                                            displayObtained = parts[0];
                                            displayMax = parts[1];
                                            obtainedVal = parseFloat(displayObtained);
                                            totalVal = parseFloat(displayMax);
                                        } else if (item.maxMarks || item.obtained) {
                                            // Or if it was modified to pass raw objects
                                            displayObtained = item.obtained || "0";
                                            displayMax = item.total || item.maxMarks || "100";
                                            obtainedVal = parseFloat(displayObtained);
                                            totalVal = parseFloat(displayMax);
                                        } else {
                                            displayObtained = item.score;
                                        }

                                        if (!isNaN(obtainedVal) && !isNaN(totalVal) && totalVal > 0) {
                                            const pct = (obtainedVal / totalVal) * 100;
                                            if (pct >= 90) displayGrade = "A+";
                                            else if (pct >= 80) displayGrade = "A";
                                            else if (pct >= 70) displayGrade = "B+";
                                            else if (pct >= 60) displayGrade = "B";
                                            else if (pct >= 50) displayGrade = "C";
                                            else displayGrade = "F";
                                        }

                                        return (
                                            <tr key={index}>
                                                <td className="px-6 py-3 font-medium">{item.subject}</td>
                                                <td className="px-6 py-3 text-slate-500 text-right">{displayMax}</td>
                                                <td className="px-6 py-3 text-slate-900 font-bold text-right">{displayObtained}</td>
                                                <td className="px-6 py-3 text-center text-primary font-bold">{displayGrade}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="bg-primary/10 border-t border-primary/20">
                                    <tr>
                                        {(() => {
                                            let sumMax = 0;
                                            let sumObtained = 0;
                                            data.marks.forEach(item => {
                                                if (item.score && typeof item.score === 'string' && item.score.includes('/')) {
                                                    const parts = item.score.split('/');
                                                    sumObtained += parseFloat(parts[0]) || 0;
                                                    sumMax += parseFloat(parts[1]) || 0;
                                                } else {
                                                    sumObtained += parseFloat(item.obtained || item.score || 0);
                                                    sumMax += parseFloat(item.total || item.maxMarks || 0);
                                                }
                                            });
                                            const totalPct = sumMax > 0 ? ((sumObtained / sumMax) * 100).toFixed(1) : 0;

                                            return (
                                                <>
                                                    <td className="px-6 py-4 font-bold text-slate-900 text-lg">Total Score</td>
                                                    <td className="px-6 py-4 text-right text-slate-600 font-medium">{sumMax > 0 ? sumMax : "-"}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-primary text-lg">{sumObtained > 0 ? sumObtained : "-"}</td>
                                                    <td className="px-6 py-4 text-center font-bold text-primary text-lg">{totalPct > 0 ? `${Math.round(totalPct)}%` : "-"}</td>
                                                </>
                                            );
                                        })()}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-end mt-auto pt-8 border-t border-slate-100 relative">
                    <div className="text-left mb-6 sm:mb-0 w-full sm:w-auto">
                        <div className="flex items-center gap-6">
                            <div className="bg-white p-3 border-2 border-primary/20 rounded-lg shadow-sm">
                                <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : '#'} size={120} />
                            </div>
                            <div className="flex flex-col justify-center h-40">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">Certificate ID</p>
                                <p className="text-xl font-mono font-bold text-slate-800 mb-4">{data.certificateId}</p>
                                <p className="text-sm text-slate-500">Issued: <span className="font-bold text-slate-700">{data.issueDate}</span></p>
                                <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                                    <span className="material-icons text-sm notranslate" translate="no">qr_code_scanner</span>
                                    Scan to verify
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center sm:text-right w-full sm:w-auto relative z-20">
                        <div className="font-signature text-6xl text-primary mb-1 pr-4 transform -rotate-2 relative z-10" style={{ lineHeight: 0.8, paddingBottom: "0.5rem" }}>
                            {data.instructorName || "Nandan Jha"}
                        </div>
                        <div className="h-0.5 w-56 bg-slate-800 ml-auto mr-auto sm:mr-0 mb-3"></div>
                        <p className="text-lg font-bold text-slate-900 uppercase tracking-wide">{data.instructorName || "Nandan Jha"}</p>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Director</p>
                    </div>
                </div>

                {/* Seal */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:bottom-20 md:right-20 md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center opacity-90 pointer-events-none z-0">
                    <div className="w-28 h-28 rounded-full border-2 border-primary bg-background-light flex items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <div className="text-center transform -rotate-12">
                            <span className="block text-[10px] font-bold text-primary uppercase tracking-widest">Official</span>
                            <span className="material-icons text-4xl text-primary notranslate" translate="no">workspace_premium</span>
                            <span className="block text-[10px] font-bold text-primary uppercase tracking-widest">Seal</span>
                        </div>
                    </div>
                </div>

                {/* Printable Version Number */}
                {data.version ? (
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono hidden print:block">
                        v{data.version}
                    </div>
                ) : null}
            </div>
        </div>
    );
});

export default CertificateTemplate;
