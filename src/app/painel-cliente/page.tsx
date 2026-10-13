"use client";

import Link from "next/link";
import { Plus, ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Badge, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/lib/store";
import { formatBRL, formatDate } from "@/lib/utils";

export default function PainelClientePage() {
  const store = useAppStore();
  const requests = store.getRequests();

  const activeRequests = requests.filter((r) => r.status === "aberto");
  const totalBidsReceived = requests.reduce((acc, r) => acc + store.getBids(r.id).length, 0);

  // Calcula economia estimada baseada na diferença entre teto e melhor lance dos contratados
  const economiaEstimadaCentavos = requests.reduce((acc, r) => {
    const bids = store.getBids(r.id);
    if (!bids.length) return acc;
    const minBid = Math.min(...bids.map((b) => b.valorCentavos));
    return acc + Math.max(0, r.tetoCentavos - minBid);
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Eyebrow>Painel do cliente</Eyebrow>
          <h1 className="mt-1 text-[32px] font-semibold text-fg">Boa tarde, Mariana</h1>
          <p className="text-sm text-fg-2">Acompanhe seus leilões em tempo real e escolha as melhores propostas.</p>
        </div>
        <ButtonLink href="/painel-cliente/novo" variant="primary" className="h-11">
          <Plus size={18} strokeWidth={1.5} />
          Publicar necessidade
        </ButtonLink>
      </div>

      {/* 3 Cards de Resumo em Mono */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-fg-2">Leilões ativos</p>
          <div className="mt-2 flex items-baseline gap-2">
            <Mono className="text-[36px] font-semibold text-fg">{activeRequests.length}</Mono>
            <span className="text-xs text-fg-2">de máx. 3</span>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-fg-2">Lances recebidos</p>
          <div className="mt-2 flex items-baseline gap-2">
            <Mono className="text-[36px] font-semibold text-fg">{totalBidsReceived}</Mono>
            <span className="text-xs text-fg-2">em tempo real</span>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-fg-2">Economia estimada</p>
          <div className="mt-2 flex items-baseline gap-2">
            <Mono className="text-[36px] font-semibold text-accent-text">
              {formatBRL(economiaEstimadaCentavos)}
            </Mono>
          </div>
        </Card>
      </div>

      {/* Seus Leilões */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-fg">Seus leilões</h2>
          <span className="text-sm text-fg-2">{requests.length} cadastrados</span>
        </div>

        {requests.length === 0 ? (
          <EmptyState kind="customer_dashboard" />
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const bids = store.getBids(req.id);
              const bestBid = bids.length ? [...bids].sort((a, b) => a.valorCentavos - b.valorCentavos)[0] : null;

              return (
                <div
                  key={req.id}
                  className="group relative flex flex-col justify-between gap-4 rounded-[16px] border border-line bg-surface p-5 transition-all duration-150 hover:border-fg md:flex-row md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-medium text-fg-2">
                        {req.categoriaNome}
                      </span>
                      {req.status === "aberto" ? (
                        <Badge tone="accent">Recebendo lances</Badge>
                      ) : req.status === "contratado" ? (
                        <Badge tone="success">Arrematado</Badge>
                      ) : (
                        <Badge tone="neutral">Encerrado</Badge>
                      )}
                    </div>

                    <Link href={`/painel-cliente/leilao/${req.id}`} className="block">
                      <h3 className="text-[18px] font-semibold text-fg group-hover:text-accent-text transition-colors">
                        {req.titulo}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-fg-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {req.cidade}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Evento: {formatDate(req.dataEvento)}
                      </span>
                      <span>Orçamento: <Mono className="font-semibold text-fg">{formatBRL(req.tetoCentavos)}</Mono></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-line/50 pt-3 md:border-t-0 md:pt-0 md:justify-end md:gap-6">
                    <div className="text-left md:text-right">
                      {bestBid ? (
                        <div>
                          <p className="text-xs text-fg-2">Melhor lance atual</p>
                          <Mono className="text-[20px] font-bold text-fg">
                            {formatBRL(bestBid.valorCentavos)}
                          </Mono>
                          <p className="text-[12px] text-accent-text">{bids.length} lances recebidos</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-fg-2">Nenhum lance ainda</p>
                          <p className="text-xs text-fg-2">Avisando fornecedores...</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === "aberto" && <AuctionTimer fechaEm={req.fechaEm} />}
                      {req.status === "contratado" && req.contratoId && (
                        <ButtonLink
                          href={`/painel-cliente/avaliar/${req.contratoId}`}
                          variant="secondary"
                          className="h-10 px-3 text-xs font-semibold"
                        >
                          <Star size={13} className="mr-1 fill-amber-400 text-amber-500" />
                          {store.hasReviewed(req.contratoId, "c1") ? "Avaliado" : "Avaliar"}
                        </ButtonLink>
                      )}
                      <ButtonLink
                        href={req.status === "contratado" && req.contratoId ? `/painel-cliente/contrato/${req.contratoId}` : `/painel-cliente/leilao/${req.id}`}
                        variant={req.status === "contratado" ? "primary" : "secondary"}
                        className="h-10 px-4 text-sm"
                      >
                        {req.status === "contratado" ? "Ver contrato" : "Comparar lances"}
                        <ArrowRight size={16} />
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
