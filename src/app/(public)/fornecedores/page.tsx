import { Check, TrendingUp, Bell, FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Mono } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";

const HERO_IMAGES: TiltedGridImage[] = [
  {
    src: "/img/categories/buffet.jpg",
    alt: "Buffet & Gastronomia para eventos em Paulínia",
  },
  {
    src: "/img/categories/fotografia.jpg",
    alt: "Fotografia profissional e filmagem com drone",
  },
  {
    src: "/img/categories/dj.jpg",
    alt: "DJ, som profissional e iluminação para pistas",
  },
  {
    src: "/img/categories/decoracao.jpg",
    alt: "Decoração e cenografia floral para casamentos",
  },
  {
    src: "/img/categories/frete.jpg",
    alt: "Frete e transportes residenciais e comerciais",
  },
  {
    src: "/img/categories/reforma.jpg",
    alt: "Reformas, pintura e reparos rápidos",
  },
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    alt: "Bartenders e coquetelaria fina para festas",
  },
  {
    src: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
    alt: "Confeitaria artesanal e doces finos",
  },
];

const STEPS = [
  { n: "01", t: "Defina seus segmentos e raio", d: "Escolha as categorias que você atende e a distância máxima em km a partir da sua cidade base." },
  { n: "02", t: "Receba avisos qualificados", d: "Seja notificado em tempo real apenas quando um cliente publicar um pedido dentro do seu raio com data e orçamento definidos." },
  { n: "03", t: "Dê lances e ajuste sua proposta", d: "Envie valor, prazo e itens inclusos. Acompanhe sua posição no leilão e reduza seu valor para vencer a disputa." },
  { n: "04", t: "Receba avaliação e suba no ranking", d: "Ao arrematar, o contrato é gerado e o contato direto é liberado. Clientes satisfeitos aumentam sua nota para os próximos leilões." },
];

const PLANS = [
  {
    nome: "Grátis",
    preco: 0,
    periodo: "para sempre",
    lances: "3 lances por mês",
    destaque: false,
    recursos: [
      "Acesso a todos os leilões da sua região",
      "Notificações instantâneas por e-mail",
      "Posição em tempo real na disputa",
      "Contrato em PDF após arrematar",
    ],
    cta: "Cadastrar grátis",
  },
  {
    nome: "Pro",
    preco: 9990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados",
    destaque: true,
    badge: "Mais escolhido",
    recursos: [
      "Lances ilimitados todo mês",
      "Relatórios de perda: entenda por que perdeu",
      "Selo de fornecedor verificado em destaque",
      "Prioridade na fila de suporte",
    ],
    cta: "Disponível na V2",
  },
  {
    nome: "Prime",
    preco: 19990,
    periodo: "mês (a validar)",
    lances: "Lances ilimitados",
    destaque: false,
    recursos: [
      "Tudo do plano Pro",
      "Prioridade máxima nas notificações de novos leilões",
      "Acesso antecipado a leilões urgentes",
      "Relatório de inteligência de preços da região",
    ],
    cta: "Disponível na V2",
  },
];

const FAQ = [
  ["Preciso ter CNPJ para me cadastrar?", "Não. Aceitamos autônomos com CPF e profissionais MEI ou empresas PJ. Todos passam por verificação de identidade com selfie."],
  ["Quanto custa para começar?", "Nada. O cadastro é gratuito e você tem direito a 3 lances todos os meses sem pagar nada."],
  ["Eu vejo os preços que os outros fornecedores enviaram?", "Não. Para manter a disputa justa e evitar guerra predatória de preços, você vê apenas a sua posição (ex.: 'Você está em 2º lugar de 4') e o total de participantes."],
  ["Posso desistir do serviço após o arremate?", "Pode, mas isso gera penalidade de reputação e o pedido é reaberto aos outros concorrentes. Cancelamentos recorrentes levam à suspensão."],
  ["Como recebo o pagamento?", "No MVP o pagamento é acertado e pago diretamente pelo cliente conforme os termos combinados no contrato simples."],
];

export default function FornecedoresLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero com TiltedGridHero 3D Cylinder */}
      <TiltedGridHero
        images={HERO_IMAGES}
        speed={4.5}
        curve={78}
        tileHeight={28}
        className="relative min-h-[600px] md:min-h-[660px] w-full border-b border-line bg-[#0A0A0B] text-[#FAFAF9]"
      >
        <div className="relative z-10 flex min-h-[600px] md:min-h-[660px] flex-col items-center justify-center px-4 py-16 text-center md:px-6">
          <h1 className="max-w-4xl text-[38px] sm:text-[54px] md:text-[64px] font-semibold tracking-[-0.035em] text-[#FAFAF9] leading-[1.06]">
            Receba clientes prontos para fechar.{" "}
            <span className="text-slate-400 block sm:inline">Sem gastar 1 centavo em anúncio.</span>
          </h1>

          <p className="mx-auto mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Cadastre-se e receba demandas com data, cidade e orçamento garantidos. Dispute lances em tempo real e feche serviços locais com contrato simples em PDF.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href="/cadastro-fornecedor"
              variant="primary"
              className="h-12 px-8 !bg-[#F59E0B] !text-[#0A0A0B] hover:!bg-[#D97706] font-semibold shadow-lg shadow-amber-500/20"
            >
              Cadastrar como fornecedor
            </ButtonLink>
            <ButtonLink
              href="#planos"
              variant="ghost"
              className="h-12 px-6 border border-slate-700 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              Conhecer planos
            </ButtonLink>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            3 lances gratuitos todo mês · Autônomos (CPF) e Empresas (CNPJ)
          </p>
        </div>
      </TiltedGridHero>

      {/* Problema */}
      <section className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Eyebrow>O problema hoje</Eyebrow>
          <h2 className="mt-3 text-[32px] font-semibold md:text-[40px]">
            Você responde 10 orçamentos e fecha 2.{" "}
            <span className="text-fg-2">Não sabe por que perdeu os outros 8.</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-accent-text">
                <Bell size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-[18px] font-semibold">Tempo perdido no WhatsApp</h3>
              <p className="mt-2 text-sm text-fg-2">
                Horas enviando propostas personalizadas para curiosos sem orçamento definido que nunca mais respondem.
              </p>
            </Card>
            <Card className="p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-accent-text">
                <FileText size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-[18px] font-semibold">Sem saber quem concorre</h3>
              <p className="mt-2 text-sm text-fg-2">
                Você nunca descobre se perdeu por preço, prazo ou itens inclusos. O feedback é nulo.
              </p>
            </Card>
            <Card className="p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-muted text-accent-text">
                <TrendingUp size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-[18px] font-semibold">Datas ociosas na agenda</h3>
              <p className="mt-2 text-sm text-fg-2">
                Finais de semana vazios representam receita que nunca mais volta. No Arremate você ocupa sua agenda com lances estratégicos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-5xl px-4 py-24 md:px-6">
        <Eyebrow>Como funciona</Eyebrow>
        <h2 className="mt-3 text-[32px] font-semibold md:text-[40px]">Quatro passos até fechar negócio.</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[16px] border border-line bg-surface p-6">
              <span className="font-mono text-sm font-semibold text-accent-text">{s.n}</span>
              <h3 className="mt-3 text-[20px] font-semibold">{s.t}</h3>
              <p className="mt-2 text-[15px] text-fg-2">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Planos */}
      <section id="planos" className="border-y border-line bg-surface py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="text-center">
            <Eyebrow>Planos e preços</Eyebrow>
            <h2 className="mt-3 text-[32px] font-semibold md:text-[40px]">Comece grátis. Escale quando quiser.</h2>
            <p className="mt-3 text-fg-2">Preços e planos transparentes. Sem comissões ocultas no MVP.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.nome}
                className={`relative flex flex-col justify-between rounded-[16px] border bg-card p-6 ${
                  p.destaque ? "border-2 border-accent shadow-lg" : "border-line"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-semibold">{p.nome}</h3>
                    {p.badge && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[12px] font-medium text-ink">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <Mono className="text-[32px] font-semibold text-fg">
                      {p.preco === 0 ? "R$ 0" : formatBRL(p.preco)}
                    </Mono>
                    <span className="text-sm text-fg-2">/ {p.periodo}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-accent-text">{p.lances}</p>

                  <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm text-fg-2">
                    {p.recursos.map((r) => (
                      <li key={r} className="flex items-start gap-2.5">
                        <Check size={16} strokeWidth={1.5} className="text-success-text shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  {p.destaque ? (
                    <ButtonLink href="/cadastro-fornecedor" variant="primary" className="w-full">
                      {p.cta}
                    </ButtonLink>
                  ) : (
                    <ButtonLink href="/cadastro-fornecedor" variant="secondary" className="w-full">
                      {p.cta}
                    </ButtonLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
        <h2 className="text-[32px] font-semibold text-center">Perguntas frequentes do fornecedor</h2>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                <span>{q}</span>
                <span className="text-fg-2 transition-transform duration-150 group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="prose-width mt-3 text-sm text-fg-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left md:px-6">
          <div>
            <h2 className="text-[32px] font-semibold">Pronto para receber pedidos da sua região?</h2>
            <p className="mt-2 text-sm text-slate-300">Leva menos de 5 minutos para criar seu perfil e enviar seus documentos.</p>
          </div>
          <ButtonLink href="/cadastro-fornecedor" variant="primary" className="h-12 px-8">
            Criar conta de fornecedor
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
