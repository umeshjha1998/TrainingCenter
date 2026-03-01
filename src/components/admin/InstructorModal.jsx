import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";

export default function InstructorModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        expertise: "",
        email: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                expertise: initialData.expertise || "",
                email: initialData.email || "",
                phone: initialData.phone || ""
            });
        } else {
            setFormData({ name: "", expertise: "", email: "", phone: "" });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const instructorData = {
                ...formData,
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
                    createdAt: new Date(),
                    assignedCourses: []
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
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{initialData ? "Edit Instructor" : "Register New Instructor"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
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
