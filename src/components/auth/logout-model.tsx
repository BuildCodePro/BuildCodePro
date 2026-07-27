"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { LogOut } from "lucide-react";
import { TableEmptyState } from "../ui/emptyState";
import { AlertBanner } from "../ui";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await onConfirm();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Modal

            isOpen={isOpen}
            onClose={onClose}
            confirmText="Logout"
            cancelText="Cancel"
            variant="primary"
            title="Logout"
            isConfirming={isLoggingOut}
            onConfirm={handleConfirm}
            children={
                <AlertBanner variant="danger" title="Logout" description="Are you sure you want to log out of your account?" />
            }
        />
    );
}