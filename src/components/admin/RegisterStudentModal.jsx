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
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                // Update existing user
                const userRef = doc(db, "users", initialData.id);
                const updates = { ...formData };
                if (!updates.password) delete updates.password; // Don't update password if empty

                await updateDoc(userRef, updates);
                alert("Student updated successfully.");
            } else {
                // Create new user
                await addDoc(collection(db, "users"), {
                    ...formData,
                    role: "student",
                    createdAt: new Date(),
                    enrolledCourses: [],
                    status: "Pending Auth"
                });
                alert("Student record created.");
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
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                {loading ? "Saving..." : (initialData ? "Update Student" : "Register Student")}
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
