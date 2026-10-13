"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Badge, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { useAppStore } from "@/lib/store";
import { formatBRL, formatDate } from "@/lib/utils";
import { providerPosition } from "@/lib/domain/rules";

export default function MeusLancesPage() {
  const store = useAppStore();
  const myProviderId = "p1"; // Dona Ana
  const allBids = store.getBids("req-1"); // lances ativos
  const req = store.getRequest("req-1");

  const myBids = allBids.filter((b) => b.providerId === myProviderId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 space-y-2">
        <Eyebrow>Suas propostas</Eyebrow>
        <h1 className="text-[32px] font-semibold text-fg">Meus lances enviados</h1>
        <p className="text-sm text-fg-2">Acompanhe sua colocação nas disputas e reduza valores para ganhar o leilão.</p>
      </div>

      <div className="space-y-4">
        {myBids.map((b) => {
          const valores = allBids.map((x) => x.valorCentavos);
          const pos = providerPosition(b.valorCentavos, valores);

          return (
            <Card key={b.id} className="p-6 bg-surface border-line space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent-text">
                      {pos.posicao}º lugar de {pos.total}
                    </span>
                    {b.status === "aceito" && <Badge tone="success">Arrematado por você</Badge>}
                    {b.emRevisao && <Badge tone="neutral">Em revisão de anomalia</Badge>}
                  </div>
                  <h2 className="text-[20px] font-semibold text-fg mt-2">
                    {req ? req.titulo : "Buffet para 120 pessoas"}
                  </h2>
                  <p className="text-xs text-fg-2 mt-1">
                    Paulínia · Enviado em {formatDate(b.createdAt)} · Pronto em {b.prazoDias} dias
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-fg-2 uppercase">Seu lance atual</span>
                  <Mono className="text-[28px] font-bold text-fg block mt-0.5">
                    {formatBRL(b.valorCentavos)}
                  </Mono>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line/60 pt-4 text-xs text-fg-2">
                <div className="flex items-center gap-2">
                  <span>Encerramento:</span>
                  {req && <AuctionTimer fechaEm={req.fechaEm} />}
                </div>

                <ButtonLink
                  href={`/painel-fornecedor/leilao/${b.requestId}`}
                  variant="primary"
                  className="h-10 px-5 text-xs font-semibold"
                >
                  Ajustar / Reduzir lance
                  <ArrowRight size={14} />
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
