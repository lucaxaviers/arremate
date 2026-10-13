"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextType = {
  showToast: (msg: Omit<ToastMessage, "id">) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, message, actionLabel, onAction }: Omit<ToastMessage, "id">) => {
      const id = "toast-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      setToasts((prev) => {
        // No máximo 3 visíveis
        const slice = prev.slice(-2);
        return [...slice, { id, type, message, actionLabel, onAction }];
      });

      // Durações: sucesso 4s, aviso 5s, info 4s, erro fica até dispensar
      const timeouts: Record<ToastType, number | null> = {
        success: 4000,
        info: 4000,
        warning: 5000,
        error: null,
      };

      const duration = timeouts[type];
      if (duration) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string) => showToast({ type: "success", message }), [showToast]);
  const error = useCallback((message: string) => showToast({ type: "error", message }), [showToast]);
  const warning = useCallback((message: string) => showToast({ type: "warning", message }), [showToast]);
  const info = useCallback((message: string) => showToast({ type: "info", message }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none md:top-6 md:right-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "animate-toast pointer-events-auto flex items-start gap-3 rounded-[12px] border bg-surface p-4 shadow-lg text-[14px] leading-snug transition-all",
              t.type === "success" && "border-success/30 text-fg",
              t.type === "error" && "border-error/40 text-fg",
              t.type === "warning" && "border-warning/40 text-fg",
              t.type === "info" && "border-info/30 text-fg"
            )}
          >
            {t.type === "success" && <CheckCircle2 size={18} strokeWidth={1.5} className="text-success-text shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle size={18} strokeWidth={1.5} className="text-error-text shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle size={18} strokeWidth={1.5} className="text-warning shrink-0 mt-0.5" />}
            {t.type === "info" && <Info size={18} strokeWidth={1.5} className="text-info shrink-0 mt-0.5" />}

            <div className="flex-1">
              <p className="font-medium text-fg">{t.message}</p>
              {t.actionLabel && t.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.();
                    removeToast(t.id);
                  }}
                  className="mt-1.5 text-[13px] font-semibold text-accent-text hover:underline"
                >
                  {t.actionLabel}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-fg-2 hover:text-fg rounded p-1"
              aria-label="Dispensar aviso"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
