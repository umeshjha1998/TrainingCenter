import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30">
                            <span className="material-icons text-red-600 dark:text-red-400 notranslate" translate="no">warning</span>
                        </div>
                        Reset Default Courses?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will <strong>PERMANENTLY DELETE</strong> all existing courses and certificates. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="confirmation-text" className="text-sm font-medium">
                        Type <strong>reset courses</strong> below to confirm:
                    </Label>
                    <Input
                        id="confirmation-text"
                        type="text"
                        className="mt-2"
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
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        disabled={confirmationText !== 'reset courses'}
                    >
                        Reset Database
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
