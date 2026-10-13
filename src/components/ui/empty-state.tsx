import React from "react";
import { ButtonLink, Button } from "@/components/ui/button";

export type EmptyStateKind = "customer_dashboard" | "provider_feed" | "no_bids" | "history" | "no_results";

export function EmptyState({
  kind,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  kind: EmptyStateKind;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  const configs = {
    customer_dashboard: {
      title: title || "Nenhum leilão por aqui ainda",
      desc: description || "Publique sua primeira necessidade e receba lances de fornecedores da sua região.",
      cta: actionLabel || "Publicar necessidade",
      href: actionHref || "/painel-cliente/novo",
      svg: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg">
          {/* Cadeira vazia e placa minimalista */}
          <path d="M22 20h20v16H22z" />
          <path d="M20 36h24v4H20z" />
          <path d="M24 40v14M40 40v14" />
          <path d="M18 16v8" stroke="#F59E0B" />
          <path d="M14 16h8" stroke="#F59E0B" />
        </svg>
      ),
    },
    provider_feed: {
      title: title || "Sem leilões novos na sua região hoje",
      desc: description || "Avisamos você por e-mail e push assim que um novo pedido compatível surgir.",
      cta: actionLabel || "Ajustar filtros",
      href: actionHref || "/painel-fornecedor/leiloes",
      svg: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg">
          {/* Caixa de correio vazia */}
          <rect x="18" y="16" width="28" height="20" rx="4" />
          <path d="M18 22l14 10 14-10" />
          <path d="M32 36v18" stroke="#F59E0B" />
          <path d="M26 54h12" />
        </svg>
      ),
    },
    no_bids: {
      title: title || "Aguardando primeiros lances",
      desc: description || "Publicamos seu leilão para fornecedores qualificados da sua região. Os lances começarão a chegar em breve.",
      cta: actionLabel,
      href: actionHref,
      svg: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg">
          {/* Ampulheta com detalhe âmbar */}
          <path d="M20 16h24v8L34 32l10 8v8H20v-8l10-8-10-8v-8z" />
          <path d="M32 32v6" stroke="#F59E0B" />
          <circle cx="32" cy="42" r="1.5" fill="#F59E0B" />
        </svg>
      ),
    },
    history: {
      title: title || "Nada por aqui ainda",
      desc: description || "Seus leilões encerrados, contratos e histórico de serviços aparecem aqui.",
      cta: actionLabel,
      href: actionHref,
      svg: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg">
          {/* Pasta vazia */}
          <path d="M16 20h12l4 4h16v24H16z" />
          <path d="M28 34h8" stroke="#F59E0B" />
        </svg>
      ),
    },
    no_results: {
      title: title || "Nenhum lance corresponde aos filtros",
      desc: description || "Tente ampliar a busca, ajustar a faixa de preço ou limpar os filtros ativos.",
      cta: actionLabel || "Limpar filtros",
      href: actionHref,
      svg: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg">
          {/* Lupa com zero */}
          <circle cx="28" cy="28" r="14" />
          <path d="M38 38l14 14" />
          <circle cx="28" cy="28" r="5" stroke="#F59E0B" />
        </svg>
      ),
    },
  };

  const item = configs[kind];

  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-line bg-surface p-10 text-center md:p-16">
      <div className="mb-5 grid size-16 place-items-center rounded-full bg-muted">
        {item.svg}
      </div>
      <h3 className="text-[20px] font-semibold text-fg">{item.title}</h3>
      <p className="mt-2 max-w-md text-[15px] text-fg-2">{item.desc}</p>
      {item.cta && (
        <div className="mt-6">
          {onAction ? (
            <Button variant="secondary" onClick={onAction}>
              {item.cta}
            </Button>
          ) : item.href ? (
            <ButtonLink href={item.href} variant="primary">
              {item.cta}
            </ButtonLink>
          ) : null}
        </div>
      )}
    </div>
  );
}
