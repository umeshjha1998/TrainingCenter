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
import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import { normalizeImage } from "../../utils/imageProcessor";

export default function RegisterStudentModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "male",
        password: "",
        aadhar: "",
        pan: "",
        passport: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
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
                password: "", // Don't pre-fill password
                aadhar: initialData.aadhar || "",
                pan: initialData.pan || "",
                passport: initialData.passport || ""
            });
            setImagePreview(initialData.profilePhotoUrl || "");
        } else if (isOpen) {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                address: "",
                gender: "male",
                password: "",
                aadhar: "",
                pan: "",
                passport: ""
            });
            setImagePreview("");
        }
        setImageFile(null);
        setOtpSent(false);
        setGeneratedOtp("");
        setUserOtp("");
        setDevOtpMsg("");
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // setLoading(true); // Modal doesn't have a dedicated loading state for file select, we can just await
                const { file: compressedFile, dataUrl } = await normalizeImage(file, {
                    maxSizeMB: 0.5, // 500KB limit for modals
                    maxWidthOrHeight: 500,
                });
                setImageFile(compressedFile);
                setImagePreview(dataUrl);
            } catch (err) {
                console.error("Error processing image:", err);
                toast.error("Failed to process image.");
            }
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(initialData?.profilePhotoUrl || "");
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
        if (!initialData?.id && !imageFile) {
            return toast.error("Please upload a student photo before registering.");
        }

        setLoading(true);
        try {
            let finalImageUrl = initialData?.profilePhotoUrl || "";

            if (imageFile) {
                // Instead of uploading to Firebase Storage, use the Base64 data URL
                finalImageUrl = imagePreview;
            }

            if (initialData?.id) {
                // Update existing user
                const userRef = doc(db, "users", initialData.id);
                const updates = { ...formData, profilePhotoUrl: finalImageUrl };

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
                    profilePhotoUrl: finalImageUrl,
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

                    <div className="max-h-[75vh] overflow-y-auto pr-4 py-4">
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            {/* Left Column: Photo Upload */}
                            <div className="w-full md:w-[200px] flex flex-col items-center gap-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 md:pr-8 shrink-0">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-slate-400" />
                                        )}
                                    </div>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <label htmlFor="student-image-upload" className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                                        <Upload size={16} />
                                        <input
                                            id="student-image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <div className="text-center space-y-3 w-full">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Student Photo *
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-3">
                                        <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed text-left">
                                            <span className="font-bold flex items-center gap-1 mb-1">
                                                <Upload size={10} /> Requirements
                                            </span>
                                            • Clear frontal face<br />
                                            • Max 500KB size<br />
                                            • JPG or PNG only
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form Fields */}
                            <div className="flex-1 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <Label htmlFor="aadhar">Aadhar Number (Optional)</Label>
                                        <Input id="aadhar" name="aadhar" type="text" value={formData.aadhar} onChange={handleChange} placeholder="12-digit number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pan">PAN Number (Optional)</Label>
                                        <Input id="pan" name="pan" type="text" value={formData.pan} onChange={handleChange} placeholder="10-character code" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="passport">Passport Number (Optional)</Label>
                                        <Input id="passport" name="passport" type="text" value={formData.passport} onChange={handleChange} />
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
                                        <Label htmlFor="password">{initialData ? "New Password (Optional)" : "Initial Password *"}</Label>
                                        <Input id="password" name="password" type="text" placeholder={initialData ? "Leave empty to keep current" : "Set temporary password"} value={formData.password} onChange={handleChange} required={!initialData} />
                                    </div>
                                </div>
                            </div>
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
