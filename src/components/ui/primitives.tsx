import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-[16px] border border-line bg-surface", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-accent-text">{children}</p>;
}

export function Badge({
  tone,
  variant,
  className,
  children,
}: {
  tone?: "neutral" | "accent" | "success" | "error";
  variant?: "neutral" | "accent" | "success" | "error";
  className?: string;
  children: React.ReactNode;
}) {
  const chosenTone = variant || tone || "neutral";
  const tones = {
    neutral: "bg-muted text-fg-2",
    accent: "bg-accent text-ink",
    success: "bg-success/15 text-success-text",
    error: "bg-error/10 text-error-text",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-medium", tones[chosenTone], className)}>
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function Mono({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("font-mono tabular-nums", className)}>{children}</span>;
}
