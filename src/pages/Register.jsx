import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        address: "",
        aadhar: "",
        pan: "",
        passport: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setError("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Save additional user info to Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: formData.fullName,
                phone: formData.phone,
                gender: formData.gender,
                address: formData.address,
                aadhar: formData.aadhar,
                pan: formData.pan,
                passport: formData.passport,
                role: "student", // Default role
                email: formData.email,
                createdAt: new Date()
            });

            await sendEmailVerification(user);
            navigate("/verify-email");

        } catch (err) {
            setError("Failed to create account: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
            <header className="w-full max-w-5xl mb-12 text-center flex flex-col items-center relative">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AC &amp; DC Technical Institute</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Excellence in Electrical Engineering & Technology</p>
            </header>

            <main className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Student Registration</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please fill in your details to create an account.</p>
                    </div>
                </div>
                <div className="p-8">
                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="material-icons text-primary text-xl">badge</span>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Personal Information</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                                    <input name="fullName" required type="text" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender *</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center"><input type="radio" name="gender" value="male" className="mr-2" onChange={handleChange} /> Male</label>
                                        <label className="flex items-center"><input type="radio" name="gender" value="female" className="mr-2" onChange={handleChange} /> Female</label>
                                        <label className="flex items-center"><input type="radio" name="gender" value="other" className="mr-2" onChange={handleChange} /> Other</label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                                    <input name="phone" required type="tel" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</label>
                                    <input name="email" required type="email" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Documents & Address */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="material-icons text-primary text-xl">folder_shared</span>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Identity & Documents</h3>
                                </div>
                                <input name="aadhar" placeholder="Aadhar Number (Optional)" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 mb-4 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.aadhar} onChange={handleChange} />
                                <input name="pan" placeholder="PAN Number (Optional)" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 mb-4 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.pan} onChange={handleChange} />
                                <input name="passport" placeholder="Passport Number (Optional)" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 mb-4 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.passport} onChange={handleChange} />

                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Permanent Address *</label>
                                <textarea name="address" required className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" rows="3" value={formData.address} onChange={handleChange}></textarea>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password *</label>
                                        <input name="password" required type="password" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.password} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password *</label>
                                        <input name="confirmPassword" required type="password" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150" value={formData.confirmPassword} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary">Already have an account? Log in</Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all disabled:opacity-50">
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
