import React from 'react';
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

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isDanger = true }) {
    if (!isOpen) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${isDanger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                            <span className={`material-icons ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} notranslate`} translate="no">
                                {isDanger ? 'warning' : 'info'}
                            </span>
                        </div>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={isDanger ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
