"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Plus, History, Search, Gavel, Settings, User, CreditCard,
  ShieldCheck, ListChecks, ScrollText, BarChart3, type LucideIcon,
} from "lucide-react";
import { Logo } from "./site";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon };

const NAV: Record<"cliente" | "fornecedor" | "admin", Item[]> = {
  cliente: [
    { href: "/painel-cliente", label: "Painel", icon: LayoutDashboard },
    { href: "/painel-cliente/novo", label: "Novo pedido", icon: Plus },
    { href: "/painel-cliente/historico", label: "Histórico", icon: History },
  ],
  fornecedor: [
    { href: "/painel-fornecedor", label: "Painel", icon: LayoutDashboard },
    { href: "/painel-fornecedor/leiloes", label: "Leilões", icon: Search },
    { href: "/painel-fornecedor/lances", label: "Meus lances", icon: Gavel },
    { href: "/painel-fornecedor/perfil", label: "Perfil", icon: User },
    { href: "/painel-fornecedor/plano", label: "Plano", icon: CreditCard },
    { href: "/painel-fornecedor/config", label: "Configurações", icon: Settings },
  ],
  admin: [
    { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
    { href: "/admin/leiloes", label: "Leilões", icon: ListChecks },
    { href: "/admin/fornecedores", label: "Fornecedores", icon: ShieldCheck },
    { href: "/admin/auditoria", label: "Auditoria", icon: ScrollText },
    { href: "/admin/metricas", label: "Métricas", icon: BarChart3 },
  ],
};

export function AppShell({ role, children }: { role: keyof typeof NAV; children: React.ReactNode }) {
  const path = usePathname();
  const items = NAV[role];
  const isActive = (href: string) => path === href || (href.split("/").length > 2 && path.startsWith(href));

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-line bg-surface p-4 md:flex">
        <div className="px-2 pt-2"><Logo /></div>
        <nav aria-label="Painel" className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] text-fg-2 transition-colors duration-150 hover:bg-muted hover:text-fg",
                isActive(href) && "bg-muted font-medium text-fg",
              )}
            >
              <Icon size={20} strokeWidth={1.5} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="pb-24 md:pb-0">{children}</main>

      {/* Navegação inferior no mobile */}
      <nav aria-label="Painel" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 backdrop-blur md:hidden">
        {items.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[12px] text-fg-2", isActive(href) && "text-fg font-medium")}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
