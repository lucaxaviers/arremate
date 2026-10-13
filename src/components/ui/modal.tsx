"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="animate-backdrop fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Janela Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "animate-modal relative w-full max-w-lg rounded-[16px] border border-line bg-surface p-6 shadow-2xl focus:outline-none md:p-8",
          className
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          {title && (
            <h2 id="modal-title" className="text-[20px] font-semibold text-fg">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid size-9 place-items-center rounded-[8px] text-fg-2 hover:bg-muted hover:text-fg focus-visible:outline-none"
            aria-label="Fechar"
          >
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
