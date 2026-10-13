import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "destructive";

const base =
  "inline-flex items-center justify-center gap-2 h-12 min-h-11 px-5 rounded-[10px] text-[15px] font-medium " +
  "transition-[transform,background-color,border-color,color,opacity] duration-150 ease-out " +
  "active:scale-[0.97] active:duration-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-hover font-semibold shadow-sm",
  secondary: "border border-line bg-surface text-fg hover:bg-muted hover:border-fg-2/30",
  ghost: "text-fg hover:bg-muted",
  dark: "bg-ink text-[#FAFAF9] hover:bg-graphite shadow-sm",
  destructive: "bg-error text-[#FAFAF9] hover:bg-error-text",
};

type Common = { variant?: Variant; loading?: boolean; className?: string; children: React.ReactNode };

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  disabled,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", className, children, href }: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
