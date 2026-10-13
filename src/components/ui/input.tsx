"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  maskCPF, maskCNPJ, maskCPFOrCNPJ, maskPhone,
  maskCEP, maskCurrency, maskNumberThousands, maskBRL, maskDate, maskPixKey
} from "@/lib/masks";

export type InputMaskType =
  | "cpf"
  | "cnpj"
  | "cpf_cnpj"
  | "phone"
  | "cep"
  | "currency"
  | "thousands"
  | "brl"
  | "date"
  | "pix"
  | ((val: string) => string);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  mask?: InputMaskType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, id, disabled, mask, onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        let val = e.target.value;
        if (typeof mask === "function") {
          val = mask(val);
        } else {
          switch (mask) {
            case "cpf": val = maskCPF(val); break;
            case "cnpj": val = maskCNPJ(val); break;
            case "cpf_cnpj": val = maskCPFOrCNPJ(val); break;
            case "phone": val = maskPhone(val); break;
            case "cep": val = maskCEP(val); break;
            case "currency": val = maskCurrency(val); break;
            case "thousands": val = maskNumberThousands(val); break;
            case "brl": val = maskBRL(val); break;
            case "date": val = maskDate(val); break;
            case "pix": val = maskPixKey(val); break;
          }
        }
        e.target.value = val;
      }
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[14px] font-medium text-fg">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "flex h-12 w-full rounded-[10px] border border-line bg-surface px-4 text-[16px] text-fg transition-colors duration-150",
              "placeholder:text-fg-2 hover:border-fg-2 focus-visible:outline-none focus-visible:border-ink",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-2 disabled:border-line",
              error && "border-error focus-visible:border-error text-fg",
              className
            )}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1.5 text-[13px] text-error-text">
            <AlertCircle size={14} strokeWidth={1.5} aria-hidden />
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-[13px] text-fg-2">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[14px] font-medium text-fg">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "flex min-h-[110px] w-full rounded-[10px] border border-line bg-surface p-4 text-[16px] text-fg transition-colors duration-150",
            "placeholder:text-fg-2 hover:border-fg-2 focus-visible:outline-none focus-visible:border-ink",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-2",
            error && "border-error text-fg",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1.5 text-[13px] text-error-text">
            <AlertCircle size={14} strokeWidth={1.5} aria-hidden />
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-[13px] text-fg-2">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
