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

export default function CourseModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        instructor: "",
        subjects: [],
        nextExam: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            let processedSubjects = [];
            if (Array.isArray(initialData.subjects)) {
                processedSubjects = initialData.subjects.map((sub, index) => {
                    // Check if subject is a string or object
                    if (typeof sub === 'string') {
                        return { id: Date.now() + index, name: sub };
                    }
                    return sub;
                });
            }

            setFormData({
                ...initialData,
                subjects: processedSubjects,
                nextExam: initialData.nextExam || ""
            });
        } else {
            setFormData({ name: "", duration: "", instructor: "", subjects: [], nextExam: "" });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { id: Date.now(), name: "" }]
        }));
    };

    const handleSubjectChange = (id, value) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.map(sub =>
                sub.id === id ? { ...sub, name: value } : sub
            )
        }));
    };

    const handleRemoveSubject = (id) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(sub => sub.id !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Filter valid subjects (non-empty)
        const validSubjectObjs = formData.subjects.filter(s => s.name.trim() !== "");

        // Validation: At least one subject required
        if (validSubjectObjs.length === 0) {
            toast.error("A course must have at least one subject.");
            setLoading(false);
            return;
        }

        try {
            // Convert subjects back to strings for storage to be consistent with INITIAL_COURSES
            const subjectsForDb = validSubjectObjs.map(s => s.name.trim());

            const courseData = {
                ...formData,
                subjects: subjectsForDb,
                updatedAt: new Date()
            };

            if (initialData?.id) {
                // Update existing course
                const courseRef = doc(db, "courses", initialData.id);
                await updateDoc(courseRef, courseData);
                toast.success("Course updated successfully!");
            } else {
                // Add new course
                await addDoc(collection(db, "courses"), {
                    ...courseData,
                    createdAt: new Date()
                });
                toast.success("Course added successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving course: ", error);
            toast.error("Failed to save course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{initialData ? "Edit Course" : "Add New Course"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Course Name</Label>
                            <Input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" name="duration" type="text" required placeholder="e.g. 6 Months" value={formData.duration} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instructor">Instructor Name</Label>
                            <Input id="instructor" name="instructor" type="text" placeholder="e.g. Eng. Sarah Connor" value={formData.instructor} onChange={handleInputChange} />
                        </div>

                        {/* Subjects Section */}
                        <div className="space-y-2">
                            <Label>Subjects</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                                {formData.subjects.map((subject, index) => (
                                    <div key={subject.id} className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            required
                                            placeholder={`Subject ${index + 1}`}
                                            value={subject.name}
                                            onChange={(e) => handleSubjectChange(subject.id, e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveSubject(subject.id)}
                                            className="text-slate-400 hover:text-red-500"
                                            title="Remove Subject"
                                        >
                                            <span className="material-icons text-lg notranslate" translate="no">delete</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddSubject}
                                className="w-full mt-2"
                            >
                                <span className="material-icons text-lg mr-1 notranslate" translate="no">add</span>
                                Add Subject
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nextExam">Next Exam Date</Label>
                            <Input
                                type="datetime-local"
                                id="nextExam"
                                name="nextExam"
                                value={formData.nextExam}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (initialData ? "Update Course" : "Add Course")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
