import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (centavos: number) => brl.format(centavos / 100);

export const TZ = "America/Sao_Paulo";
export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: TZ }).format(new Date(d));

export function parseBRL(input: string): number {
  if (!input) return 0;
  const digits = input.replace(/[^\d,]/g, "").replace(",", ".");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
