"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuctionTimer({ fechaEm, onExpire }: { fechaEm: string | Date; onExpire?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number; totalMs: number }>({
    d: 0, h: 0, m: 0, s: 0, totalMs: 1,
  });

  useEffect(() => {
    function calculate() {
      const target = new Date(fechaEm).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, totalMs: 0 });
        if (onExpire) onExpire();
        return;
      }

      const s = Math.floor((diff / 1000) % 60);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeLeft({ d, h, m, s, totalMs: diff });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [fechaEm, onExpire]);

  if (timeLeft.totalMs <= 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-[10px] bg-muted px-3 py-1.5 text-sm text-fg-2">
        <Clock size={16} strokeWidth={1.5} aria-hidden />
        <span className="font-mono font-medium">Encerrado</span>
      </div>
    );
  }

  const hoursTotal = timeLeft.totalMs / (1000 * 3600);
  const isUrgent = hoursTotal < 1; // menos de 1h
  const isWarm = hoursTotal < 24 && !isUrgent; // menos de 24h

  const formatted = `${timeLeft.d > 0 ? `${timeLeft.d}d ` : ""}${timeLeft.h}h ${timeLeft.m}m ${timeLeft.s}s`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px] px-3 py-1.5 text-sm transition-colors",
        isUrgent && "bg-error/10 text-error-text animate-soft-pulse",
        isWarm && "bg-accent/15 text-accent-text font-medium",
        !isUrgent && !isWarm && "bg-muted text-fg-2"
      )}
      aria-label={`Tempo restante: ${formatted}`}
    >
      <Clock size={16} strokeWidth={1.5} aria-hidden />
      <span className="font-mono font-medium tabular-nums">{formatted}</span>
      {isUrgent && <span className="text-[12px] font-semibold uppercase tracking-wider">· Encerra em breve</span>}
    </div>
  );
}
