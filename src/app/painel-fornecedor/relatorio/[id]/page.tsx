import Link from "next/link";
import {
  ChevronRight, ShieldCheck, CheckCircle2, ArrowLeft, Lightbulb
} from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RelatorioPerdaPage({ params }: PageProps) {
  const { id } = await params;

  // Dados reais simulados para o relatório conforme regra RN15
  const dados = {
    leilaoId: id,
    titulo: "Buffet para 120 pessoas",
    cidade: "Paulínia",
    categoria: "Buffet",
    dataEncerramento: "Hoje, 12:45",
    posicaoFinal: 2,
    totalParticipantes: 4,
    valorVencedorCentavos: 1180000,
    meuValorCentavos: 1240000,
    medianaCentavos: 1275000,
    diferencaCentavos: 60000,
    vencedor: {
      nota: 4.9,
      prazoDias: 3,
      totalItens: 4,
      itensInclusos: [
        "Buffet completo (entradas, prato principal, sobremesas)",
        "Equipe completa de garçons e copeiras",
        "Louças, talheres e taças de cristal",
        "Degustação prévia para 2 pessoas",
      ],
    },
    meuLance: {
      nota: 4.6,
      prazoDias: 2,
      totalItens: 2,
      itensInclusos: [
        "Buffet tradicional completo",
        "Louças e toalhas padrão",
      ],
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/painel-fornecedor" className="hover:text-fg">Painel do fornecedor</Link>
        <ChevronRight size={12} />
        <Link href="/painel-fornecedor/lances" className="hover:text-fg">Meus lances</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Relatório pós-leilão</span>
      </div>

      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>Inteligência de Mercado · RN15</Eyebrow>
            <Badge variant="neutral">Confidencial</Badge>
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
            Por que você perdeu este leilão
          </h1>
          <p className="mt-1.5 text-base text-fg-2 max-w-2xl">
            {dados.titulo} · {dados.cidade} · Encerrado {dados.dataEncerramento}.
          </p>
        </div>
        <ButtonLink href="/painel-fornecedor/leiloes" variant="secondary" className="h-10 px-4 text-xs">
          <ArrowLeft size={14} className="mr-1.5" />
          Ver outros leilões
        </ButtonLink>
      </header>

      {/* Alerta de Privacidade RN15 */}
      <div className="mb-8 rounded-[14px] border border-line bg-muted/60 p-4 text-xs text-fg-2 flex items-start gap-3">
        <ShieldCheck size={18} className="text-accent-text shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-fg font-semibold">Privacidade assegurada por RN15:</strong> Os dados abaixo são
          agregados para fins de aprendizagem e aprimoramento de propostas. A identidade, razão social e contatos do
          concorrente vencedor permanecem anônimos.
        </p>
      </div>

      {/* 4 Cards de Métricas Chave */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Sua Posição Final
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-fg font-mono">
              #{dados.posicaoFinal}
            </span>
            <span className="text-xs text-fg-2">de {dados.totalParticipantes} fornecedores</span>
          </div>
          <span className="text-xs text-accent-text mt-1.5 block font-medium">
            Você quase ganhou!
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Valor Vencedor
          </span>
          <Mono className="mt-2 text-2xl font-bold text-success-text">
            {formatBRL(dados.valorVencedorCentavos)}
          </Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            Diferença: {formatBRL(dados.diferencaCentavos)} a menos
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Seu Menor Lance
          </span>
          <Mono className="mt-2 text-2xl font-bold text-fg">
            {formatBRL(dados.meuValorCentavos)}
          </Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            Redução final aplicada
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-fg-2 font-medium block">
            Mediana da Categoria
          </span>
          <Mono className="mt-2 text-2xl font-bold text-fg-2">
            {formatBRL(dados.medianaCentavos)}
          </Mono>
          <span className="text-xs text-fg-2 mt-1.5 block">
            Na sua praça de atuação
          </span>
        </Card>
      </div>

      {/* Tabela de Comparação Lado a Lado dos Fatores de Decisão */}
      <Card className="p-6 mb-8">
        <h2 className="text-[18px] font-semibold text-fg mb-1">
          Comparativo dos diferenciais do lance vencedor
        </h2>
        <p className="text-xs text-fg-2 mb-6">
          Entenda os fatores que pesaram no algoritmo de recomendação e na escolha soberana do cliente.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold text-fg-2">
                <th className="pb-3 w-1/3">Critério de Avaliação</th>
                <th className="pb-3 w-1/3 text-success-text">Lance Vencedor (1º)</th>
                <th className="pb-3 w-1/3 text-fg">Sua Proposta (2º)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs md:text-sm">
              <tr>
                <td className="py-3.5 font-medium text-fg">Valor final ofertado</td>
                <td className="py-3.5">
                  <Mono className="font-bold text-success-text">
                    {formatBRL(dados.valorVencedorCentavos)}
                  </Mono>
                </td>
                <td className="py-3.5">
                  <Mono className="font-medium text-fg">
                    {formatBRL(dados.meuValorCentavos)}
                  </Mono>
                  <span className="text-[11px] text-error-text block">+4.8% vs vencedor</span>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 font-medium text-fg">Avaliação média histórica</td>
                <td className="py-3.5 font-medium text-fg">
                  ★ {dados.vencedor.nota} <span className="text-fg-2 text-xs">(mais contratos)</span>
                </td>
                <td className="py-3.5 font-medium text-fg">
                  ★ {dados.meuLance.nota}
                </td>
              </tr>

              <tr>
                <td className="py-3.5 font-medium text-fg">Prazo de execução</td>
                <td className="py-3.5 text-fg">{dados.vencedor.prazoDias} dias úteis</td>
                <td className="py-3.5 text-fg">
                  {dados.meuLance.prazoDias} dias úteis <span className="text-success-text text-xs">(Seu prazo foi mais ágil)</span>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 font-medium text-fg">Itens inclusos expressamente</td>
                <td className="py-3.5">
                  <span className="font-semibold text-fg block mb-1">
                    {dados.vencedor.totalItens} itens detalhados:
                  </span>
                  <ul className="space-y-1 text-xs text-fg-2 list-disc list-inside">
                    {dados.vencedor.itensInclusos.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5">
                  <span className="font-semibold text-fg block mb-1">
                    {dados.meuLance.totalItens} itens detalhados:
                  </span>
                  <ul className="space-y-1 text-xs text-fg-2 list-disc list-inside">
                    {dados.meuLance.itensInclusos.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bloco de Recomendações e Aprendizados Práticos */}
      <div className="rounded-[16px] border border-accent/40 bg-accent/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-accent-text">
          <Lightbulb size={20} strokeWidth={2} />
          <h3 className="text-[16px] font-semibold text-fg">
            Recomendações para vencer o seu próximo leilão
          </h3>
        </div>

        <ul className="space-y-2.5 text-xs md:text-sm text-fg-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-success-text shrink-0 mt-0.5" />
            <span>
              <strong className="text-fg">Discrimine mais itens inclusos:</strong> Clientes tendem a pagar até 10% a mais
              por propostas que incluem detalhes como degustação prévia, equipe inclusa ou louças personalizadas.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-success-text shrink-0 mt-0.5" />
            <span>
              <strong className="text-fg">Use a redução mínima estratégica (RN06):</strong> Nos últimos minutos antes do encerramento,
              você pode reduzir seu valor em R$ 10 ou 1% para reassumir o 1º lugar sem desvalorizar o seu serviço.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-success-text shrink-0 mt-0.5" />
            <span>
              <strong className="text-fg">Seu prazo já é competitivo:</strong> Você ofertou 2 dias contra 3 dias do vencedor.
              Mantenha essa agilidade nos próximos lances.
            </span>
          </li>
        </ul>

        <div className="pt-2">
          <ButtonLink href="/painel-fornecedor/leiloes" variant="primary" className="h-10 px-6 text-xs font-semibold">
            Buscar leilões abertos na região
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
