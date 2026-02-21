
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ResetConfirmationModal({ isOpen, onClose, onConfirm }) {
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (confirmationText === 'reset courses') {
            onConfirm();
            onClose();
            setConfirmationText(''); // Reset for next time
            setError('');
        } else {
            setError('Please type exactly "reset courses" (without quotes) to confirm.');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="relative z-50 inline-block align-bottom bg-white dark:bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <span className="material-icons text-red-600 dark:text-red-400 notranslate" translate="no">warning</span>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                                    Reset Default Courses?
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        This action will <strong>PERMANENTLY DELETE</strong> all existing courses and certificates. This cannot be undone.
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        Type <strong>reset courses</strong> below to confirm:
                                    </p>
                                    <input
                                        type="text"
                                        className="mt-3 w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:text-white"
                                        placeholder="Type 'reset courses'"
                                        value={confirmationText}
                                        onChange={(e) => setConfirmationText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit();
                                        }}
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-600 font-medium">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={confirmationText !== 'reset courses'}
                        >
                            Reset Database
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
