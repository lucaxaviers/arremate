import { Check, X, HelpCircle } from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";

const PLANOS_FORNECEDOR = [
  {
    id: "gratis",
    nome: "Grátis",
    precoCentavos: 0,
    periodo: "para sempre",
    lances: "3 lances por mês",
    statusPiloto: "Ativo no Piloto",
    destaque: false,
    resumo: "Perfeito para profissionais autônomos e empresas que querem testar o leilão reverso sem risco.",
    recursos: [
      "3 lances mensais renovados todo dia 1º",
      "Acesso completo a todos os leilões no seu raio (km)",
      "Posição ordinal em tempo real ('1º de 4', '2º de 4')",
      "Emissão automática de contrato simples em PDF",
      "Liberação do contato direto do cliente após arrematar",
      "Suporte básico por e-mail",
    ],
    cta: "Cadastrar grátis",
    ctaLink: "/cadastro-fornecedor",
  },
  {
    id: "pro",
    nome: "Pro",
    precoCentavos: 9990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados",
    statusPiloto: "Fase 1 (V2)",
    destaque: true,
    badge: "Mais Popular",
    resumo: "Para fornecedores que querem alta recorrência, múltiplos contratos semanais e inteligência de lances.",
    recursos: [
      "Lances ilimitados em todas as categorias atendidas",
      "Relatórios de inteligência 'Por que você perdeu' (RN15)",
      "Selo de fornecedor verificado com destaque visual na listagem",
      "Alertas prioritários de novos leilões no seu raio",
      "Métricas históricas de precificação da sua categoria",
      "Suporte com prioridade na fila",
    ],
    cta: "Entrar na lista de espera (V2)",
    ctaLink: "/cadastro-fornecedor",
  },
  {
    id: "prime",
    nome: "Prime",
    precoCentavos: 19990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados + Urgentes",
    statusPiloto: "Fase 1 (V2)",
    destaque: false,
    resumo: "Para operações consolidadas que atendem múltiplos eventos e exigem prioridade máxima de notificação.",
    recursos: [
      "Tudo incluído no plano Pro",
      "Acesso antecipado exclusivo a leilões urgentes (2h)",
      "Prioridade máxima no algoritmo de 'Recomendados' (RN10)",
      "Painel com tendências de sazonalidade e ticket médio",
      "Consultoria de precificação competitiva para leilão reverso",
      "Canal de suporte direto via WhatsApp",
    ],
    cta: "Entrar na lista de espera (V2)",
    ctaLink: "/cadastro-fornecedor",
  },
];

const MATRIZ_RECURSOS = [
  { item: "Lances por mês", gratis: "3 lances", pro: "Ilimitados", prime: "Ilimitados" },
  { item: "Leilões da região no raio (km)", gratis: true, pro: true, prime: true },
  { item: "Acompanhamento de posição em tempo real", gratis: true, pro: true, prime: true },
  { item: "Emissão de contrato simples em PDF (RN12)", gratis: true, pro: true, prime: true },
  { item: "Liberação de contato direto após arremate", gratis: true, pro: true, prime: true },
  { item: "Relatório de por que perdeu (RN15)", gratis: false, pro: true, prime: true },
  { item: "Selo de verificação em destaque", gratis: false, pro: true, prime: true },
  { item: "Prioridade máxima de notificação", gratis: false, pro: "Média", prime: "Máxima" },
  { item: "Acesso antecipado a leilões urgentes (2h)", gratis: false, pro: false, prime: true },
  { item: "Canal direto de suporte", gratis: "E-mail", pro: "Prioritário", prime: "WhatsApp" },
];

const FASES_MONETIZACAO = [
  {
    fase: "Fase 0: Piloto (Hoje)",
    status: "Operação Atual",
    desc: "100% gratuito para quem contrata e para quem fornece na região de Paulínia e Campinas. Foco total em provar liquidez, velocidade de resposta e economia real.",
  },
  {
    fase: "Fase 1: Assinatura do Fornecedor (V2)",
    status: "Próximo Passo",
    desc: "Plano Grátis permanente com 3 lances/mês. Lançamento dos planos Pro (R$ 99,90) e Prime (R$ 199,90) para fornecedores que desejam escala e relatórios competitivos.",
  },
  {
    fase: "Fase 2: Pagamento & Escrow (V2/V3)",
    status: "Futuro Regulado",
    desc: "Sinal e retenção por Pix com parceiro de pagamento regulado. Comissão calibrada entre 5% e 10% sobre o valor intermediado (isenta para contratos de menor valor).",
  },
];

export default function PrecosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-20">
      {/* Header Central */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <Eyebrow>Preços & Modelo de Negócio</Eyebrow>
        <h1 className="mt-2 text-[38px] sm:text-[48px] font-semibold tracking-tight text-fg leading-[1.08]">
          Você diz o que precisa. <br />
          O mercado compete pelo melhor valor.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-fg-2 leading-relaxed">
          Premissa inegociável do produto: <strong className="text-fg font-semibold">o cliente nunca paga nada</strong>.
          Fornecedores começam de graça com 3 lances mensais e investem apenas se quiserem expandir seu alcance.
        </p>
      </header>

      {/* Destaque das Duas Pontas */}
      <div className="grid gap-6 md:grid-cols-2 mb-16">
        {/* Card do Cliente */}
        <Card className="p-8 flex flex-col justify-between border-success/40 bg-success/5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-success-text">
                Para quem contrata
              </span>
              <Badge tone="success">100% Gratuito</Badge>
            </div>

            <h2 className="text-[28px] font-semibold text-fg mb-2">Cliente</h2>
            <p className="text-sm text-fg-2 mb-6">
              Publique qualquer necessidade na sua região. Receba propostas detalhadas em disputa ao vivo e escolha a melhor.
            </p>

            <div className="mb-6 border-b border-line pb-6">
              <div className="flex items-baseline gap-1">
                <Mono className="text-4xl font-bold text-fg">R$ 0</Mono>
                <span className="text-sm text-fg-2">/ para sempre</span>
              </div>
              <span className="text-xs text-fg-2 block mt-1">
                Sem mensalidade, sem comissão oculta, sem exigência de cartão.
              </span>
            </div>

            <ul className="space-y-3 text-xs text-fg-2 mb-8">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Publique até 3 leilões simultâneos com orçamento máximo definido (RN02)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Acompanhe lances em tempo real com ordenação inteligente de Recomendados (RN10)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Emissão automática de contrato formal simples em PDF (RN12)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Cancelamento 100% sem custos garantido em até 24 horas (RN13)</span>
              </li>
            </ul>
          </div>

          <ButtonLink href="/painel-cliente/novo" variant="primary" className="h-12 w-full justify-center text-sm font-semibold">
            Publicar necessidade grátis
          </ButtonLink>
        </Card>

        {/* Card do Fornecedor */}
        <Card className="p-8 flex flex-col justify-between border-accent/40 bg-accent/5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-text">
                Para fornecedores locais
              </span>
              <Badge tone="accent">3 Lances Grátis / Mês</Badge>
            </div>

            <h2 className="text-[28px] font-semibold text-fg mb-2">Fornecedor</h2>
            <p className="text-sm text-fg-2 mb-6">
              Receba notificações de clientes com data e orçamento reais. Feche contratos sem gastar fortunas em anúncios.
            </p>

            <div className="mb-6 border-b border-line pb-6">
              <div className="flex items-baseline gap-1">
                <Mono className="text-4xl font-bold text-fg">R$ 0</Mono>
                <span className="text-sm text-fg-2">/ para começar</span>
              </div>
              <span className="text-xs text-fg-2 block mt-1">
                3 lances por mês renovados automaticamente no dia 1º.
              </span>
            </div>

            <ul className="space-y-3 text-xs text-fg-2 mb-8">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Acesso a todos os leilões abertos dentro do seu raio de atendimento (RN05)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Notificações em tempo real por push e e-mail</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Acompanhamento transparente da sua posição ordinal (&quot;2º de 4&quot;)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Opção de assinatura de planos Pro ou Prime para lances ilimitados na V2</span>
              </li>
            </ul>
          </div>

          <ButtonLink href="/cadastro-fornecedor" variant="secondary" className="h-12 w-full justify-center text-sm font-semibold">
            Cadastrar como fornecedor
          </ButtonLink>
        </Card>
      </div>

      {/* Tabela dos 3 Planos de Assinatura do Fornecedor */}
      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>Planos para Fornecedores · Seção 09</Eyebrow>
          <h2 className="mt-2 text-[30px] sm:text-[38px] font-semibold text-fg">
            Escolha o plano ideal para a sua escala
          </h2>
          <p className="mt-2 text-sm text-fg-2">
            Dispute lances em Paulínia e Campinas com controle total do seu volume de propostas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANOS_FORNECEDOR.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-[22px] border p-7 transition-all ${
                p.destaque
                  ? "border-accent bg-surface shadow-xl ring-2 ring-accent"
                  : "border-line bg-surface"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3.5 right-6 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-ink shadow-sm">
                  {p.badge}
                </span>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[22px] font-semibold text-fg">{p.nome}</h3>
                  <Badge tone={p.id === "gratis" ? "success" : "neutral"}>
                    {p.statusPiloto}
                  </Badge>
                </div>
                <p className="text-xs text-fg-2 min-h-[34px]">{p.resumo}</p>
              </div>

              <div className="mb-6 border-b border-line pb-6">
                <div className="flex items-baseline gap-1">
                  <Mono className="text-3xl sm:text-4xl font-bold text-fg">
                    {p.precoCentavos === 0 ? "R$ 0" : formatBRL(p.precoCentavos)}
                  </Mono>
                  <span className="text-xs text-fg-2">/{p.periodo}</span>
                </div>
                <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-semibold text-accent-text">
                  {p.lances}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-fg-2 flex-1 mb-8">
                {p.recursos.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={15} className="text-success-text shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={p.ctaLink}
                variant={p.destaque ? "primary" : "secondary"}
                className="w-full h-11 justify-center text-xs font-semibold"
              >
                {p.cta}
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      {/* Matriz Comparativa Detalhada (Feature Matrix) */}
      <section className="mb-20">
        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <Eyebrow>Comparativo Completo</Eyebrow>
            <h2 className="mt-1 text-[22px] font-semibold text-fg">
              Matriz de recursos por plano
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold text-fg-2">
                  <th className="pb-3 w-2/5">Funcionalidade</th>
                  <th className="pb-3 w-1/5 text-center">Grátis</th>
                  <th className="pb-3 w-1/5 text-center text-accent-text">Pro (V2)</th>
                  <th className="pb-3 w-1/5 text-center">Prime (V2)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs md:text-sm">
                {MATRIZ_RECURSOS.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 font-medium text-fg">{row.item}</td>

                    <td className="py-3.5 text-center">
                      {typeof row.gratis === "boolean" ? (
                        row.gratis ? (
                          <Check size={16} className="text-success-text mx-auto" strokeWidth={2.5} />
                        ) : (
                          <X size={16} className="text-fg-2/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono font-medium text-fg">{row.gratis}</span>
                      )}
                    </td>

                    <td className="py-3.5 text-center bg-accent/[0.03]">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check size={16} className="text-success-text mx-auto" strokeWidth={2.5} />
                        ) : (
                          <X size={16} className="text-fg-2/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono font-bold text-accent-text">{row.pro}</span>
                      )}
                    </td>

                    <td className="py-3.5 text-center">
                      {typeof row.prime === "boolean" ? (
                        row.prime ? (
                          <Check size={16} className="text-success-text mx-auto" strokeWidth={2.5} />
                        ) : (
                          <X size={16} className="text-fg-2/40 mx-auto" />
                        )
                      ) : (
                        <span className="font-mono font-bold text-fg">{row.prime}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Fases do Roadmap de Monetização */}
      <section className="mb-20">
        <div className="max-w-2xl mb-8">
          <Eyebrow>Roadmap de Negócio · Seção 09</Eyebrow>
          <h2 className="mt-1 text-[26px] font-semibold text-fg">
            Evolução transparente da plataforma
          </h2>
          <p className="mt-2 text-xs md:text-sm text-fg-2">
            Entenda como o Arremate evolui da validação inicial em Paulínia para a monetização madura.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FASES_MONETIZACAO.map((f, i) => (
            <Card key={i} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent-text">FASE {i}</span>
                <Badge tone={i === 0 ? "success" : "neutral"}>{f.status}</Badge>
              </div>
              <h3 className="text-base font-semibold text-fg">{f.fase}</h3>
              <p className="text-xs text-fg-2 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Completa de Faturamento */}
      <section className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="text-[22px] font-semibold text-fg mb-6 flex items-center gap-2">
            <HelpCircle size={20} className="text-accent-text" />
            Dúvidas frequentes sobre preços e faturamento
          </h2>

          <div className="space-y-6 text-xs md:text-sm divide-y divide-line">
            <div className="pt-4 first:pt-0">
              <strong className="text-fg block font-semibold mb-1.5 text-base">
                Por que o cliente tem custo zero para contratar?
              </strong>
              <p className="text-fg-2 leading-relaxed">
                Cobrar taxas ou comissões do cliente reduz drasticamente a publicação de necessidades.
                Ao manter a contratação 100% gratuita, geramos abundância de demanda qualificada para os fornecedores
                locais, que competem felizes por clientes prontos para fechar.
              </p>
            </div>

            <div className="pt-4">
              <strong className="text-fg block font-semibold mb-1.5 text-base">
                Como funciona a renovação dos 3 lances grátis por mês?
              </strong>
              <p className="text-fg-2 leading-relaxed">
                Todo dia 1º de cada mês, seu saldo de 3 lances é renovado automaticamente. Seus lances não acumulam para
                o mês seguinte. Você não precisa cadastrar cartão de crédito para utilizar seus 3 lances mensais.
              </p>
            </div>

            <div className="pt-4">
              <strong className="text-fg block font-semibold mb-1.5 text-base">
                O Arremate cobra porcentagem sobre o valor fechado no MVP?
              </strong>
              <p className="text-fg-2 leading-relaxed">
                Não no MVP. Conforme estipulado na regra RN18, a plataforma é uma intermediadora tecnológica.
                Todo o pagamento do serviço arrematado é realizado diretamente entre cliente e fornecedor,
                sem retenção ou taxa percentual pela plataforma.
              </p>
            </div>

            <div className="pt-4">
              <strong className="text-fg block font-semibold mb-1.5 text-base">
                Existe fidelidade ou multa nos planos pagos da V2?
              </strong>
              <p className="text-fg-2 leading-relaxed">
                Nenhuma fidelidade. Os planos Pro e Prime serão mensais e poderão ser cancelados a qualquer momento com um
                clique no painel de configurações, retornando a conta para o plano Grátis imediatamente.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Final */}
      <div className="rounded-[24px] bg-ink p-8 sm:p-12 text-center text-white space-y-6">
        <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#FAFAF9]">
          Pronto para experimentar o leilão reverso?
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Publique o que você precisa em 5 minutos ou cadastre sua empresa para começar a receber demandas da sua região.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <ButtonLink href="/painel-cliente/novo" variant="primary" className="h-12 px-8 text-sm font-semibold">
            Publicar necessidade grátis
          </ButtonLink>
          <ButtonLink href="/cadastro-fornecedor" variant="secondary" className="h-12 px-6 text-sm font-semibold !text-white !border-slate-700 hover:!border-slate-500">
            Cadastrar como fornecedor
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
