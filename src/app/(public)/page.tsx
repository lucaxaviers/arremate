import Link from "next/link";
import {
  Search, ShieldCheck, MapPin, FileText, Check, ArrowRight,
  UtensilsCrossed, Camera, Music, Sparkles, Truck, Hammer
} from "lucide-react";
import { AuctionMock } from "@/components/marketing/auction-mock";
import { Eyebrow } from "@/components/ui/primitives";
import { AuctionScrollHistory } from "@/components/marketing/scroll-history";

const PROBLEMS = [
  {
    n: "01",
    t: "Pedir orçamento é lento.",
    d: "Você manda mensagem para vários fornecedores no WhatsApp. Cada um responde em dias e cobra um valor completamente diferente pelo mesmo serviço.",
  },
  {
    n: "02",
    t: "Comparar é pior.",
    d: "Cada orçamento vem num PDF ou mensagem diferente, com itens distintos inclusos, prazos vagos e condições escondidas que você só descobre no final.",
  },
  {
    n: "03",
    t: "Fechar é sorte.",
    d: "Sem histórico de cumprimento de prazos ou avaliações bilaterais verificadas, você arrisca seu evento ou reforma no fornecedor mais convincente.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Descreva o que você precisa.",
    d: "Informe a data, cidade, detalhes do serviço e o seu orçamento máximo. Leva menos de 5 minutos e não exige cartão.",
  },
  {
    n: "02",
    t: "Receba lances em tempo real.",
    d: "Fornecedores verificados da sua região competem pela sua demanda enviando valor, prazo e lista de itens inclusos.",
  },
  {
    n: "03",
    t: "Compare, escolha e arremate.",
    d: "Você tem total liberdade para escolher a melhor proposta. Ao arrematar, o contrato simples em PDF é gerado e o contato direto é liberado.",
  },
];

const CATEGORIES = [
  {
    id: "buffet",
    icon: UtensilsCrossed,
    t: "Buffet & Gastronomia",
    ex: "Casamentos, festas infantis e confraternizações",
    faixa: "R$ 1.500 a 30.000",
    image: "/img/categories/buffet.jpg",
  },
  {
    id: "fotografia",
    icon: Camera,
    t: "Fotografia & Filmagem",
    ex: "Cobertura de eventos, ensaios e drones",
    faixa: "R$ 1.500 a 8.000",
    image: "/img/categories/fotografia.jpg",
  },
  {
    id: "dj",
    icon: Music,
    t: "DJ, Som & Iluminação",
    ex: "Estrutura para pista, caixas de som e iluminação cênica",
    faixa: "R$ 1.000 a 5.000",
    image: "/img/categories/dj.jpg",
  },
  {
    id: "decoracao",
    icon: Sparkles,
    t: "Decoração & Cenografia",
    ex: "Arranjos florais, mobiliário e projetos visuais",
    faixa: "R$ 1.500 a 10.000",
    image: "/img/categories/decoracao.jpg",
  },
  {
    id: "frete",
    icon: Truck,
    t: "Frete & Mudanças",
    ex: "Mudanças residenciais, comerciais e transporte de cargas",
    faixa: "R$ 300 a 3.000",
    image: "/img/categories/frete.jpg",
  },
  {
    id: "reforma",
    icon: Hammer,
    t: "Reformas & Reparos",
    ex: "Pintura, elétrica, hidráulica, marcenaria e acabamentos",
    faixa: "R$ 500 a 15.000",
    image: "/img/categories/reforma.jpg",
  },
];

const FAQ = [
  {
    q: "Cobra algo do cliente?",
    a: "Não. É 100% gratuito para quem contrata. Você publica sua necessidade e recebe as propostas sem pagar nenhuma taxa ou comissão no MVP.",
  },
  {
    q: "Como sei que o fornecedor é confiável?",
    a: "Todo fornecedor passa por verificação rigorosa de documento (CPF ou CNPJ) e selfie. Além disso, você tem acesso ao histórico de contratos cumpridos e avaliações bilaterais reais.",
  },
  {
    q: "Posso cancelar após arrematar?",
    a: "Sim. Pela regra RN13, você pode cancelar sem qualquer custo em até 24 horas após o arremate.",
  },
  {
    q: "Quando chegam os lances?",
    a: "Depende da região e da categoria. Os fornecedores qualificados no seu raio de atendimento são notificados de imediato e o leilão fica aberto de 24h a 7 dias acompanhado ao vivo.",
  },
  {
    q: "A plataforma intermedeia pagamento?",
    a: "Ainda não. No MVP o pagamento é feito diretamente entre você e o fornecedor. O Arremate gera o contrato simples em PDF com os termos acertados e libera o contato direto.",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. SEÇÃO HERO (DIREÇÃO SÓBRIA E EDITORIAL DO DOCUMENTO MESTRE) */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-16 md:px-6 md:pt-16 md:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          
          {/* Coluna Esquerda: Headline + Busca + Microcopy */}
          <div className="space-y-6">
            
            {/* Headline oficial: Seção 15 do Documento Mestre */}
            <h1 className="text-[40px] sm:text-[50px] lg:text-[60px] font-semibold leading-[1.04] tracking-[-0.04em] text-fg text-balance">
              Você diz o que precisa. <br />
              O mercado diz quanto custa. <br />
              <span className="text-accent-text">Você decide.</span>
            </h1>

            {/* Subtítulo oficial conforme Documento Mestre Seção 15 */}
            <p className="max-w-[52ch] text-[17px] sm:text-[18px] leading-relaxed text-fg-2">
              Publique sua necessidade uma vez. Receba lances de fornecedores da sua região. Escolha o melhor.
            </p>

            {/* Formulário de Busca com Botão Âmbar Embutido */}
            <form action="/painel-cliente/novo" method="GET" className="field-search max-w-xl">
              <Search size={20} className="text-fg-2 shrink-0" aria-hidden="true" />
              <input
                id="hero-search-input"
                name="q"
                type="text"
                placeholder="O que você precisa? Buffet, fotografia, DJ..."
                className="flex-1 min-w-0 bg-transparent text-[16px] outline-none text-fg placeholder:text-fg-2/70"
                autoComplete="off"
              />
              <button type="submit" className="btn-amber">
                Publicar necessidade
                <span className="arr" aria-hidden="true">→</span>
              </button>
            </form>

            {/* Microtexto oficial de fricção zero */}
            <p className="text-xs text-fg-2">
              Leva 5 minutos. Você só cria a conta na hora de publicar. Sem cartão.
            </p>

            {/* Faixa de Confiança com Checks */}
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[13.5px] text-fg-2">
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-success-text shrink-0" strokeWidth={2.5} />
                <span>Fornecedores verificados</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-success-text shrink-0" strokeWidth={2.5} />
                <span>Lances em tempo real</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-success-text shrink-0" strokeWidth={2.5} />
                <span>Grátis para quem contrata</span>
              </li>
            </ul>
          </div>

          {/* Coluna Direita: Interactive Live Auction Widget */}
          <div className="pt-4 lg:pt-0">
            <AuctionMock />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FAIXA DE CONFIANÇA & TRANSPARÊNCIA */}
      {/* ========================================================================= */}
      <section className="border-y border-line bg-surface/60 py-7">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-text shrink-0">
              <ShieldCheck size={20} strokeWidth={1.75} />
            </div>
            <div>
              <strong className="text-[14px] font-semibold text-fg block">Verificação rigorosa</strong>
              <span className="text-xs text-fg-2">Apenas CPF/CNPJ com selfie aprovada</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-text shrink-0">
              <MapPin size={20} strokeWidth={1.75} />
            </div>
            <div>
              <strong className="text-[14px] font-semibold text-fg block">100% Regional</strong>
              <span className="text-xs text-fg-2">Fornecedores dentro do raio de atendimento</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-text shrink-0">
              <FileText size={20} strokeWidth={1.75} />
            </div>
            <div>
              <strong className="text-[14px] font-semibold text-fg block">Contrato simples em PDF</strong>
              <span className="text-xs text-fg-2">Gerado na hora com contato liberado</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. O PROBLEMA (ESTILO CARDS NUMERADOS VARRIDA) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-2xl mb-12">
          <Eyebrow>O problema</Eyebrow>
          <h2 className="mt-3 text-[32px] sm:text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-fg text-balance">
            Pedir orçamentos hoje ainda parece a década de 90.
          </h2>
          <p className="mt-3 text-[17px] text-fg-2 leading-relaxed">
            O cliente perde dias caçando contatos e o fornecedor perde horas digitando propostas que nunca fecham.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.n}
              className="group relative rounded-[20px] border border-line bg-surface p-7 transition-all duration-200 hover:border-fg-2 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-sm font-bold text-accent-text">{p.n}</span>
                <span className="text-xs uppercase tracking-wider text-fg-2 font-medium">Gargalo</span>
              </div>
              <h3 className="text-[20px] font-semibold text-fg leading-snug">{p.t}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fg-2">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMO FUNCIONA (PASSO A PASSO TRANSPARENTE) */}
      {/* ========================================================================= */}
      <section className="border-t border-line bg-surface/70 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl mb-14">
            <Eyebrow>Mecânica do leilão</Eyebrow>
            <h2 className="mt-3 text-[32px] sm:text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-fg text-balance">
              Três etapas. O menor valor nasce da disputa.
            </h2>
            <p className="mt-3 text-[17px] text-fg-2 leading-relaxed">
              Sem tabela de preços estática. O valor final reflete a disponibilidade real da agenda de cada fornecedor.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t-2 border-line pt-6">
                <span className="font-mono text-sm font-bold text-accent-text block mb-3">PASSO {s.n}</span>
                <h3 className="text-[22px] font-semibold text-fg leading-snug">{s.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HISTÓRICO DE ARREMATES RECENTES (SCROLL HISTORY) */}
      {/* ========================================================================= */}
      <AuctionScrollHistory />

      {/* ========================================================================= */}
      {/* 5. CATEGORIAS DE ENTRADA (GRID INTERATIVO) */}
      {/* ========================================================================= */}
      <section id="categorias" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Eyebrow>Categorias ativas</Eyebrow>
            <h2 className="mt-2 text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] text-fg">
              O que você pode arrematar hoje
            </h2>
          </div>
          <Link
            href="/painel-cliente/novo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:underline"
          >
            Publicar outra categoria <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/painel-cliente/novo?cat=${cat.id}`}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface transition-all duration-300 hover:border-fg hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Banner com Foto Editorial */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.t}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  
                  {/* Badge sobre a foto */}
                  <div className="absolute bottom-3 left-3 flex items-center">
                    <div className="flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-fg backdrop-blur-md shadow-sm">
                      <Icon size={14} className="text-accent-text" />
                      <span>{cat.t}</span>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <p className="text-xs text-fg-2 leading-relaxed">
                      {cat.ex}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-fg-2 font-medium block">
                        Faixa típica
                      </span>
                      <span className="font-mono text-[13.5px] font-bold text-fg">
                        {cat.faixa}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-text group-hover:underline">
                      Arrematar <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQ (PERGUNTAS FREQUENTES COM MICROCOPY DIRETO) */}
      {/* ========================================================================= */}
      <section className="border-t border-line bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Eyebrow>Tire suas dúvidas</Eyebrow>
            <h2 className="mt-2 text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] text-fg">
              Perguntas frequentes
            </h2>
            <p className="mt-2 text-sm text-fg-2">
              Tudo sobre o funcionamento, regras de cancelamento e segurança.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="rounded-[16px] border border-line bg-surface p-6 transition-colors hover:border-line-strong"
              >
                <h3 className="text-[17px] font-semibold text-fg">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CTA FINAL (PAINEL ESCURO INK COM AÇÃO ÂMBAR) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="relative rounded-[28px] bg-ink p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-[34px] sm:text-[46px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FAFAF9]">
              Sua próxima contratação começa aqui.
            </h2>
            <p className="text-[17px] text-slate-300 leading-relaxed max-w-xl mx-auto">
              Diga o que você precisa e quanto pode pagar. O mercado compete para te atender pelo melhor valor.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/painel-cliente/novo" className="btn-amber h-13 px-8 text-base">
                Publicar necessidade
                <span className="arr" aria-hidden="true">→</span>
              </Link>
              <Link
                href="/fornecedores"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[12px] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition-colors"
              >
                Sou fornecedor
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              Leva menos de 5 minutos. Sem cartão de crédito.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
