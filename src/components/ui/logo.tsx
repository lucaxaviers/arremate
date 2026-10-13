import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  symbolOnly?: boolean;
  wordmarkOnly?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

/**
 * Símbolo oficial Arremate (Direção A recomendada pelo Documento Mestre v2.1, Seção 04):
 * Três barras descendentes representando lances decrescentes no leilão reverso,
 * com o menor lance destacado em âmbar.
 */
export function LogoSymbol({
  className,
  size = "md",
  inverted = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}) {
  const pixelSize = size === "sm" ? 18 : size === "lg" ? 32 : 24;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* 1º lance: maior barra (tinta ou off-white) */}
      <rect
        x="3"
        y="3"
        width="4.5"
        height="18"
        rx="2"
        fill={inverted ? "#FAFAF9" : "currentColor"}
      />
      {/* 2º lance: barra intermediária */}
      <rect
        x="9.75"
        y="8.5"
        width="4.5"
        height="12.5"
        rx="2"
        fill={inverted ? "#FAFAF9" : "currentColor"}
        opacity={inverted ? 0.8 : 0.75}
      />
      {/* 3º lance: menor lance, destacado em âmbar (#F59E0B) */}
      <rect
        x="16.5"
        y="14"
        width="4.5"
        height="7"
        rx="2"
        fill="#F59E0B"
      />
    </svg>
  );
}

export function Logo({
  className,
  symbolOnly = false,
  wordmarkOnly = false,
  inverted = false,
  size = "md",
  href = "/",
}: LogoProps) {
  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2 select-none",
        inverted ? "text-[#FAFAF9]" : "text-fg",
        className
      )}
    >
      {!wordmarkOnly && (
        <LogoSymbol size={size} inverted={inverted} />
      )}
      {!symbolOnly && (
        <span
          className={cn(
            "font-sans font-bold tracking-[-0.02em] lowercase leading-none",
            size === "sm" && "text-base",
            size === "md" && "text-[20px]",
            size === "lg" && "text-[26px]"
          )}
        >
          arremate
          <span className="text-accent">.</span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded focus-visible:outline-2 focus-visible:outline-ring"
      aria-label="Arremate, ir para início"
    >
      {content}
    </Link>
  );
}
