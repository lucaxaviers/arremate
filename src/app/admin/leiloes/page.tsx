"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Eyebrow, Badge, Mono } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { formatBRL } from "@/lib/utils";

export default function AdminLeiloesPage() {
  const { success, warning } = useToast();
  const [lancesAnomalos, setLancesAnomalos] = useState([
    {
      id: "anom-1",
      leilao: "Buffet para 120 pessoas (Paulínia)",
      fornecedor: "Fornecedor Teste Rápido",
      tetoCentavos: 1500000,
      valorCentavos: 600000, // R$ 6.000 (abaixo de 50% do teto de R$ 15.000, disparou RN11)
      motivo: "Valor abaixo de 50% do orçamento máximo definido pelo cliente (RN11).",
      dataEnvio: "Hoje, há 15 min",
    },
  ]);

  function handleApprove(id: string) {
    setLancesAnomalos((prev) => prev.filter((l) => l.id !== id));
    success("Lance aprovado e liberado sem o selo de revisão para o cliente.");
  }

  function handleRemove(id: string) {
    setLancesAnomalos((prev) => prev.filter((l) => l.id !== id));
    warning("Lance cancelado e removido do leilão por inconsistência grave de preço.");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-6">
        <ArrowLeft size={14} /> Voltar ao painel admin
      </Link>

      <div className="mb-8 space-y-1">
        <Eyebrow>Auditoria e Moderação (RN11)</Eyebrow>
        <h1 className="text-[32px] font-semibold text-fg">Lances anômalos em revisão</h1>
        <p className="text-sm text-fg-2">
          Lances abaixo de 50% do teto do leilão ou fora do padrão de mercado para proteção das partes.
        </p>
      </div>

      {lancesAnomalos.length === 0 ? (
        <Card className="p-12 text-center text-sm text-fg-2">
          Nenhum lance em revisão no momento. Todos os leilões estão operando dentro dos parâmetros regulares.
        </Card>
      ) : (
        <div className="space-y-4">
          {lancesAnomalos.map((l) => (
            <Card key={l.id} className="p-6 bg-surface border-line space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-fg">{l.leilao}</h2>
                    <Badge tone="error">Em revisão (RN11)</Badge>
                  </div>
                  <p className="text-xs text-fg-2 mt-1">
                    Fornecedor: <strong>{l.fornecedor}</strong> · {l.dataEnvio}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span>Orçamento teto: <Mono>{formatBRL(l.tetoCentavos)}</Mono></span>
                    <span>Lance ofertado: <Mono className="text-error-text font-bold">{formatBRL(l.valorCentavos)}</Mono></span>
                  </div>
                  <p className="text-xs text-accent-text mt-2 font-medium flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    {l.motivo}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="destructive" className="h-10 text-xs" onClick={() => handleRemove(l.id)}>
                    <Trash2 size={14} /> Remover lance
                  </Button>
                  <Button variant="primary" className="h-10 text-xs" onClick={() => handleApprove(l.id)}>
                    <Check size={14} /> Aprovar lance
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
