"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Star, Search, ShieldCheck, ChevronRight
} from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";

interface HistoricoItem {
  id: string;
  titulo: string;
  categoria: string;
  cidade: string;
  dataConclusao: string;
  fornecedorNome: string;
  fornecedorId: string;
  valorArremateCentavos: number;
  valorTetoCentavos: number;
  status: "concluido" | "cancelado";
  notaDada?: number;
  contratoId?: string;
  motivoCancelamento?: string;
}

const HISTORICO_MOCK: HistoricoItem[] = [
  {
    id: "req-hist-1",
    titulo: "Buffet para 120 convidados",
    categoria: "Buffet",
    cidade: "Paulínia",
    dataConclusao: "14 de Setembro de 2026",
    fornecedorNome: "Cozinha da Dona Ana",
    fornecedorId: "p1",
    valorArremateCentavos: 1180000,
    valorTetoCentavos: 1500000,
    status: "concluido",
    notaDada: 5,
    contratoId: "con-1",
  },
  {
    id: "req-hist-2",
    titulo: "Fotografia e Filmagem com Drone",
    categoria: "Fotografia",
    cidade: "Campinas",
    dataConclusao: "02 de Agosto de 2026",
    fornecedorNome: "Olhar Digital Fotografia",
    fornecedorId: "p3",
    valorArremateCentavos: 280000,
    valorTetoCentavos: 350000,
    status: "concluido",
    notaDada: 4.8,
    contratoId: "con-2",
  },
  {
    id: "req-hist-3",
    titulo: "DJ e Pista de Dança Completa",
    categoria: "DJ e Som",
    cidade: "Paulínia",
    dataConclusao: "18 de Julho de 2026",
    fornecedorNome: "Batida Perfeita Som",
    fornecedorId: "p4",
    valorArremateCentavos: 190000,
    valorTetoCentavos: 250000,
    status: "cancelado",
    motivoCancelamento: "Cancelado em até 24h sem custo pelo cliente conforme RN13.",
  },
];

export default function HistoricoClientePage() {
  const [filtro, setFiltro] = useState<"todos" | "concluido" | "cancelado">("todos");
  const [busca, setBusca] = useState("");

  const itensFiltrados = HISTORICO_MOCK.filter((item) => {
    if (filtro !== "todos" && item.status !== filtro) return false;
    if (busca && !item.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const totalEconomizado = HISTORICO_MOCK
    .filter((i) => i.status === "concluido")
    .reduce((acc, cur) => acc + (cur.valorTetoCentavos - cur.valorArremateCentavos), 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb e cabeçalho */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/painel-cliente" className="hover:text-fg">Painel do cliente</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Histórico de leilões</span>
      </div>

      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Cliente</Eyebrow>
          <h1 className="mt-1 text-[32px] font-semibold tracking-tight md:text-[38px] text-fg">
            Histórico de contratações
          </h1>
          <p className="mt-1.5 text-base text-fg-2">
            Consulte seus leilões finalizados, contratos gerados em PDF e avaliações realizadas.
          </p>
        </div>
        <ButtonLink href="/painel-cliente/novo" variant="primary" className="h-11 px-5">
          Publicar nova necessidade
        </ButtonLink>
      </header>

      {/* Cartões de Estatísticas Resumidas */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-fg-2 block">
            Serviços Concluídos
          </span>
          <Mono className="mt-2 text-2xl font-bold text-fg">
            {HISTORICO_MOCK.filter((i) => i.status === "concluido").length}
          </Mono>
          <span className="text-xs text-fg-2 mt-1 block">Com contrato e avaliação</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-fg-2 block">
            Economia Total Obtida
          </span>
          <Mono className="mt-2 text-2xl font-bold text-success-text">
            {formatBRL(totalEconomizado)}
          </Mono>
          <span className="text-xs text-fg-2 mt-1 block">Abaixo do orçamento teto inicial</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-fg-2 block">
            Cancelamentos no Prazo
          </span>
          <Mono className="mt-2 text-2xl font-bold text-fg">
            {HISTORICO_MOCK.filter((i) => i.status === "cancelado").length}
          </Mono>
          <span className="text-xs text-fg-2 mt-1 block">100% sem custos (Regra RN13)</span>
        </Card>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFiltro("todos")}
            className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
              filtro === "todos"
                ? "bg-accent text-ink"
                : "bg-surface border border-line text-fg-2 hover:border-fg"
            }`}
          >
            Todos ({HISTORICO_MOCK.length})
          </button>
          <button
            onClick={() => setFiltro("concluido")}
            className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
              filtro === "concluido"
                ? "bg-accent text-ink"
                : "bg-surface border border-line text-fg-2 hover:border-fg"
            }`}
          >
            Concluídos ({HISTORICO_MOCK.filter((i) => i.status === "concluido").length})
          </button>
          <button
            onClick={() => setFiltro("cancelado")}
            className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
              filtro === "cancelado"
                ? "bg-accent text-ink"
                : "bg-surface border border-line text-fg-2 hover:border-fg"
            }`}
          >
            Cancelados ({HISTORICO_MOCK.filter((i) => i.status === "cancelado").length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-2" />
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-9 w-full rounded-full border border-line bg-surface pl-9 pr-3 text-xs text-fg outline-none focus:border-ink placeholder:text-fg-2"
          />
        </div>
      </div>

      {/* Lista de Itens do Histórico */}
      {itensFiltrados.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-base font-semibold text-fg">Nenhum leilão encontrado no histórico.</p>
          <p className="mt-1 text-sm text-fg-2">Tente ajustar os filtros ou publique sua primeira necessidade.</p>
          <ButtonLink href="/painel-cliente/novo" variant="primary" className="mt-5 inline-flex">
            Publicar necessidade
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-4">
          {itensFiltrados.map((item) => {
            const economia = item.valorTetoCentavos - item.valorArremateCentavos;
            return (
              <Card key={item.id} className="p-5 md:p-6 transition-all hover:border-line-strong">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-accent-text">
                        {item.categoria}
                      </span>
                      <span className="text-xs text-fg-2">·</span>
                      <span className="text-xs text-fg-2">{item.cidade}</span>
                      <span className="text-xs text-fg-2">· {item.dataConclusao}</span>
                      {item.status === "concluido" ? (
                        <Badge variant="success">Concluído</Badge>
                      ) : (
                        <Badge variant="neutral">Cancelado</Badge>
                      )}
                    </div>

                    <h2 className="text-[19px] font-semibold text-fg">{item.titulo}</h2>

                    {item.status === "concluido" ? (
                      <div className="flex flex-wrap items-center gap-4 text-xs text-fg-2 pt-1">
                        <span className="flex items-center gap-1.5 font-medium text-fg">
                          <ShieldCheck size={14} className="text-accent-text" />
                          Fornecedor: {item.fornecedorNome}
                        </span>
                        {item.notaDada && (
                          <span className="flex items-center gap-1 text-fg">
                            <Star size={12} className="fill-accent text-accent-text" />
                            Avaliação: {item.notaDada}.0 / 5
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-fg-2 italic pt-1">{item.motivoCancelamento}</p>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-end justify-between border-t border-line/60 pt-3 md:border-0 md:pt-0 shrink-0 gap-2">
                    <div className="text-right">
                      <span className="text-[11px] text-fg-2 block">Valor arrematado</span>
                      <Mono className="text-[17px] font-bold text-fg">
                        {formatBRL(item.valorArremateCentavos)}
                      </Mono>
                      {item.status === "concluido" && economia > 0 && (
                        <span className="text-[11px] font-medium text-success-text block">
                          Economia: {formatBRL(economia)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {item.contratoId && (
                        <ButtonLink
                          href={`/painel-cliente/contrato/${item.contratoId}`}
                          variant="secondary"
                          className="h-8 px-3 text-xs"
                        >
                          <FileText size={13} className="mr-1" />
                          Ver contrato PDF
                        </ButtonLink>
                      )}
                      <ButtonLink
                        href={`/painel-cliente/novo?cat=${item.categoria.toLowerCase()}`}
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                      >
                        Repetir pedido
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
