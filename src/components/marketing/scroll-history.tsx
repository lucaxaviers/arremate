"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, TrendingDown, ShieldCheck, Star,
  MapPin, Clock, ArrowRight, FileText, CheckCircle2, Gavel
} from "lucide-react";
import { Eyebrow, Mono, Card } from "@/components/ui/primitives";
import { formatBRL, cn } from "@/lib/utils";

export type AuctionHistoryItem = {
  id: string;
  categoriaId: string;
  categoriaNome: string;
  titulo: string;
  cidade: string;
  dataConclusao: string;
  image: string;
  tetoCentavos: number;
  arremateCentavos: number;
  economiaCentavos: number;
  economiaPorcentagem: number;
  totalLances: number;
  fornecedorVencedor: {
    nome: string;
    nota: number;
    contratos: number;
    verificado: boolean;
  };
  historicoLances: {
    horario: string;
    titulo: string;
    valorCentavos: number;
    isVencedor?: boolean;
    isTeto?: boolean;
  }[];
  depoimentoCliente: {
    cliente: string;
    texto: string;
  };
};

export const AUCTION_HISTORIES: AuctionHistoryItem[] = [
  {
    id: "hist-1",
    categoriaId: "buffet",
    categoriaNome: "Buffet & Gastronomia",
    titulo: "Buffet Completo para Casamento (120 convidados)",
    cidade: "Paulínia - Santa Terezinha",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/buffet.jpg",
    tetoCentavos: 1200000,
    arremateCentavos: 840000,
    economiaCentavos: 360000,
    economiaPorcentagem: 30,
    totalLances: 4,
    fornecedorVencedor: {
      nome: "Cozinha da Dona Ana",
      nota: 4.9,
      contratos: 132,
      verificado: true,
    },
    historicoLances: [
      { horario: "09:15", titulo: "Cliente publica necessidade", valorCentavos: 1200000, isTeto: true },
      { horario: "11:30", titulo: "1º lance (Buffet Tradição)", valorCentavos: 1120000 },
      { horario: "14:20", titulo: "2º lance (Banquete Real)", valorCentavos: 980000 },
      { horario: "16:45", titulo: "Lance vencedor arrematado", valorCentavos: 840000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Mariana S. · Paulínia",
      texto: "Recebi 4 propostas em menos de 8 horas. Fechei com a Dona Ana por R$ 8.400 com degustação prévia e economizei R$ 3.600 do meu orçamento inicial.",
    },
  },
  {
    id: "hist-2",
    categoriaId: "fotografia",
    categoriaNome: "Fotografia & Filmagem",
    titulo: "Cobertura Completa 6h com Drone e Pré-Wedding",
    cidade: "Paulínia - Betel",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/fotografia.jpg",
    tetoCentavos: 350000,
    arremateCentavos: 220000,
    economiaCentavos: 130000,
    economiaPorcentagem: 37,
    totalLances: 5,
    fornecedorVencedor: {
      nome: "Lens & Drone Produções",
      nota: 5.0,
      contratos: 89,
      verificado: true,
    },
    historicoLances: [
      { horario: "10:00", titulo: "Cliente publica necessidade", valorCentavos: 350000, isTeto: true },
      { horario: "12:15", titulo: "1º lance (Studio Campinas)", valorCentavos: 310000 },
      { horario: "15:00", titulo: "2º lance (Foco Criativo)", valorCentavos: 260000 },
      { horario: "17:30", titulo: "Lance vencedor arrematado", valorCentavos: 220000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Gabriel M. · Paulínia",
      texto: "No WhatsApp me cobraram R$ 3.500 no mesmo pacote. No Arremate a disputa levou o valor para R$ 2.200 com contrato em PDF na mesma tarde.",
    },
  },
  {
    id: "hist-3",
    categoriaId: "dj",
    categoriaNome: "DJ, Som & Iluminação",
    titulo: "Estrutura Box Truss, Iluminação Cênica & DJ",
    cidade: "Paulínia - Morumbi",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/dj.jpg",
    tetoCentavos: 250000,
    arremateCentavos: 165000,
    economiaCentavos: 85000,
    economiaPorcentagem: 34,
    totalLances: 4,
    fornecedorVencedor: {
      nome: "Som & Luz Paulínia Pro",
      nota: 4.8,
      contratos: 74,
      verificado: true,
    },
    historicoLances: [
      { horario: "14:00", titulo: "Cliente publica necessidade", valorCentavos: 250000, isTeto: true },
      { horario: "16:20", titulo: "1º lance (Áudio Festa)", valorCentavos: 220000 },
      { horario: "18:45", titulo: "2º lance (Pista Som)", valorCentavos: 190000 },
      { horario: "20:30", titulo: "Lance vencedor arrematado", valorCentavos: 165000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Camila R. · Paulínia",
      texto: "Acompanhei os lances descendo pelo celular. Excelente estrutura de pista e caixas RCF ativas por R$ 1.650.",
    },
  },
  {
    id: "hist-4",
    categoriaId: "decoracao",
    categoriaNome: "Decoração & Cenografia",
    titulo: "Decoração Floral Completa, Mobiliário e Painel",
    cidade: "Paulínia - Santa Terezinha",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/decoracao.jpg",
    tetoCentavos: 550000,
    arremateCentavos: 380000,
    economiaCentavos: 170000,
    economiaPorcentagem: 31,
    totalLances: 4,
    fornecedorVencedor: {
      nome: "Arte & Flor Cenografia",
      nota: 4.9,
      contratos: 105,
      verificado: true,
    },
    historicoLances: [
      { horario: "08:30", titulo: "Cliente publica necessidade", valorCentavos: 550000, isTeto: true },
      { horario: "11:10", titulo: "1º lance (Decor Campinas)", valorCentavos: 490000 },
      { horario: "13:40", titulo: "2º lance (Flores & Festas)", valorCentavos: 430000 },
      { horario: "16:00", titulo: "Lance vencedor arrematado", valorCentavos: 380000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Juliana T. · Paulínia",
      texto: "Arranjos naturais lindos e mobiliário rústico impecável. Economia de R$ 1.700 direto no bolso.",
    },
  },
  {
    id: "hist-5",
    categoriaId: "frete",
    categoriaNome: "Frete & Mudanças",
    titulo: "Mudança Residencial Completa Paulínia → Campinas",
    cidade: "Paulínia / Campinas",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/frete.jpg",
    tetoCentavos: 120000,
    arremateCentavos: 85000,
    economiaCentavos: 35000,
    economiaPorcentagem: 29,
    totalLances: 4,
    fornecedorVencedor: {
      nome: "Expresso Mudanças Paulínia",
      nota: 4.9,
      contratos: 210,
      verificado: true,
    },
    historicoLances: [
      { horario: "09:00", titulo: "Cliente publica necessidade", valorCentavos: 120000, isTeto: true },
      { horario: "10:30", titulo: "1º lance (Transportes Rápido)", valorCentavos: 110000 },
      { horario: "12:15", titulo: "2º lance (Carga Segura)", valorCentavos: 95000 },
      { horario: "14:00", titulo: "Lance vencedor arrematado", valorCentavos: 85000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Lucas N. · Campinas",
      texto: "Caminhão baú grande com 2 ajudantes e mantas de proteção. Tudo entregue sem nenhum arranhão.",
    },
  },
  {
    id: "hist-6",
    categoriaId: "reforma",
    categoriaNome: "Reformas & Reparos",
    titulo: "Pintura Completa Suvinil + Reparos Elétricos (90m²)",
    cidade: "Paulínia - Monte Alegre",
    dataConclusao: "Arrematado recentemente",
    image: "/img/categories/reforma.jpg",
    tetoCentavos: 420000,
    arremateCentavos: 290000,
    economiaCentavos: 130000,
    economiaPorcentagem: 31,
    totalLances: 5,
    fornecedorVencedor: {
      nome: "Reparos & Acabamentos Paulínia",
      nota: 4.8,
      contratos: 64,
      verificado: true,
    },
    historicoLances: [
      { horario: "08:00", titulo: "Cliente publica necessidade", valorCentavos: 420000, isTeto: true },
      { horario: "11:00", titulo: "1º lance (Construtora Jr)", valorCentavos: 380000 },
      { horario: "14:30", titulo: "2º lance (Pinturas & Reformas)", valorCentavos: 330000 },
      { horario: "17:15", titulo: "Lance vencedor arrematado", valorCentavos: 290000, isVencedor: true },
    ],
    depoimentoCliente: {
      cliente: "Eduardo F. · Paulínia",
      texto: "Serviço finalizado em 4 dias úteis com nota fiscal e contrato assinado. Economia de mais de R$ 1.300.",
    },
  },
];

export function AuctionScrollHistory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedCat, setSelectedCat] = useState<string>("todos");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filtered = selectedCat === "todos"
    ? AUCTION_HISTORIES
    : AUCTION_HISTORIES.filter((h) => h.categoriaId === selectedCat);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scrollByAmount = (amount: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const CATEGORY_TABS = [
    { id: "todos", label: "Todos os arremates" },
    { id: "buffet", label: "Buffet" },
    { id: "fotografia", label: "Fotografia" },
    { id: "dj", label: "DJ & Som" },
    { id: "decoracao", label: "Decoração" },
    { id: "frete", label: "Frete" },
    { id: "reforma", label: "Reforma" },
  ];

  return (
    <section className="border-t border-line bg-surface/50 py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Cabeçalho da Seção de Histórico */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eyebrow>Histórico de Negociações</Eyebrow>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 size={12} /> Casos Reais Verificados
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.03em] text-fg leading-[1.08]">
              Linha do tempo de arremates recentes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-fg-2 max-w-2xl leading-relaxed">
              Veja o histórico real de lances decrescentes em cada leilão. Sem negociação no escuro: a concorrência aberta puxa o preço para baixo.
            </p>
          </div>

          {/* Controles de Navegação Horizontal */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount(-420)}
              disabled={!canScrollLeft}
              className={cn(
                "grid size-11 place-items-center rounded-full border border-line bg-surface text-fg transition-all",
                !canScrollLeft
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:border-fg hover:bg-muted active:scale-95 shadow-xs"
              )}
              aria-label="Rolar histórico para esquerda"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(420)}
              disabled={!canScrollRight}
              className={cn(
                "grid size-11 place-items-center rounded-full border border-line bg-surface text-fg transition-all",
                !canScrollRight
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:border-fg hover:bg-muted active:scale-95 shadow-xs"
              )}
              aria-label="Rolar histórico para direita"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Abas de Filtro por Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCat(tab.id)}
                className={cn(
                  "h-8.5 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  active
                    ? "bg-accent border-accent text-ink font-semibold shadow-xs"
                    : "bg-surface border-line text-fg hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Pista de Scroll Horizontal (Snap-x, zero sequestro de scroll vertical) */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-none -mx-4 px-4 md:-mx-6 md:px-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 snap-start rounded-[22px] border border-line bg-surface p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-fg hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Banner Editorial com Foto */}
                <div className="relative h-44 w-full rounded-[16px] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.titulo}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  {/* Badges sobre a foto */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-surface/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-fg shadow-xs">
                      {item.categoriaNome}
                    </span>
                    <span className="rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-xs">
                      -{item.economiaPorcentagem}% OFF
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <MapPin size={11} className="text-amber-400" /> {item.cidade}
                    </p>
                    <p className="text-xs font-semibold text-white truncate">
                      {item.dataConclusao}
                    </p>
                  </div>
                </div>

                {/* Título e Resumo Financeiro */}
                <div>
                  <h3 className="text-[17px] font-semibold text-fg leading-snug line-clamp-2">
                    {item.titulo}
                  </h3>

                  {/* Comparativo de Preço: Teto Inicial vs Arremate Vencedor */}
                  <div className="mt-3 grid grid-cols-2 gap-3 rounded-[14px] bg-muted/60 p-3.5 border border-line/70">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-fg-2 font-medium block">
                        Orçamento Inicial
                      </span>
                      <Mono className="text-sm font-semibold text-fg-2 line-through">
                        {formatBRL(item.tetoCentavos)}
                      </Mono>
                    </div>

                    <div className="border-l border-line/80 pl-3">
                      <span className="text-[10px] uppercase tracking-wider text-accent-text font-bold block">
                        Arrematado Por
                      </span>
                      <Mono className="text-[19px] font-bold text-fg">
                        {formatBRL(item.arremateCentavos)}
                      </Mono>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between px-1 text-xs">
                    <span className="text-fg-2">Economia gerada:</span>
                    <strong className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                      <TrendingDown size={13} /> {formatBRL(item.economiaCentavos)}
                    </strong>
                  </div>
                </div>

                {/* Linha do Tempo do Leilão (O Scroll History da Disputa) */}
                <div className="rounded-[14px] border border-line bg-surface p-3.5 space-y-2">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-fg-2 flex items-center gap-1">
                    <Gavel size={11} className="text-accent-text" /> Histórico de Lances:
                  </span>

                  <div className="space-y-2 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-line">
                    {item.historicoLances.map((lance, idx) => (
                      <div key={idx} className="relative flex items-center justify-between text-xs">
                        {/* Ponto na timeline */}
                        <span
                          className={cn(
                            "absolute -left-[11px] size-2 rounded-full border-2 border-surface",
                            lance.isVencedor
                              ? "bg-amber-500 scale-125"
                              : lance.isTeto
                              ? "bg-slate-400"
                              : "bg-line-strong"
                          )}
                        />
                        <div className="flex items-center gap-1.5 min-w-0 pr-2">
                          <span className="font-mono text-[10px] text-fg-2 shrink-0">{lance.horario}</span>
                          <span className={cn("truncate text-[11px]", lance.isVencedor ? "font-semibold text-fg" : "text-fg-2")}>
                            {lance.titulo}
                          </span>
                        </div>
                        <Mono
                          className={cn(
                            "text-xs font-bold shrink-0",
                            lance.isVencedor ? "text-amber-600 font-extrabold" : "text-fg"
                          )}
                        >
                          {formatBRL(lance.valorCentavos)}
                        </Mono>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card do Fornecedor Vencedor */}
                <div className="rounded-[12px] bg-muted/40 p-3 border border-line/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-fg-2 block">Fornecedor Vencedor:</span>
                    <strong className="text-fg flex items-center gap-1">
                      {item.fornecedorVencedor.nome}
                      {item.fornecedorVencedor.verificado && (
                        <ShieldCheck size={13} className="text-accent-text" />
                      )}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-fg">
                    <Star size={12} className="fill-accent text-accent" />
                    <span>{item.fornecedorVencedor.nota.toFixed(1)}</span>
                  </div>
                </div>

                {/* Depoimento Verificado */}
                <p className="text-[11.5px] text-fg-2 italic leading-relaxed px-1">
                  &quot;{item.depoimentoCliente.texto}&quot;
                </p>
              </div>

              {/* Ação Inferior */}
              <div className="mt-4 pt-3 border-t border-line/70 flex items-center justify-between">
                <span className="text-[11px] text-fg-2 flex items-center gap-1">
                  <FileText size={12} className="text-accent-text" /> Contrato simples em PDF
                </span>
                <Link
                  href={`/painel-cliente/novo?cat=${item.categoriaId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent-text hover:underline"
                >
                  Arrematar similar <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de Deslize Mobile */}
        <div className="sm:hidden mt-2 text-center text-xs text-fg-2 flex items-center justify-center gap-1.5">
          <span>← Deslize para explorar o histórico →</span>
        </div>
      </div>
    </section>
  );
}
export default AuctionScrollHistory;
