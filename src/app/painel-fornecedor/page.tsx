"use client";

import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { useAppStore } from "@/lib/store";
import { formatBRL, formatDate } from "@/lib/utils";

export default function PainelFornecedorPage() {
  const store = useAppStore();
  const requests = store.getRequests().filter((r) => r.status === "aberto");
  const myContracts = store.getContracts().filter((c) => c.providerId === "p1");
  const pendingReviews = myContracts.filter((c) => !store.hasReviewed(c.id, "p1"));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Eyebrow>Painel do fornecedor</Eyebrow>
          <h1 className="mt-1 text-[32px] font-semibold text-fg">Boa tarde, Cozinha da Dona Ana</h1>
          <p className="text-sm text-fg-2">
            Você tem <strong>{requests.length} leilões compatíveis</strong> abertos na sua região.
          </p>
        </div>
        <ButtonLink href="/painel-fornecedor/leiloes" variant="primary" className="h-11">
          Ver oportunidades
          <ArrowRight size={16} />
        </ButtonLink>
      </div>

      {/* 4 Cards de Métricas (D1) */}
      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Lances no mês</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <Mono className="text-[32px] font-semibold text-fg">2</Mono>
            <span className="text-xs text-fg-2">/ 3 grátis</span>
          </div>
          <p className="mt-1 text-xs text-accent-text">1 lance disponível (RN17)</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Taxa de resposta</p>
          <div className="mt-2 flex items-baseline gap-1">
            <Mono className="text-[32px] font-semibold text-fg">98%</Mono>
          </div>
          <p className="mt-1 text-xs text-success-text">Média alta na região</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Contratos ganhos</p>
          <div className="mt-2 flex items-baseline gap-1">
            <Mono className="text-[32px] font-semibold text-fg">132</Mono>
          </div>
          <p className="mt-1 text-xs text-fg-2">Serviços executados</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Avaliação média</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <Mono className="text-[32px] font-semibold text-fg">4.9</Mono>
            <Star size={16} className="text-accent-text fill-accent" />
          </div>
          <p className="mt-1 text-xs text-success-text">Status: Verificado</p>
        </Card>
      </div>

      {/* Aviso de Avaliação Bilateral Pendente (RN14) */}
      {pendingReviews.length > 0 && (
        <div className="mb-8 rounded-[16px] border border-accent/40 bg-accent/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-text">
              <Star size={13} className="fill-amber-400 text-amber-500" /> Avaliação Bilateral Pendente (RN14)
            </span>
            <p className="text-sm font-medium text-fg">
              Você arrematou o contrato <strong>&quot;{pendingReviews[0].titulo}&quot;</strong> com {pendingReviews[0].customerNome}.
            </p>
            <p className="text-xs text-fg-2">
              Avalie o cliente com nota de 1 a 5 e um breve comentário para consolidar a reputação mútua no Arremate.
            </p>
          </div>
          <ButtonLink
            href={`/painel-fornecedor/avaliar/${pendingReviews[0].id}`}
            variant="primary"
            className="h-10 text-xs font-semibold shrink-0"
          >
            Avaliar cliente agora
          </ButtonLink>
        </div>
      )}

      {/* Leilões abertos para você */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-fg">Oportunidades em aberto</h2>
          <Link href="/painel-fornecedor/leiloes" className="text-xs text-accent-text hover:underline font-medium">
            Ver todas as {requests.length}
          </Link>
        </div>

        <div className="space-y-3">
          {requests.map((req) => {
            const bids = store.getBids(req.id);
            return (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-4 rounded-[16px] border border-line bg-surface p-5 hover:border-fg transition-colors sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-fg-2">
                      {req.categoriaNome}
                    </span>
                    <span className="text-xs text-accent-text font-medium flex items-center gap-1">
                      <MapPin size={12} /> {req.cidade} · 6 km de você
                    </span>
                  </div>

                  <h3 className="text-[17px] font-semibold text-fg">{req.titulo}</h3>

                  <p className="text-xs text-fg-2 flex items-center gap-4">
                    <span>Data: {formatDate(req.dataEvento)}</span>
                    <span>{bids.length} lances na disputa</span>
                    {req.tetoVisivel && (
                      <span>Teto do cliente: <Mono className="font-semibold text-fg">{formatBRL(req.tetoCentavos)}</Mono></span>
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-line/60 pt-3 sm:border-0 sm:pt-0">
                  <AuctionTimer fechaEm={req.fechaEm} />
                  <ButtonLink
                    href={`/painel-fornecedor/leilao/${req.id}`}
                    variant="primary"
                    className="h-10 px-5 text-sm"
                  >
                    Dar lance
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
