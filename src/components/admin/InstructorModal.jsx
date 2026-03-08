import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Upload, X, User } from "lucide-react";

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
import { toast } from "sonner";

export default function InstructorModal({ isOpen, onClose, initialData, courses = [] }) {
    const [formData, setFormData] = useState({
        name: "",
        expertise: "",
        email: "",
        phone: "",
        assignedCourses: [],
        imageUrl: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                expertise: initialData.expertise || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                assignedCourses: initialData.assignedCourses || [],
                imageUrl: initialData.imageUrl || ""
            });
            setImagePreview(initialData.imageUrl || "");
        } else {
            setFormData({ name: "", expertise: "", email: "", phone: "", assignedCourses: [], imageUrl: "" });
            setImagePreview("");
        }
        setImageFile(null);
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) {
                toast.error("Image size must be less than 500KB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(formData.imageUrl || "");
    };

    const handleCourseChange = (courseId, courseName, checked) => {
        setFormData(prev => {
            const currentCourses = prev.assignedCourses || [];
            if (checked) {
                return { ...prev, assignedCourses: [...currentCourses, { id: courseId, name: courseName }] };
            } else {
                return { ...prev, assignedCourses: currentCourses.filter(c => c.id !== courseId) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = formData.imageUrl;

            if (imageFile) {
                // Instead of uploading to Firebase Storage, use the Base64 data URL
                finalImageUrl = imagePreview;
            }

            const instructorData = {
                ...formData,
                imageUrl: finalImageUrl,
                updatedAt: new Date()
            };

            if (initialData?.id) {
                // Update existing instructor
                const instructorRef = doc(db, "instructors", initialData.id);
                await updateDoc(instructorRef, instructorData);
                toast.success("Instructor updated successfully!");
            } else {
                // Add new instructor
                await addDoc(collection(db, "instructors"), {
                    ...instructorData,
                    createdAt: new Date()
                });
                toast.success("Instructor added successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving instructor: ", error);
            toast.error("Failed to save instructor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{initialData ? "Edit Instructor" : "Register New Instructor"}</DialogTitle>
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
                                    <label htmlFor="image-upload" className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                                        <Upload size={16} />
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <div className="text-center space-y-3 w-full">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Instructor Photo
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-3">
                                        <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed text-left">
                                            <span className="font-bold flex items-center gap-1 mb-1">
                                                <Upload size={10} /> Requirements
                                            </span>
                                            • Professional headshot<br />
                                            • Clear & high quality<br />
                                            • Max 500KB size<br />
                                            • JPG or PNG only
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form Fields */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Instructor Name</Label>
                                    <Input id="name" name="name" type="text" required placeholder="e.g. Dr. Sarah Jones" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expertise">Expertise</Label>
                                    <Input id="expertise" name="expertise" type="text" required placeholder="e.g. Data Science, Web Development" value={formData.expertise} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" required placeholder="e.g. sarah.j@edu.com" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" type="tel" placeholder="e.g. +1 (555) 123-4567" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Courses</Label>
                                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-md p-3 bg-slate-50 dark:bg-slate-900">
                                        {courses.length > 0 ? courses.map(course => (
                                            <Label key={course.id} className="flex items-center gap-2 font-normal cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 p-1 rounded transition-colors">
                                                <Input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary cursor-pointer accent-primary shrink-0"
                                                    checked={(formData.assignedCourses || []).some(c => c.id === course.id)}
                                                    onChange={(e) => handleCourseChange(course.id, course.name, e.target.checked)}
                                                />
                                                <span className="text-slate-700 dark:text-slate-300 leading-tight block truncate ml-1">{course.name}</span>
                                            </Label>
                                        )) : (
                                            <div className="text-sm text-slate-500">No courses available.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (initialData ? "Update Instructor" : "Register Instructor")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
