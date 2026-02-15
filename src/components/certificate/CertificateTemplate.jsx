import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateTemplate = forwardRef(({ data }, ref) => {
    if (!data) return null;

    return (
        <div ref={ref} className="print-container relative w-full max-w-[1024px] min-h-[800px] print:min-h-0 bg-white shadow-2xl rounded-none sm:rounded-sm overflow-hidden flex flex-col mx-auto text-slate-900 print:border-none print:shadow-none">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(#3a5a40 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* Borders */}
            <div className="absolute inset-4 border-4 border-primary/40 pointer-events-none z-10"></div>
            <div className="absolute inset-6 border border-primary/20 pointer-events-none z-10"></div>

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-16 h-16 text-primary z-10">
                <svg fill="currentColor" viewBox="0 0 100 100"><path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path></svg>
            </div>
            <div className="absolute top-4 right-4 w-16 h-16 text-primary transform rotate-90 z-10">
                <svg fill="currentColor" viewBox="0 0 100 100"><path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path></svg>
            </div>
            <div className="absolute bottom-4 left-4 w-16 h-16 text-primary transform -rotate-90 z-10">
                <svg fill="currentColor" viewBox="0 0 100 100"><path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path></svg>
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16 text-primary transform rotate-180 z-10">
                <svg fill="currentColor" viewBox="0 0 100 100"><path d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z"></path></svg>
            </div>

            <div className="relative z-20 flex flex-col h-full p-12 sm:p-16 print:p-8 text-center">
                {/* Header */}
                <div className="mb-8 print:mb-4">
                    <div className="flex justify-center mb-4 print:mb-2">
                        <div className="h-20 w-20 print:h-16 print:w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border-2 border-primary">
                            <span className="material-icons text-4xl print:text-3xl">memory</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl print:text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase mb-2 print:mb-1">AC &amp; DC Technical Institute</h1>
                    <p className="text-primary font-medium tracking-widest text-sm uppercase">Excellence in Technical Training</p>
                </div>

                {/* Title */}
                <div className="mb-8 print:mb-4">
                    <h2 className="text-4xl sm:text-5xl print:text-4xl font-serif text-slate-800 mb-4 print:mb-2 italic">Certificate of Completion</h2>
                    <div className="w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto"></div>
                </div>

                {/* Content */}
                <div className="mb-6 print:mb-4 flex-grow flex flex-col justify-center">
                    <p className="text-slate-500 text-lg mb-4 print:mb-2 font-serif italic">This is to certify that</p>
                    <h3 className="text-4xl sm:text-5xl print:text-4xl font-serif font-bold text-slate-900 mb-6 print:mb-4 border-b-2 border-slate-200 inline-block px-10 pb-2 self-center">
                        {data.studentName}
                    </h3>
                    <p className="text-slate-500 text-lg mb-2 font-serif italic">has successfully completed the {data.courseDuration || "6 Months"} training course in</p>
                    <h4 className="text-2xl font-bold text-primary mb-8 print:mb-4 uppercase tracking-wide">
                        {data.courseName}
                    </h4>

                    {/* Marks Table */}
                    {data.marks && (
                        <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-sm overflow-hidden mb-8 print:mb-4 shadow-sm text-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 w-1/2">Module</th>
                                        <th className="px-4 py-2 text-right">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {data.marks.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2">{item.subject}</td>
                                            <td className="px-4 py-2 text-right font-bold">{item.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-end mt-auto pt-8 print:pt-4 border-t border-slate-100 relative">
                    <div className="text-left mb-6 sm:mb-0 w-full sm:w-auto">
                        <div className="flex items-center gap-4">
                            {/* QR Code */}
                            <div className="bg-white p-2 border border-slate-200 rounded shadow-sm">
                                <QRCodeSVG value={window.location.href} size={96} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">Certificate ID</p>
                                <p className="text-lg font-mono font-bold text-slate-800">{data.certificateId}</p>
                                <p className="text-xs text-slate-500 mt-1">Issued: <span className="font-bold text-slate-700">{data.issueDate}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center sm:text-right w-full sm:w-auto relative">
                        <div className="font-serif text-4xl text-primary mb-2 transform -rotate-2">
                            Nandan Jha
                        </div>
                        <div className="h-0.5 w-48 bg-slate-800 ml-auto mr-auto sm:mr-0 mb-2"></div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">Nandan Jha</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Director</p>
                    </div>
                </div>
                {/* Version Number */}
                <div className="absolute top-8 right-8 text-sm font-bold text-slate-500 bg-white/80 px-3 py-1 rounded border border-slate-200 shadow-sm print:hidden">
                    {data.version ? `Version ${data.version}` : ''}
                </div>

                {/* Printable Version Number (Less Obtrusive) */}
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono hidden print:block">
                    {data.version ? `v${data.version}` : ''}
                </div>
            </div>
        </div>
    );
});

export default CertificateTemplate;
