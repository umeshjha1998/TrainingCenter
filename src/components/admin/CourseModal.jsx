import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CourseModal({ isOpen, onClose, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        subjects: "",
        nextExam: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: "", duration: "", subjects: "", nextExam: "" });
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
            if (initialData?.id) {
                // Update existing course
                const courseRef = doc(db, "courses", initialData.id);
                await updateDoc(courseRef, {
                    ...formData,
                    subjects: parseInt(formData.subjects) || 0,
                    updatedAt: new Date()
                });
                alert("Course updated successfully!");
            } else {
                // Add new course
                await addDoc(collection(db, "courses"), {
                    ...formData,
                    subjects: parseInt(formData.subjects) || 0,
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
                                    <label htmlFor="subjects" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject Count</label>
                                    <input type="number" id="subjects" name="subjects" required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 border" value={formData.subjects} onChange={handleInputChange} />
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
