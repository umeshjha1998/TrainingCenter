import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
    const [certId, setCertId] = useState("");
    const navigate = useNavigate();

    const handleVerify = () => {
        if (certId.trim()) {
            navigate(`/c/${certId.trim()}`);
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display antialiased selection:bg-primary/30 selection:text-primary">
            <Navbar />

            <header className="relative bg-slate-900 dark:bg-black overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="lg:w-2/3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-green-200 text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>{" "}
                            Admissions Open 2024
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Master Technical Skills for a{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
                                Better Future
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                            Industry-leading vocational training in AC Repair, Motor Winding,
                            and Electrical Engineering. Get certified and job-ready with
                            hands-on workshops in Darbhanga.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                                href="#courses"
                            >
                                Explore Courses
                            </a>
                            <a
                                className="inline-flex justify-center items-center px-6 py-3 border border-slate-600 text-base font-medium rounded-lg text-white bg-slate-800/50 hover:bg-slate-700 backdrop-blur-sm transition-colors"
                                href="#verify"
                            >
                                <span className="material-icons text-sm mr-2">qr_code</span>{" "}
                                Verify Certificate
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl rounded-xl shadow-xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                <div className="flex-1 p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <span className="material-icons">school</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            5,000+
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Students Trained
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <span className="material-icons">handyman</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            100%
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Practical Training
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <span className="material-icons">verified</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            ISO
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Certified Institute
                        </p>
                    </div>
                </div>
            </div>

            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                alt="Students learning electrical repairs in a workshop"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmeyOX-e1GVgVvRe4aohZzrQRx5plCbtNJrcQvipfsdmhBs1T12CGhniRVbbdf9KZq54yV-2DMlEI0Cgors78m4SZYVyeMJAb02DlvKYYlcOqAq08M5Ame4mSS3D3JlaUWrAKdyCEn8uNgsezX4o38Xz6MgSkTfGBfjySlbVdl8qiaZLBTPPrbrTeEzaKT8_JL1t2VaZdp1bpHmj4U7Wu8a6qOMRZkBkgOsthiNAIjrERkI9nPbc1RtWOiHs2V2FjpeANgSgzFrwE"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <p className="text-white font-medium flex items-center gap-2">
                                    <span className="material-icons text-primary">location_on</span>{" "}
                                    Rambhadrapur, Darbhanga
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                            Who We Are
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                            Empowering Youth Through Technical Excellence
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
                            AC &amp; DC Technical Institute is the premier destination for
                            vocational training in Bihar. We bridge the gap between
                            theoretical knowledge and industrial application.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-primary mt-1">
                                    check_circle
                                </span>
                                <span className="text-slate-700 dark:text-slate-200">
                                    State-of-the-art labs with modern diagnostic tools.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-primary mt-1">
                                    check_circle
                                </span>
                                <span className="text-slate-700 dark:text-slate-200">
                                    Curriculum designed by industry veterans.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-primary mt-1">
                                    check_circle
                                </span>
                                <span className="text-slate-700 dark:text-slate-200">
                                    Placement assistance with top service centers.
                                </span>
                            </li>
                        </ul>
                        <a
                            className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1 group"
                            href="#contact"
                        >
                            Learn more about our mission{" "}
                            <span className="material-icons text-sm transition-transform group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            <section
                className="bg-slate-50 dark:bg-slate-800/50 py-20 border-y border-slate-200 dark:border-slate-800"
                id="courses"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Popular Technical Courses
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Choose from our wide range of certificate programs designed to get
                            you hired immediately.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 group flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt="Close up of refrigerator repair tools"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2NBGb_wkFZdnpIVDLiyJBRmwFPXfGf9HssEf5kR0f59Tm6Ks9UcWdT83UWAU6sGUoB0C23PN3NKubdv3EPNbKrTBj_keSbgYbsBVvudQnSH01z7LWXq6xmx5IabHFvRML-l1EH_J5KgA8N4sqj9KH9J1ApNuuqh-Le47CEqd3qehmOdCxu0PAqe19lCSP1ZEqXnY5kS4PQrOVaJ7irIJ_3zaatdPyDy92nU15Lj2g00zfcJ2aZ0kiIdiluvVnczZRHhtUwmQjF0U"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm">
                                    3 Months
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    Inverter Refrigerator Repair
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                    Comprehensive training on modern inverter technology fridges.
                                    Learn PCB diagnosis, gas charging, and compressor repair.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Certificate Course
                                    </span>
                                    <button className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1">
                                        Details <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 group flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt="Copper wire motor winding close up"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVKiKWaCANhM3HFBJz3-bEGlhkMvHB_55c3XlS5dTO7F7mcyLvnYxYcI3jApjtNzvg1ibqF6RNxN4M_7X4znPu678CN_1bJ4QPn4yA9Wy7W5b-Aq4F0jtWvUU0E8P6-Dxkc_fpzVsjssdrZSHeIXEhj_TLloJq41zk95-yXmyycn54VmlFS0w7NpWr7nhZdO7r9s33rwREtUPsfo3XwC__2NYIQkx14XRU244biaFeSAb-wtcuE0BqCOhE2p_JCy1gihP8bB5XZqY"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm">
                                    2 Months
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    Motor Winding Masterclass
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                    Master the art of rewinding AC and DC motors. Covers ceiling
                                    fans, cooler motors, and industrial pump motors.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Skill Workshop
                                    </span>
                                    <button className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1">
                                        Details <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 group flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    alt="Electronic circuit board repair soldering"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOYCjPZH4RURtlcX-XWGnraRa_2cieOUevXT7-lEvJoGYwnNdMP4gwS5DjLeh09JO9vJvRPkiRhvyBWi_BdybrxdWsqiysKTCxJsjD66ZJSG-3HX3KWWVcSEVn9vcKbIua5B673XjwRnpK7m5N0c2lJMxgPi131zMk53cNxIfHAcpqLiszYOlFNAp5KgS_EkAiPE_wyDeg3EyyuRZJFyTIhbrz1dBIKH-PlpoBdgcfeJG_TQ3IWv7VttIYKdh6Z2fzMrHEMvXUQK4"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm">
                                    6 Months
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    Advanced PCB Repair
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                    Deep dive into electronics. Learn to troubleshoot and repair
                                    complex PCBs for air conditioners, washing machines, and
                                    inverters.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Diploma
                                    </span>
                                    <button className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1">
                                        Details <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <a
                            className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 shadow-sm text-base font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            href="#courses"
                        >
                            View All Courses
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-primary overflow-hidden relative" id="verify">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                ></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                <span className="material-icons text-base">verified_user</span>{" "}
                                For Employers
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Instant Certificate Verification
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Validate the authenticity of any certificate issued by AC &amp;
                                DC Technical Institute instantly. Enter the unique Certificate ID
                                or scan the QR code.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    className="flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                                    placeholder="Enter Certificate ID"
                                    type="text"
                                    value={certId}
                                    onChange={(e) => setCertId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                />
                                <button
                                    onClick={handleVerify}
                                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                                    Verify Now <span className="material-icons text-sm">search</span>
                                </button>
                            </div>
                        </div>
                        <div className="md:w-5/12 flex justify-center">
                            <div className="relative w-48 h-48 bg-white p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center">
                                <span className="material-icons text-9xl text-slate-800">
                                    qr_code_2
                                </span>
                                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-slate-900">
                                    <span className="material-icons">check</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-center py-8 bg-slate-50 dark:bg-slate-900/50">
                <Link
                    to="/admin-login"
                    className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                    <span className="material-icons text-sm mr-2">admin_panel_settings</span>
                    Admin Login
                </Link>
            </div>

            <Footer />
        </div >
    );
}
