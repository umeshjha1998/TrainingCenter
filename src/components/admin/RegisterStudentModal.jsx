import React, { useState, useEffect } from "react";
// Note: Actual registration with Firebase Auth requires being logged out or using secondary app.
// For this Admin UI, we will mimic the form visual as requested, but maybe just log the data or show a "Feature restricted" message.
// However, the user wants to SEE the fields. So we show the fields.
// We can try to add to Firestore directly as a "Pre-registered" user.

import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";

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
    const [devOtpMsg, setDevOtpMsg] = useState("");

    useEffect(() => {
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
        setDevOtpMsg("");
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
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
                        setDevOtpMsg(`[DEV MODE] Your OTP is: ${otp}`);
                    }
                    toast.success("OTP sent successfully to email.");
                } else {
                    toast.error(result.error || "Failed to send OTP email.");
                }
            } catch (err) {
                toast.error("Error communicating with server for OTP.");
            }
            setLoading(false);
            return;
        }

        if (emailChanged && userOtp !== generatedOtp) {
            return toast.error("Invalid OTP code.");
        }

        setLoading(true);
        try {
            if (initialData?.id) {
                // Update existing user
                const userRef = doc(db, "users", initialData.id);
                const updates = { ...formData };

                // Password restriction
                if (updates.password && updates.password.trim() !== "") {
                    toast.warning("Note: Password cannot be updated by Admin directly. Please use 'Reset Password' flow.");
                    delete updates.password;
                } else {
                    delete updates.password;
                }

                await updateDoc(userRef, updates);
                toast.success("Student details updated successfully.");
            } else {
                // Create new user using Secondary App
                const { initializeApp } = await import("firebase/app");
                const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");

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
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password || "password123");
                const newUser = userCredential.user;

                // 3. Save to Firestore (using main app's db instance)
                const { setDoc } = await import("firebase/firestore");

                await setDoc(doc(db, "users", newUser.uid), {
                    ...formData,
                    role: "student",
                    uid: newUser.uid,
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
                        userId: "admin",
                        isGlobal: false,
                        type: "info",
                        read: false,
                        createdAt: new Date()
                    });
                } catch (error) {
                    console.error("Error creating notification", error);
                }

                toast.success("Student registered successfully with access enabled.");
            }
            onClose();
        } catch (error) {
            console.error("Error saving student:", error);
            toast.error("Failed to save student record");
        }
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {initialData ? "Edit Student" : "Register New Student"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" required value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{initialData ? "New Password (Optional)" : "Initial Password"}</Label>
                            <Input id="password" name="password" type="text" placeholder={initialData ? "Leave empty to keep current" : "Set temporary password"} value={formData.password} onChange={handleChange} />
                        </div>
                    </div>

                    {otpSent && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-primary/30 space-y-2">
                            <Label htmlFor="userOtp">Enter OTP sent to {formData.email}</Label>
                            <Input
                                id="userOtp"
                                name="userOtp"
                                required
                                type="text"
                                maxLength="6"
                                placeholder="6-digit code"
                                className="text-center tracking-[0.2em] font-mono text-lg"
                                value={userOtp}
                                onChange={(e) => setUserOtp(e.target.value)}
                            />
                            {devOtpMsg && (
                                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-md">
                                    <p className="text-xs font-medium text-amber-800">For testing/development:</p>
                                    <p className="text-lg font-bold tracking-wider text-amber-900 mt-1">{devOtpMsg}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : (otpSent ? "Verify & Save" : (initialData ? (formData.email !== initialData.email ? "Send OTP to Save" : "Update Student") : "Send OTP to Save"))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
