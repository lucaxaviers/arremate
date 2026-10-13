"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, HelpCircle, Sparkles, X, CheckCircle2 } from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const PLANS = [
  {
    id: "gratis",
    nome: "Grátis",
    precoCentavos: 0,
    periodo: "mensal",
    lances: "3 lances por mês",
    statusAtual: true,
    descricao: "Ideal para iniciar e fechar seus primeiros serviços locais.",
    recursos: [
      "3 lances válidos por mês (renovação todo dia 1º)",
      "Acesso completo aos leilões dentro do seu raio",
      "Posição em tempo real na disputa (1º, 2º lugar)",
      "Emissão de contrato simples em PDF ao arrematar",
      "Liberação do contato direto do cliente",
    ],
  },
  {
    id: "pro",
    nome: "Pro",
    precoCentavos: 9990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados",
    statusAtual: false,
    destaque: true,
    badge: "Recomendado",
    descricao: "Para fornecedores que querem alta recorrência e fechar toda semana.",
    recursos: [
      "Lances ilimitados em todas as categorias",
      "Relatórios de inteligência 'Por que você perdeu' (RN15)",
      "Selo de fornecedor verificado com destaque na lista",
      "Notificações instantâneas prioritárias",
      "Acompanhamento histórico de preços na região",
    ],
  },
  {
    id: "prime",
    nome: "Prime",
    precoCentavos: 19990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados + Urgentes",
    statusAtual: false,
    descricao: "Para empresas consolidadas com estrutura e múltiplos atendimentos.",
    recursos: [
      "Tudo incluído no plano Pro",
      "Acesso antecipado exclusivo a leilões urgentes (2h)",
      "Prioridade máxima no algoritmo de recomendação",
      "Canal de suporte direto e consultoria de precificação",
    ],
  },
];

export default function PlanoFornecedorPage() {
  const { success } = useToast();
  const [waitlistPlan, setWaitlistPlan] = useState<string | null>(null);

  const handleJoinWaitlist = (nomePlano: string) => {
    setWaitlistPlan(nomePlano);
    success(`Inscrição confirmada na lista prioritária do Plano ${nomePlano} (V2)!`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      {/* Modal de Lista Prioritária V2 */}
      {waitlistPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md rounded-[22px] border border-line bg-surface p-6 sm:p-8 shadow-2xl relative space-y-5 animate-scale-in">
            <button
              type="button"
              onClick={() => setWaitlistPlan(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-fg-2 hover:bg-muted hover:text-fg transition-colors"
              aria-label="Fechar modal"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-text block">
                  Acesso Antecipado
                </span>
                <h3 className="text-[20px] font-semibold text-fg">
                  Plano {waitlistPlan} · V2
                </h3>
              </div>
            </div>

            <p className="text-sm text-fg-2 leading-relaxed">
              Os planos Pro e Prime estarão disponíveis na V2 do Arremate. Seu e-mail foi cadastrado na lista prioritária!
            </p>

            <div className="rounded-[14px] bg-muted/60 border border-line/80 p-4 space-y-2.5 text-xs text-fg">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-success-text shrink-0 mt-0.5" />
                <span>Prioridade absoluta na fila de liberação de contas Pro na sua região.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-success-text shrink-0 mt-0.5" />
                <span>30 dias de isenção integral no primeiro mês de assinatura da V2.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-success-text shrink-0 mt-0.5" />
                <span>Você continua operando com seus 3 lances gratuitos no plano atual.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWaitlistPlan(null)}
              className="btn-amber w-full h-11 text-xs font-semibold"
            >
              Entendido, voltar aos planos
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/painel-fornecedor" className="hover:text-fg">Painel do fornecedor</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Plano e Assinatura</span>
      </div>

      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>Monetização · RN17</Eyebrow>
            <Badge variant="success">Plano Ativo: Grátis</Badge>
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
            Plano e saldo de lances
          </h1>
          <p className="mt-1.5 text-base text-fg-2">
            No MVP do Arremate você começa de graça com 3 lances todo mês sem taxa oculta.
          </p>
        </div>
      </header>

      {/* Cartão de Resumo do Saldo Atual */}
      <Card className="p-6 md:p-8 mb-10 border-accent/40 bg-accent/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-text block">
              Seu Saldo Mensal (Regra RN17)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-fg">2 de 3</span>
              <span className="text-sm text-fg-2">lances disponíveis este mês</span>
            </div>
            <p className="mt-2 text-xs text-fg-2">
              Seu saldo de lances é renovado automaticamente todo dia 1º de cada mês sem custo.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <Badge variant="accent">3 Lances Grátis / Mês</Badge>
            <span className="text-[11px] text-fg-2">Sem necessidade de cartão de crédito</span>
          </div>
        </div>
      </Card>

      {/* Comparação dos 3 Planos */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-[20px] border p-6 transition-all ${
              p.destaque
                ? "border-accent bg-surface shadow-md ring-1 ring-accent"
                : "border-line bg-surface"
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold text-ink">
                {p.badge}
              </span>
            )}

            <div className="mb-4">
              <h2 className="text-[20px] font-semibold text-fg">{p.nome}</h2>
              <p className="text-xs text-fg-2 mt-1 min-h-[32px]">{p.descricao}</p>
            </div>

            <div className="mb-6 border-b border-line pb-6">
              <div className="flex items-baseline gap-1">
                <Mono className="text-3xl font-bold text-fg">
                  {p.precoCentavos === 0 ? "R$ 0" : formatBRL(p.precoCentavos)}
                </Mono>
                <span className="text-xs text-fg-2">/{p.periodo}</span>
              </div>
              <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-accent-text">
                {p.lances}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-fg-2 flex-1 mb-6">
              {p.recursos.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={14} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div>
              {p.statusAtual ? (
                <button
                  disabled
                  className="w-full h-11 rounded-[10px] bg-muted border border-line text-xs font-semibold text-fg-2 cursor-default"
                >
                  Plano Atual (Ativo)
                </button>
              ) : (
                <button
                  onClick={() => handleJoinWaitlist(p.nome)}
                  className="btn-amber w-full h-11 text-xs font-semibold"
                >
                  Entrar na lista (V2)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ sobre Assinaturas */}
      <Card className="p-6 md:p-8">
        <h2 className="text-[18px] font-semibold text-fg mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-accent-text" />
          Dúvidas sobre faturamento e lances
        </h2>

        <div className="space-y-4 text-xs md:text-sm divide-y divide-line">
          <div className="pt-3 first:pt-0">
            <strong className="text-fg block font-semibold mb-1">
              O que acontece se meus 3 lances do mês acabarem?
            </strong>
            <p className="text-fg-2 leading-relaxed">
              Você continua visualizando todos os leilões abertos da região. No dia 1º do mês seguinte, seus 3 lances são
              renovados automaticamente sem qualquer cobrança.
            </p>
          </div>

          <div className="pt-3">
            <strong className="text-fg block font-semibold mb-1">
              O Arremate cobra porcentagem ou comissão sobre os serviços fechados?
            </strong>
            <p className="text-fg-2 leading-relaxed">
              Não no MVP. Todo o valor do lance arrematado é acertado e pago diretamente pelo cliente para você,
              conforme estipulado no contrato simples em PDF gerado na plataforma.
            </p>
          </div>

          <div className="pt-3">
            <strong className="text-fg block font-semibold mb-1">
              Como funciona o cancelamento dos planos pagos na V2?
            </strong>
            <p className="text-fg-2 leading-relaxed">
              Sem fidelidade ou multas. Você poderá alternar de volta para o plano Grátis a qualquer momento diretamente
              pelo painel.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
