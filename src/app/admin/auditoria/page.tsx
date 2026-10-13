"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
  ChevronRight, Lock
} from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";

interface AlertaAnomalo {
  id: string;
  leilaoTitulo: string;
  leilaoId: string;
  fornecedorNome: string;
  fornecedorId: string;
  valorCentavos: number;
  tetoCentavos: number;
  motivo: string;
  regra: string;
  timestamp: string;
  status: "pendente" | "aprovado" | "rejeitado";
}

interface LogAuditoria {
  id: string;
  timestamp: string;
  ator: string;
  entidade: string;
  entidadeId: string;
  acao: string;
  detalhe: string;
  ip: string;
}

const ALERTAS_INICIAIS: AlertaAnomalo[] = [
  {
    id: "alerta-1",
    leilaoTitulo: "Buffet para 120 convidados",
    leilaoId: "req-1",
    fornecedorNome: "Buffet Express Promo",
    fornecedorId: "p-9",
    valorCentavos: 650000,
    tetoCentavos: 1500000,
    motivo: "Lance a 43,3% do teto máximo (abaixo de 50%). Marcado como 'Em revisão'.",
    regra: "RN11",
    timestamp: "Hoje, 11:24",
    status: "pendente",
  },
  {
    id: "alerta-2",
    leilaoTitulo: "Fotografia de Casamento",
    leilaoId: "req-2",
    fornecedorNome: "Flash Instantâneo ME",
    fornecedorId: "p-11",
    valorCentavos: 90000,
    tetoCentavos: 300000,
    motivo: "Redução súbita de 70% sem discriminar novos itens inclusos.",
    regra: "RN11 / Antifraude",
    timestamp: "Hoje, 10:48",
    status: "pendente",
  },
];

const AUDIT_LOGS: LogAuditoria[] = [
  {
    id: "log-1",
    timestamp: "13/10/2026 11:24:02",
    ator: "Sistema (Job Cron)",
    entidade: "Bid",
    entidadeId: "bid-884",
    acao: "FLAG_ANOMALOUS",
    detalhe: "Lance marcado como 'em_revisao' (< 50% do orçamento teto)",
    ip: "172.21.0.40",
  },
  {
    id: "log-2",
    timestamp: "13/10/2026 11:15:30",
    ator: "Admin (lucas@arremate.com.br)",
    entidade: "Provider",
    entidadeId: "p1",
    acao: "VERIFY_APPROVED",
    detalhe: "Documento e selfie conferidos manualmente. Status -> verificado.",
    ip: "189.44.12.98",
  },
  {
    id: "log-3",
    timestamp: "13/10/2026 10:45:11",
    ator: "Sistema (Realtime)",
    entidade: "Request",
    entidadeId: "req-1",
    acao: "APPLY_EXTENSION",
    detalhe: "Lance nos últimos 5 min. Prazo estendido em +5 minutos (RN09 - Extensão 1/3)",
    ip: "172.21.0.40",
  },
  {
    id: "log-4",
    timestamp: "13/10/2026 09:30:00",
    ator: "Sistema (Segurança)",
    entidade: "Auth",
    entidadeId: "usr-44",
    acao: "LGPD_DATA_ACCESS",
    detalhe: "Consulta de dados de fornecedor para auditoria regulatória",
    ip: "189.44.12.98",
  },
];

export default function AuditoriaAdminPage() {
  const [alertas, setAlertas] = useState(ALERTAS_INICIAIS);

  const resolverAlerta = (id: string, novoStatus: "aprovado" | "rejeitado") => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: novoStatus } : a))
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/admin" className="hover:text-fg">Painel Admin</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Auditoria e Moderação</span>
      </div>

      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>Segurança · RN11, RN19, RN20</Eyebrow>
            <Badge variant="accent">Trilha Imutável</Badge>
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
            Auditoria de lances anômalos
          </h1>
          <p className="mt-1.5 text-base text-fg-2">
            Monitoramento em tempo real de lances predatórios, regras anti-sniping e registro imutável em audit_log.
          </p>
        </div>
      </header>

      {/* Fila de Moderação de Lances Anômalos (RN11) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-fg flex items-center gap-2">
            <ShieldAlert size={20} className="text-warning-text" />
            Fila de Lances Sob Suspeita (RN11)
          </h2>
          <span className="text-xs text-fg-2">
            {alertas.filter((a) => a.status === "pendente").length} pendente(s) de decisão
          </span>
        </div>

        <div className="space-y-4">
          {alertas.map((alerta) => (
            <Card
              key={alerta.id}
              className={`p-6 transition-all ${
                alerta.status === "pendente"
                  ? "border-warning/50 bg-warning/5"
                  : "opacity-70 bg-surface"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-warning-text flex items-center gap-1">
                      <AlertTriangle size={13} /> {alerta.regra}
                    </span>
                    <span className="text-fg-2">·</span>
                    <span className="text-fg-2">{alerta.timestamp}</span>
                    <Badge variant={alerta.status === "pendente" ? "accent" : alerta.status === "aprovado" ? "success" : "neutral"}>
                      Status: {alerta.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-[17px] font-semibold text-fg">
                    {alerta.leilaoTitulo} · {alerta.fornecedorNome}
                  </h3>

                  <p className="text-xs text-fg-2 max-w-2xl">{alerta.motivo}</p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <span>
                      Valor ofertado: <Mono className="font-bold text-fg">{formatBRL(alerta.valorCentavos)}</Mono>
                    </span>
                    <span>
                      Teto do pedido: <Mono className="text-fg-2">{formatBRL(alerta.tetoCentavos)}</Mono>
                    </span>
                  </div>
                </div>

                {alerta.status === "pendente" ? (
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => resolverAlerta(alerta.id, "aprovado")}
                      className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] bg-success text-white text-xs font-semibold hover:bg-success/90 transition-colors"
                    >
                      <CheckCircle2 size={14} className="mr-1.5" />
                      Aprovar lance
                    </button>
                    <button
                      onClick={() => resolverAlerta(alerta.id, "rejeitado")}
                      className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] bg-error text-white text-xs font-semibold hover:bg-error/90 transition-colors"
                    >
                      <XCircle size={14} className="mr-1.5" />
                      Recusar e punir
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-fg-2">Decisão registrada em audit_log</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabela de Audit Log Imutável (RN19) */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-fg flex items-center gap-2">
              <Lock size={17} className="text-accent-text" />
              Trilha de Auditoria (audit_log)
            </h2>
            <p className="text-xs text-fg-2 mt-0.5">
              Registro append-only de todas as ações sensíveis realizadas na plataforma.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-2">Mostrando últimos 4 eventos</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-fg-2 font-semibold pb-3">
                <th className="pb-3">Data / Hora</th>
                <th className="pb-3">Ator</th>
                <th className="pb-3">Ação</th>
                <th className="pb-3">Entidade</th>
                <th className="pb-3">Detalhes</th>
                <th className="pb-3">Origem / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-fg">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-mono text-fg-2">{log.timestamp}</td>
                  <td className="py-3 font-medium">{log.ator}</td>
                  <td className="py-3">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold text-accent-text">
                      {log.acao}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-fg-2">{log.entidade}:{log.entidadeId}</td>
                  <td className="py-3 text-fg max-w-xs truncate">{log.detalhe}</td>
                  <td className="py-3 font-mono text-[11px] text-fg-2">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
