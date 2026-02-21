import React, { useState } from "react";
// Note: Actual registration with Firebase Auth requires being logged out or using secondary app.
// For this Admin UI, we will mimic the form visual as requested, but maybe just log the data or show a "Feature restricted" message.
// However, the user wants to SEE the fields. So we show the fields.
// We can try to add to Firestore directly as a "Pre-registered" user.

import { createPortal } from "react-dom";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function RegisterStudentModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "male",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [userOtp, setUserOtp] = useState("");

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                fullName: initialData.fullName || initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                address: initialData.address || "",
                gender: initialData.gender || "male",
                password: "" // Don't pre-fill password
            });
        } else if (isOpen) {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                address: "",
                gender: "male",
                password: ""
            });
        }
        setOtpSent(false);
        setGeneratedOtp("");
        setUserOtp("");
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailChanged = initialData ? formData.email !== initialData.email : true;

        if (emailChanged && !otpSent) {
            setLoading(true);
            try {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedOtp(otp);

                const response = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, otp })
                });

                const result = await response.json();
                if (result.success) {
                    setOtpSent(true);
                    if (result.devMode) {
                        alert("[DEV MODE] Your OTP is: " + otp);
                    }
                } else {
                    alert(result.error || "Failed to send OTP email.");
                }
            } catch (err) {
                alert("Error communicating with server for OTP.");
            }
            setLoading(false);
            return;
        }

        if (emailChanged && userOtp !== generatedOtp) {
            return alert("Invalid OTP code.");
        }

        setLoading(true);
        try {
            if (initialData?.id) {
                // Update existing user
                const userRef = doc(db, "users", initialData.id);
                const updates = { ...formData };

                // Password restriction
                if (updates.password && updates.password.trim() !== "") {
                    alert("Note: Password cannot be updated by Admin directly. Please use 'Reset Password' flow.");
                    delete updates.password;
                } else {
                    delete updates.password;
                }

                await updateDoc(userRef, updates);
                alert("Student details updated successfully.");
            } else {
                // Create new user using Secondary App
                const { initializeApp } = await import("firebase/app");
                const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
                // Removed duplicate setDoc import


                const firebaseConfig = {
                    apiKey: "AIzaSyBoouVB5yrmkgZeFTzBadj7XpzbBGNlz7s",
                    authDomain: "ac-dc-tech-institute-prod-v1.firebaseapp.com",
                    projectId: "ac-dc-tech-institute-prod-v1",
                    storageBucket: "ac-dc-tech-institute-prod-v1.firebasestorage.app",
                    messagingSenderId: "234050604622",
                    appId: "1:234050604622:web:cfa7456d9087ae6d55fd1f"
                };

                const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
                const secondaryAuth = getAuth(secondaryApp);

                // 2. Create User
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password || "password123"); // Default password if empty
                const newUser = userCredential.user;

                // 3. Save to Firestore (using main app's db instance)
                // 3. Save to Firestore (using main app's db instance)
                const { setDoc, addDoc, collection } = await import("firebase/firestore"); // Need setDoc to specify ID matches Auth UID

                await setDoc(doc(db, "users", newUser.uid), {
                    ...formData,
                    role: "student", // Enforce role
                    uid: newUser.uid, // Store UID in doc
                    createdAt: new Date(),
                    enrolledCourses: [],
                    status: "Active"
                });

                // Notification for Student
                try {
                    await addDoc(collection(db, "notifications"), {
                        title: "Welcome to AC & DC",
                        message: `Welcome ${formData.fullName}! Your registration is complete. You can now access your dashboard.`,
                        userId: newUser.uid,
                        isGlobal: false,
                        type: "success",
                        read: false,
                        createdAt: new Date()
                    });

                    // Keep the admin notification too
                    await addDoc(collection(db, "notifications"), {
                        title: "New Student Registered",
                        message: `${formData.fullName} has been registered successfully.`,
                        userId: "admin", // Target admin specifically
                        isGlobal: false,
                        type: "info",
                        read: false,
                        createdAt: new Date()
                    });
                } catch (error) {
                    console.error("Error creating notification", error);
                }

                alert("Student registered successfully with access enabled.");
            }
            onClose();
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Failed to save student record");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                                {initialData ? "Edit Student" : "Register New Student"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                    <input name="fullName" type="text" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input name="email" type="email" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.email} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                    <input name="phone" type="tel" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                                    <textarea name="address" rows="2" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.address} onChange={handleChange}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                                    <select name="gender" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.gender} onChange={handleChange}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{initialData ? "New Password (Optional)" : "Initial Password"}</label>
                                    <input name="password" type="text" placeholder={initialData ? "Leave empty to keep current" : "Set temporary password"} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.password} onChange={handleChange} />
                                </div>
                            </div>

                            {otpSent && (
                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-primary/30">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter OTP sent to {formData.email}</label>
                                    <input
                                        name="userOtp"
                                        required
                                        type="text"
                                        maxLength="6"
                                        placeholder="6-digit code"
                                        className="mt-2 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-900 border text-center tracking-[0.2em] font-mono text-lg"
                                        value={userOtp}
                                        onChange={(e) => setUserOtp(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                {loading ? "Processing..." : (otpSent ? "Verify & Save" : (initialData ? (formData.email !== initialData.email ? "Send OTP to Save" : "Update Student") : "Send OTP to Save"))}
                            </button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}
