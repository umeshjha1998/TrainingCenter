import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function GenerateCertificateModal({ isOpen, onClose, onGenerate }) {
    const [formData, setFormData] = useState({
        studentName: "",
        courseName: "",
        issueDate: new Date().toISOString().split('T')[0],
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.studentName || !formData.courseName || !formData.issueDate) {
            alert("Please fill in all fields");
            return;
        }

        onGenerate(formData);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 sm:mx-0 sm:h-10 sm:w-10">
                                    <span className="material-icons text-primary">workspace_premium</span>
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
                                        Generate New Certificate
                                    </h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Student Name
                                            </label>
                                            <input
                                                type="text"
                                                name="studentName"
                                                id="studentName"
                                                required
                                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                value={formData.studentName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="courseName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Course Name
                                            </label>
                                            <select
                                                id="courseName"
                                                name="courseName"
                                                required
                                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                value={formData.courseName}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select a course</option>
                                                <option value="Advanced React Patterns">Advanced React Patterns</option>
                                                <option value="Full Stack Bootcamp">Full Stack Bootcamp</option>
                                                <option value="Python for Data Science">Python for Data Science</option>
                                                <option value="Machine Learning A-Z">Machine Learning A-Z</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Issue Date
                                            </label>
                                            <input
                                                type="date"
                                                name="issueDate"
                                                id="issueDate"
                                                required
                                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                value={formData.issueDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Generate
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
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
