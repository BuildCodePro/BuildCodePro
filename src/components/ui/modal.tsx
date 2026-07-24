"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isConfirming?: boolean;
  variant?: 'primary';
  hideFooter?: boolean;
  /**
   * If provided, the confirm button will act as a submit button for this form id.
   */
  formId?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isConfirming = false,
  variant = "primary",
  hideFooter = false,
  formId,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background relative w-full max-w-lg rounded-xl shadow-xl border border-border animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? (
              <p className="text-sm text-stat-label mt-1">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="text-stat-label hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
        {!hideFooter ? (
          <div className="flex justify-end gap-3 border-t border-border p-5 bg-surface/50 rounded-b-xl">
            <Button size={"sm"} type="button" variant="outline" onClick={onClose} disabled={isConfirming}>
              {cancelText}
            </Button>
            <Button
              type={formId ? "submit" : "button"}
              form={formId}
              size={"sm"}
              variant={variant}
              onClick={!formId ? onConfirm : undefined}
              disabled={isConfirming}
            >
              {isConfirming ? "Processing..." : confirmText}
            </Button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
