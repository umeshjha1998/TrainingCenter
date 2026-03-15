import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateTemplate = forwardRef(({ data }, ref) => {
    if (!data) return null;

    return (
        <div ref={ref} className="print-container relative w-full max-w-[1100px] min-h-[850px] print:min-h-0 bg-white shadow-[0_0_80px_rgba(0,0,0,0.15)] print:shadow-none flex p-6 overflow-hidden mx-auto font-display text-slate-900">
            <style jsx>{`
                .guilloche-border {
                    background-color: white;
                    background-image: 
                        radial-gradient(circle at 100% 150%, transparent 24%, #1a4731 25%, #1a4731 28%, transparent 29%),
                        radial-gradient(circle at 0% 150%, transparent 24%, #1a4731 25%, #1a4731 28%, transparent 29%),
                        radial-gradient(circle at 50% 100%, transparent 19%, #1a4731 20%, #1a4731 23%, transparent 24%),
                        radial-gradient(circle at 100% 50%, transparent 5%, #1a4731 6%, #1a4731 9%, transparent 10%),
                        radial-gradient(circle at 0% 50%, transparent 5%, #1a4731 6%, #1a4731 9%, transparent 10%);
                    background-size: 40px 40px;
                }
                .certificate-inner {
                    background: radial-gradient(circle at center, #ffffff 0%, #fdfbf7 100%);
                    box-shadow: inset 0 0 100px rgba(184, 134, 11, 0.05);
                }

                .seal-layered {
                    background: radial-gradient(circle, #f3e5ab 0%, #b8860b 100%);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3), inset 0 0 10px rgba(0,0,0,0.2);
                }
                .font-cinzel { font-family: 'Cinzel', serif; }
                .font-signature { font-family: 'Great Vibes', cursive; }
                
                .high-visibility-text, .high-visibility-text th {
                    color: #000000 !important;
                    font-weight: 900 !important;
                }

                @media print {
                    @page {
                        size: portrait;
                        margin: 0;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-container {
                        display: block !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 1100px !important;
                        max-width: 1100px !important;
                        min-height: 0 !important;
                        height: auto !important;
                        border: none !important;
                        page-break-after: avoid;
                        page-break-inside: avoid;
                        zoom: 0.75;
                        transform: none !important;
                        margin-bottom: 0 !important;
                    }
                    .certificate-inner {
                        padding: 40px !important;
                        min-height: 0 !important;
                    }
                    .certificate-border-print {
                        border: 12px double rgba(26, 71, 49, 1) !important; 
                    }
                    .marks-table-container {
                        background: white !important;
                        backdrop-filter: none !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    .table-header-print {
                        background-color: #064e3b !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    .table-row-print {
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                }
            `}</style>

            <div className="absolute inset-0 guilloche-border opacity-10"></div>
            <div className="absolute inset-4 border-[12px] border-double border-primary/80 pointer-events-none certificate-border-print"></div>
            <div className="absolute inset-8 border border-gold/40 pointer-events-none certificate-border-gold-print"></div>

            <div className="relative z-10 w-full certificate-inner p-12 flex flex-col items-center text-center border border-primary/10">
                <div className="mb-6">
                    <svg className="h-28 w-auto drop-shadow-md" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
                        <path d="M120 80 L120 180 C180 180, 220 160, 220 130 C220 100, 180 80, 120 80 Z" fill="#ecfdf5" stroke="#1a4731" strokeWidth="8"></path>
                        <line stroke="#1a4731" strokeWidth="8" x1="60" x2="120" y1="95" y2="95"></line>
                        <line stroke="#1a4731" strokeWidth="8" x1="40" x2="120" y1="120" y2="120"></line>
                        <line stroke="#1a4731" strokeWidth="8" x1="60" x2="120" y1="145" y2="145"></line>
                        <line stroke="#1a4731" strokeWidth="8" x1="220" x2="280" y1="130" y2="130"></line>
                        <text fill="#064e3b" fontFamily="Cinzel" fontSize="42" fontWeight="bold" x="110" y="65">AC</text>
                        <text fill="#064e3b" fontFamily="Cinzel" fontSize="42" fontWeight="bold" x="230" y="195">DC</text>
                        <text fill="#b8860b" fontFamily="serif" fontSize="55" fontWeight="bold" x="155" y="145">&amp;</text>
                    </svg>
                </div>

                <div className="mb-4">
                    <h1 className="text-4xl font-cinzel font-bold text-emerald-950 tracking-[0.2em] uppercase">AC &amp; DC Technical Institute</h1>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="h-px w-12 bg-gold/60"></div>
                        <p className="font-bold tracking-widest text-sm uppercase high-visibility-text">Advancing Technical Proficiency Worldwide</p>
                        <div className="h-px w-12 bg-gold/60"></div>
                    </div>
                </div>

                <div className="mt-8 mb-6">
                    <h2 className="text-6xl font-serif italic text-slate-800 tracking-tight">Certificate of Completion</h2>
                </div>

                <div className="mb-8 w-full max-w-2xl">
                    <p className="text-slate-500 font-serif text-xl italic mb-6">This prestigious honor is conferred upon</p>
                    <h3 className="text-6xl font-serif font-bold text-emerald-900 mb-6 drop-shadow-sm tracking-wide">{data.studentName}</h3>
                    <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
                        Who has exhibited exceptional dedication and technical mastery in the comprehensive certification course of
                    </p>
                    <h4 className="text-3xl font-cinzel font-bold text-primary mt-4 border-t border-gold/20 pt-3 high-visibility-text">{data.courseName}</h4>
                    <p className="text-lg font-serif italic text-emerald-800 mt-2 border-b border-gold/20 pb-3 mb-10">Instructed by <span className="font-bold">{data.instructorName || "Prof. Nandan Jha"}</span></p>
                </div>

                {/* Marks Table */}
                {data.marks && data.marks.length > 0 && (
                    <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/40 border-2 border-primary/10 rounded-xl overflow-hidden shadow-xl mb-8 marks-table-container">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="bg-primary text-white font-cinzel tracking-wider text-sm table-header-print high-visibility-text">
                                    <th className="px-8 py-4 text-left font-semibold border-r border-white/20">Subject</th>
                                    <th className="px-8 py-4 text-center font-semibold border-r border-white/20">Max Marks</th>
                                    <th className="px-8 py-4 text-center font-semibold border-r border-white/20">Obtained</th>
                                    <th className="px-8 py-4 text-center font-semibold">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10 text-slate-800">
                                {data.marks.map((item, index) => {
                                    let displayMax = "100";
                                    let displayObtained = "N/A";
                                    let displayGrade = "-";
                                    let obtainedVal = 0;
                                    let totalVal = 100;

                                    if (item.score && typeof item.score === 'string' && item.score.includes('/')) {
                                        const parts = item.score.split('/').map(p => p.trim());
                                        displayObtained = parts[0];
                                        displayMax = parts[1];
                                        obtainedVal = parseFloat(displayObtained);
                                        totalVal = parseFloat(displayMax);
                                    } else if (item.maxMarks || item.obtained) {
                                        displayObtained = item.obtained || "0";
                                        displayMax = item.total || item.maxMarks || "100";
                                        obtainedVal = parseFloat(displayObtained);
                                        totalVal = parseFloat(displayMax);
                                    } else {
                                        displayObtained = item.score;
                                    }

                                    let gradeBgColor = "bg-slate-100";
                                    let gradeTextColor = "text-slate-800";
                                    let gradeBorderColor = "border-slate-200";

                                    if (!isNaN(obtainedVal) && !isNaN(totalVal) && totalVal > 0) {
                                        const pct = (obtainedVal / totalVal) * 100;
                                        if (pct >= 95) {
                                            displayGrade = "O";
                                            gradeBgColor = "bg-amber-100";
                                            gradeTextColor = "text-amber-900";
                                            gradeBorderColor = "border-amber-200";
                                        } else if (pct >= 90) {
                                            displayGrade = "A+";
                                            gradeBgColor = "bg-emerald-100";
                                            gradeTextColor = "text-emerald-800";
                                            gradeBorderColor = "border-emerald-200";
                                        } else if (pct >= 80) {
                                            displayGrade = "A";
                                            gradeBgColor = "bg-emerald-50";
                                            gradeTextColor = "text-emerald-700";
                                            gradeBorderColor = "border-emerald-200";
                                        } else if (pct >= 70) {
                                            displayGrade = "B+";
                                            gradeBgColor = "bg-blue-50";
                                            gradeTextColor = "text-blue-800";
                                            gradeBorderColor = "border-blue-200";
                                        } else if (pct >= 60) {
                                            displayGrade = "B";
                                            gradeBgColor = "bg-blue-50";
                                            gradeTextColor = "text-blue-700";
                                            gradeBorderColor = "border-blue-200";
                                        } else if (pct >= 50) {
                                            displayGrade = "C";
                                            gradeBgColor = "bg-orange-50";
                                            gradeTextColor = "text-orange-800";
                                            gradeBorderColor = "border-orange-200";
                                        } else {
                                            displayGrade = "F";
                                            gradeBgColor = "bg-red-50";
                                            gradeTextColor = "text-red-800";
                                            gradeBorderColor = "border-red-200";
                                        }
                                    }

                                    return (
                                        <tr key={index} className="hover:bg-primary/5 transition-colors table-row-print">
                                            <td className="px-8 py-4 text-left font-serif font-semibold border-r border-primary/10">{item.subject}</td>
                                            <td className="px-8 py-4 text-center text-slate-500 border-r border-primary/10">{displayMax}</td>
                                            <td className="px-8 py-4 text-center font-bold text-primary text-lg border-r border-primary/10 high-visibility-text !text-xl">{displayObtained}</td>
                                            <td className="px-8 py-4 text-center">
                                                <span className={`${gradeBgColor} ${gradeTextColor} px-4 py-2 rounded-full text-lg font-black border ${gradeBorderColor} uppercase shadow-sm !bg-white/70`}>
                                                    {displayGrade}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-slate-50/80 border-t-2 border-primary/20">
                                <tr className="font-bold">
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
                                                <td className="px-8 py-5 text-left font-cinzel text-lg text-emerald-950 uppercase border-r border-primary/10">Total Score</td>
                                                <td className="px-8 py-5 text-center text-slate-600 border-r border-primary/10">{sumMax > 0 ? sumMax : "-"}</td>
                                                <td className="px-8 py-5 text-center text-primary text-xl border-r border-primary/10 high-visibility-text !text-2xl">{sumObtained > 0 ? sumObtained : "-"}</td>
                                                <td className="px-8 py-5 text-center text-primary text-xl high-visibility-text !text-2xl">{totalPct > 0 ? `${totalPct}%` : "-"}</td>
                                            </>
                                        );
                                    })()}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                <div className="w-full flex justify-between items-end mt-12 relative z-20">
                    <div className="flex items-center gap-6">
                        <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-200 group relative">
                            <div className="bg-white p-2 rounded-lg">
                                <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : '#'} size={120} level="H" />
                            </div>
                            <div className="absolute inset-0 border border-primary/10 rounded-xl"></div>
                        </div>

                        {data.studentPhoto && (
                            <div className="bg-white p-2 pb-6 shadow-md border border-slate-200 rotate-[-2deg] shrink-0 print:border-slate-300 print:shadow-sm">
                                <div className="w-24 h-32 bg-slate-100 overflow-hidden border border-slate-100">
                                    <img src={data.studentPhoto} alt={data.studentName} className="w-full h-full object-cover sepia-[0.1] contrast-[1.05]" crossOrigin="anonymous" />
                                </div>
                            </div>
                        )}

                        <div className="text-left ml-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Verify Authenticity</p>
                            <p className="text-lg font-mono font-bold text-primary high-visibility-text">{data.certificateId}</p>
                            <div className="h-px w-full bg-gold/30 my-2"></div>
                            <p className="text-xs text-slate-500 font-medium italic">Validated: {data.issueDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Seal Layered */}
                        <div className="relative w-36 h-36">
                            <div className="absolute inset-0 seal-layered rounded-full opacity-30 print:opacity-80"></div>
                            <div className="absolute inset-0 flex items-center justify-center border-4 border-double border-gold/60 rounded-full scale-105"></div>
                            <div className="absolute inset-2 border-2 border-dashed border-primary/40 rounded-full"></div>
                            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-4">
                                <span className="material-icons text-4xl text-emerald-900/80 mb-1 notranslate" translate="no">workspace_premium</span>
                                <p className="text-[9px] font-bold text-emerald-950 uppercase leading-tight tracking-tighter">Official Certified<br />Institute Seal</p>
                                <div className="w-full h-px bg-gold/60 my-1"></div>
                                <p className="text-[8px] font-cinzel font-bold text-emerald-900 italic">EST. 1998</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="relative pointer-events-none">
                                <div className="font-signature text-6xl text-emerald-900/90 mb-[-1.5rem] relative z-20 select-none px-4 rotate-[-3deg]" style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>
                                    {data.instructorName || "Nandan Jha"}
                                </div>
                                <div className="absolute bottom-1 right-0 w-64 h-[2px] bg-gradient-to-l from-emerald-950 via-primary to-transparent z-10"></div>
                            </div>
                            <p className="text-xl font-cinzel font-bold text-emerald-950 tracking-wider relative z-30 pt-4">{data.instructorName || "Nandan Jha"}</p>
                            <p className="text-xs font-bold text-gold uppercase tracking-[0.3em] relative z-30">Director of Operations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;
