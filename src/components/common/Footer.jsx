import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-slate-900 dark:bg-black text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 flex items-center justify-center bg-white/90 rounded p-1 text-primary">
                                <svg
                                    className="w-full h-full"
                                    fill="currentColor"
                                    viewBox="0 0 100 100"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M40 30 V70 C40 70 75 70 75 50 C75 30 40 30 40 30 Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                    ></path>
                                    <path d="M15 40 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M15 50 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M15 60 H40" stroke="currentColor" strokeWidth="6"></path>
                                    <path d="M75 50 H90" stroke="currentColor" strokeWidth="6"></path>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="20"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        x="40"
                                        y="25"
                                    >
                                        AC
                                    </text>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="20"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        x="85"
                                        y="75"
                                    >
                                        DC
                                    </text>
                                    <text
                                        fill="currentColor"
                                        fontFamily="Arial, sans-serif"
                                        fontSize="22"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        x="50"
                                        y="58"
                                    >
                                        &amp;
                                    </text>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base text-white leading-none">
                                    AC &amp; DC
                                </span>
                                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                                    Tech Institute
                                </span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400">
                            Building the technical workforce of tomorrow with hands-on training
                            and industry-recognized certifications.
                        </p>
                        <div className="flex gap-4">
                            <a
                                className="w-8 h-8 rounded bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-slate-400"
                                href="#"
                            >
                                <span className="material-icons text-sm">facebook</span>
                            </a>
                            <a
                                className="w-8 h-8 rounded bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-slate-400"
                                href="#"
                            >
                                <span className="material-icons text-sm">call</span>
                            </a>
                            <a
                                className="w-8 h-8 rounded bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-slate-400"
                                href="#"
                            >
                                <span className="material-icons text-sm">mail</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link className="hover:text-primary transition-colors" to="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#courses">
                                    All Courses
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#verify">
                                    Certificate Verification
                                </a>
                            </li>
                            <li>
                                <Link className="hover:text-primary transition-colors" to="/admin-login">
                                    Admin Login
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-primary transition-colors" to="/student-dashboard">
                                    Student Portal
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Top Courses</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    AC Repair &amp; Maintenance
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Motor Winding
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Inverter Technology
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Home Wiring
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-primary text-base mt-0.5">
                                    location_on
                                </span>
                                <span>
                                    Rambhadrapur, Bahadurpur, Darbhanga,
                                    <br />
                                    Bihar, India - 847101
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-primary text-base">phone</span>
                                <span>+91 9470241901</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-primary text-base">email</span>
                                <span>nandan.bbc@gmail.com</span>
                            </li>
                        </ul>
                        <div className="mt-6 w-full h-32 bg-slate-800 rounded-lg overflow-hidden relative group cursor-pointer border border-slate-700">
                            <img
                                alt="Map location of Darbhanga"
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                                data-location="Darbhanga"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc21DCp9AOAGrXaSq69lb7_xZqKW7W-2xu2yrUwLpXwQLgNgl94yymIzD12bpJCVXfXmbICNEYDySgwX-XuuZoFDLnegJicp2fnyL64ASTDpnYDv8ypHZVP9fK7XOisIxGrPyTz26iPE0sHawCZUjPE8JNOUEnOMIrZG5FcUoL1JFTgJIvOlDYofZd5l5HwwG-6LZd1SgyQd0Qy-RTof8HNcmfIgqxhmF1eAa0AdcRI4cvsdbqGj5COgpIAKPoK_3LOEks3c6HVJk"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-slate-900/80 px-3 py-1 rounded text-xs text-white">
                                    View on Map
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2024 AC &amp; DC Technical Institute. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-white transition-colors" href="#">
                            Privacy Policy
                        </a>
                        <a className="hover:text-white transition-colors" href="#">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
