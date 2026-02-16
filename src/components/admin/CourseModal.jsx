import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CourseModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        instructor: "", // Added instructor field
        subjects: [], // Now an array of subject objects { id, name }
        nextExam: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                subjects: Array.isArray(initialData.subjects) ? initialData.subjects : []
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

        try {
            const courseData = {
                ...formData,
                subjects: formData.subjects.filter(s => s.name.trim() !== ""), // Filter empty subjects
                updatedAt: new Date()
            };

            if (initialData?.id) {
                // Update existing course
                const courseRef = doc(db, "courses", initialData.id);
                await updateDoc(courseRef, courseData);
                alert("Course updated successfully!");
            } else {
                // Add new course
                await addDoc(collection(db, "courses"), {
                    ...courseData,
                    createdAt: new Date()
                });
                alert("Course added successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving course: ", error);
            alert("Failed to save course");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                                {initialData ? "Edit Course" : "Add New Course"}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Course Name</label>
                                    <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Duration</label>
                                    <input type="text" id="duration" name="duration" required placeholder="e.g. 6 Months" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.duration} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label htmlFor="instructor" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Instructor Name</label>
                                    <input type="text" id="instructor" name="instructor" placeholder="e.g. Eng. Sarah Connor" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.instructor} onChange={handleInputChange} />
                                </div>

                                {/* Subjects Section */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subjects</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                                        {formData.subjects.map((subject, index) => (
                                            <div key={subject.id} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={`Subject ${index + 1}`}
                                                    className="flex-1 rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border"
                                                    value={subject.name}
                                                    onChange={(e) => handleSubjectChange(subject.id, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSubject(subject.id)}
                                                    className="text-slate-400 hover:text-red-500 p-2"
                                                    title="Remove Subject"
                                                >
                                                    <span className="material-icons text-lg">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddSubject}
                                        className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                                    >
                                        <span className="material-icons text-lg mr-1">add</span>
                                        Add Subject
                                    </button>
                                </div>

                                <div>
                                    <label htmlFor="nextExam" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Next Exam Date</label>
                                    <input type="text" id="nextExam" name="nextExam" placeholder="e.g. Oct 12, 2023" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.nextExam} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                {loading ? "Saving..." : (initialData ? "Update Course" : "Add Course")}
                            </button>
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
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
