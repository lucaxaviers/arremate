import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";

const FUNIL = [
  { etapa: "1. Necessidades publicadas", valor: 18, pct: 100, cor: "bg-ink" },
  { etapa: "2. Com lances recebidos (>1)", valor: 17, pct: 94.4, cor: "bg-accent" },
  { etapa: "3. Arrematados com contrato", valor: 14, pct: 77.8, cor: "bg-success" },
  { etapa: "4. Executados e avaliados", valor: 12, pct: 66.7, cor: "bg-fg-2" },
];

const CATEGORIAS_METRICAS = [
  { nome: "Buffet & Gastronomia", pedidos: 7, volume: 4620000, pct: 39 },
  { nome: "Foto & Filmagem", pedidos: 5, volume: 1850000, pct: 28 },
  { nome: "DJ & Iluminação", pedidos: 3, volume: 980000, pct: 17 },
  { nome: "Decoração & Cenografia", pedidos: 2, volume: 640000, pct: 11 },
  { nome: "Frete e Reformas", pedidos: 1, volume: 360000, pct: 5 },
];

export default function MetricasAdminPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/admin" className="hover:text-fg">Painel Admin</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Métricas do Piloto</span>
      </div>

      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>Operação Piloto · Paulínia & Campinas</Eyebrow>
            <Badge variant="success">Fase 1: Validação Ativa</Badge>
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
            Indicadores e Métricas
          </h1>
          <p className="mt-1.5 text-base text-fg-2">
            Acompanhamento da liquidez dos leilões, velocidade de resposta dos fornecedores e economia dos clientes.
          </p>
        </div>
      </header>

      {/* Grade de 4 Métricas Principais (Documento Mestre Seção 18) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Tempo até 1º Lance
          </span>
          <Mono className="mt-2 text-3xl font-bold text-fg">8 min</Mono>
          <span className="text-xs text-success-text mt-1.5 block font-medium">
            Meta do piloto: &lt; 15 min
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Economia Média do Cliente
          </span>
          <Mono className="mt-2 text-3xl font-bold text-success-text">21,3%</Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            Abaixo do teto orçamentário inicial
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Taxa de Arremate
          </span>
          <Mono className="mt-2 text-3xl font-bold text-fg">78,5%</Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            14 de 18 leilões concluídos
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Média de Lances / Pedido
          </span>
          <Mono className="mt-2 text-3xl font-bold text-accent-text">3,4</Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            Disputa real entre fornecedores
          </span>
        </Card>
      </div>

      {/* Funil de Conversão do Leilão Reverso */}
      <Card className="p-6 md:p-8 mb-8">
        <h2 className="text-[18px] font-semibold text-fg mb-1">
          Funil de Conversão do Piloto
        </h2>
        <p className="text-xs text-fg-2 mb-6">
          Acompanhe a retenção do cliente desde a publicação até a assinatura e avaliação do serviço.
        </p>

        <div className="space-y-4">
          {FUNIL.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">{f.etapa}</span>
                <span className="font-mono text-fg-2">
                  <strong className="text-fg">{f.valor}</strong> ({f.pct}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${f.cor} transition-all duration-500`}
                  style={{ width: `${f.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Distribuição por Categoria e Volume */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 md:p-8">
          <h2 className="text-[18px] font-semibold text-fg mb-1">
            Demanda por Categoria
          </h2>
          <p className="text-xs text-fg-2 mb-6">
            Segmentos com maior volume de contratações na região de Paulínia e Campinas.
          </p>

          <div className="space-y-4 divide-y divide-line">
            {CATEGORIAS_METRICAS.map((c, i) => (
              <div key={i} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-sm font-semibold text-fg block">{c.nome}</strong>
                  <span className="text-fg-2">{c.pedidos} pedidos arrematados</span>
                </div>
                <div className="text-right">
                  <Mono className="font-bold text-fg">{formatBRL(c.volume)}</Mono>
                  <span className="text-fg-2 block">{c.pct}% do volume</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <h2 className="text-[18px] font-semibold text-fg mb-1">
            Fornecedores e Liquidez Local
          </h2>
          <p className="text-xs text-fg-2 mb-6">
            Status da base de fornecedores cadastrados e verificados.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-[12px] border border-line p-4">
              <div>
                <strong className="text-sm font-semibold text-fg block">Fornecedores Verificados</strong>
                <span className="text-fg-2">Com documento (CPF/CNPJ) e selfie conferidos</span>
              </div>
              <Mono className="text-xl font-bold text-fg">12</Mono>
            </div>

            <div className="flex items-center justify-between rounded-[12px] border border-line p-4">
              <div>
                <strong className="text-sm font-semibold text-fg block">Taxa de Resposta</strong>
                <span className="text-fg-2">Média de agilidade no envio de lances</span>
              </div>
              <Mono className="text-xl font-bold text-success-text">98%</Mono>
            </div>

            <div className="flex items-center justify-between rounded-[12px] border border-line p-4">
              <div>
                <strong className="text-sm font-semibold text-fg block">Raio Médio de Atendimento</strong>
                <span className="text-fg-2">Distância média configurada</span>
              </div>
              <Mono className="text-xl font-bold text-fg">32 km</Mono>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
