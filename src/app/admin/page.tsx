"use client";

import { ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Badge, Mono } from "@/components/ui/primitives";
import { useAppStore } from "@/lib/store";

export default function AdminDashboardPage() {
  const store = useAppStore();
  const requests = store.getRequests();
  const bids = store.getBids("req-1");
  const providers = store.getProviders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 space-y-1">
        <Eyebrow>Painel de Controle</Eyebrow>
        <h1 className="text-[32px] font-semibold text-fg">Visão geral do administrador</h1>
        <p className="text-sm text-fg-2">Métricas do piloto local e filas de moderação manual.</p>
      </div>

      {/* 5 Cards de Métricas (E1) */}
      <div className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <span className="text-[11px] uppercase font-semibold text-fg-2 tracking-wider">Leilões ativos</span>
          <Mono className="text-[28px] font-bold text-fg mt-1 block">
            {requests.filter((r) => r.status === "aberto").length}
          </Mono>
          <span className="text-[11px] text-fg-2">Todos os municípios</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase font-semibold text-fg-2 tracking-wider">Lances hoje</span>
          <Mono className="text-[28px] font-bold text-fg mt-1 block">{bids.length}</Mono>
          <span className="text-[11px] text-accent-text">Tempo real</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase font-semibold text-fg-2 tracking-wider">Contratos</span>
          <Mono className="text-[28px] font-bold text-fg mt-1 block">
            {requests.filter((r) => r.status === "contratado").length}
          </Mono>
          <span className="text-[11px] text-success-text">Arrematados</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] uppercase font-semibold text-fg-2 tracking-wider">Fornecedores</span>
          <Mono className="text-[28px] font-bold text-fg mt-1 block">{providers.length}</Mono>
          <span className="text-[11px] text-fg-2">Verificados</span>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/30">
          <span className="text-[11px] uppercase font-semibold text-accent-text tracking-wider">Moderação</span>
          <Mono className="text-[28px] font-bold text-accent-text mt-1 block">1</Mono>
          <span className="text-[11px] text-fg-2">Itens pendentes</span>
        </Card>
      </div>

      {/* Filas de Ação */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent-text" />
              Verificação de fornecedores
            </h2>
            <Badge tone="accent">1 pendente</Badge>
          </div>
          <p className="text-xs text-fg-2">
            Análise manual de documento e selfie para liberação de lances na plataforma (RN05).
          </p>
          <ButtonLink href="/admin/fornecedores" variant="secondary" className="w-full text-xs h-10">
            Abrir fila de verificação
            <ArrowRight size={14} />
          </ButtonLink>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" />
              Lances anômalos e auditoria
            </h2>
            <Badge tone="neutral">RN11 ativo</Badge>
          </div>
          <p className="text-xs text-fg-2">
            Lances abaixo de 50% do orçamento ou com mais de 10 submissões por hora entram em revisão.
          </p>
          <ButtonLink href="/admin/leiloes" variant="secondary" className="w-full text-xs h-10">
            Revisar lances sinalizados
            <ArrowRight size={14} />
          </ButtonLink>
        </Card>
      </div>
    </div>
  );
}
