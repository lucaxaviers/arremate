"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Star, Clock, ArrowDownRight, Lock } from "lucide-react";
import { Mono } from "@/components/ui/primitives";
import { formatBRL, cn } from "@/lib/utils";

interface SampleBid {
  id: string;
  nome: string;
  nota: number;
  contratos: number;
  prazo: string;
  valor: number;
  badge?: string;
  inclui: string;
}

const INITIAL_BIDS: SampleBid[] = [
  {
    id: "b1",
    nome: "Cozinha da Dona Ana",
    nota: 4.9,
    contratos: 132,
    prazo: "3 dias",
    valor: 1180000,
    badge: "Melhor lance",
    inclui: "Buffet completo + garçons + degustação",
  },
  {
    id: "b2",
    nome: "Sabor da Praça",
    nota: 4.6,
    contratos: 48,
    prazo: "2 dias",
    valor: 1240000,
    inclui: "Buffet tradicional + louças",
  },
  {
    id: "b3",
    nome: "Buffet Jardim",
    nota: 4.8,
    contratos: 210,
    prazo: "5 dias",
    valor: 1310000,
    inclui: "Cardápio personalizado",
  },
];

export function AuctionMock() {
  const [bids, setBids] = useState<SampleBid[]>(INITIAL_BIDS.slice(0, 2));
  const [seconds, setSeconds] = useState(47 * 3600 + 12 * 60 + 8);
  const [hasNewBid, setHasNewBid] = useState(false);

  // Contador regressivo ao vivo em segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulação de novo lance descendo (efeito estilo Varrida)
  useEffect(() => {
    const t = setTimeout(() => {
      setBids(INITIAL_BIDS);
      setHasNewBid(true);
      setTimeout(() => setHasNewBid(false), 2400);
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const menorValor = bids.reduce((min, b) => Math.min(min, b.valor), 1500000);
  const economia = 1500000 - menorValor;
  const economiaPct = Math.round((economia / 1500000) * 100);

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/* Moldura de fundo sutil com estilo Varrida */}
      <div className="relative rounded-[24px] border border-line bg-surface/90 p-5 md:p-6 shadow-[0_30px_70px_-24px_rgba(10,10,11,0.18),0_0_0_1px_rgba(231,229,228,0.7)] backdrop-blur-md">
        
        {/* Topo do Card: Status ao vivo + Badge Exemplo */}
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-success"></span>
            </span>
            <span className="text-[13px] font-semibold tracking-tight text-fg">
              Disputa ao vivo
            </span>
            <span className="text-xs text-fg-2">· Paulínia</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-text">
              EXEMPLO
            </span>
          </div>
        </div>

        {/* Título e Orçamento Inicial */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[17px] font-semibold text-fg">Buffet para 120 pessoas</h3>
              <p className="text-xs text-fg-2 mt-0.5">Sáb, 17 out · Paulínia · 120 convidados</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-fg-2 block">Teto inicial</span>
              <Mono className="text-[15px] font-semibold text-fg">{formatBRL(1500000)}</Mono>
            </div>
          </div>
        </div>

        {/* Barra de Tempo Regressivo */}
        <div className="mb-4 flex items-center justify-between rounded-[12px] bg-muted/70 px-3.5 py-2.5 text-xs">
          <span className="text-fg-2 flex items-center gap-1.5">
            <Clock size={13} className="text-fg-2" />
            Encerra em
          </span>
          <Mono className="font-semibold text-accent-text text-sm">
            {formatCountdown(seconds)}
          </Mono>
        </div>

        {/* Lista de lances decrescentes (Leilão Reverso) */}
        <div className="space-y-2.5" aria-label="Lances em tempo real">
          {bids.map((b, i) => {
            const isBest = i === 0 && bids.length === 3;
            return (
              <div
                key={b.id}
                className={cn(
                  "relative flex items-center justify-between rounded-[14px] border p-3.5 transition-all duration-300",
                  isBest
                    ? "border-accent bg-accent/[0.04] shadow-sm"
                    : "border-line bg-surface hover:border-line-strong",
                  hasNewBid && isBest && "animate-bid-in ring-2 ring-accent/60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "grid size-9 place-items-center rounded-full text-xs font-bold shrink-0",
                      isBest ? "bg-accent text-ink" : "bg-muted text-fg"
                    )}
                  >
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-[14px] font-semibold text-fg truncate">
                      {b.nome}
                      <BadgeCheck size={15} className="text-accent-text shrink-0" aria-label="Verificado" />
                    </p>
                    <p className="text-[11.5px] text-fg-2 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 font-medium text-fg">
                        <Star size={11} className="text-accent-text fill-accent" /> {b.nota}
                      </span>
                      <span>·</span>
                      <span>{b.prazo}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <Mono
                    className={cn(
                      "block text-[16px] font-bold tracking-tight",
                      isBest ? "text-fg" : "text-fg"
                    )}
                  >
                    {formatBRL(b.valor)}
                  </Mono>
                  {isBest ? (
                    <span className="inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10.5px] font-bold text-accent-text">
                      Melhor lance
                    </span>
                  ) : (
                    <span className="text-[11px] text-fg-2">
                      -{Math.round(((1500000 - b.valor) / 1500000) * 100)}% do teto
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Destaque de Economia Gerada (integrado no fluxo, sem sobreposição) */}
        <div className="mt-4 flex items-center justify-between rounded-[14px] bg-success/10 border border-success/30 p-3.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-full bg-success text-white shrink-0">
              <ArrowDownRight size={15} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-fg-2 font-medium block">
                Economia do melhor lance
              </span>
              <Mono className="text-[15px] font-bold text-success-text">
                {formatBRL(economia)} <span className="text-xs font-semibold">(-{economiaPct}%)</span>
              </Mono>
            </div>
          </div>
          <span className="text-[11px] font-medium text-fg-2 bg-surface px-2.5 py-1 rounded-full border border-line">
            vs. Teto inicial
          </span>
        </div>

        {/* Rodapé do Card */}
        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-line/80 text-[12px] text-fg-2">
          <span>{bids.length} lances registrados</span>
          <span className="text-accent-text font-medium flex items-center gap-1.5">
            <Lock size={12} strokeWidth={2} /> Lances selados aos concorrentes
          </span>
        </div>
      </div>
    </div>
  );
}
