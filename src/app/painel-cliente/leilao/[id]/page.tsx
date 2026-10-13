"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, Star, ArrowLeft, Filter, Check,
  Sparkles, MapPin, Calendar, Clock
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, Badge, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { Modal } from "@/components/ui/modal";
import { Confetti } from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/lib/store";
import { scoreBids } from "@/lib/domain/rules";
import { formatBRL, formatDate, cn } from "@/lib/utils";

type SortOption = "recomendados" | "menor_preco" | "maior_avaliacao" | "menor_prazo" | "mais_contratos" | "mais_recentes";

export default function CompararLancesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const store = useAppStore();
  const { success } = useToast();

  const req = store.getRequest(id);
  const allBids = store.getBids(id);

  // Estados de Filtros
  const [maxPreco, setMaxPreco] = useState<number>(req?.tetoCentavos ? req.tetoCentavos / 100 : 20000);
  const [minNota, setMinNota] = useState<number>(0);
  const [maxPrazo, setMaxPrazo] = useState<number>(0);
  const [apenasVerificados, setApenasVerificados] = useState(false);
  const [apenasPortfolio, setApenasPortfolio] = useState(false);
  const [apenasGarantia, setApenasGarantia] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Ordenação
  const [sortOption, setSortOption] = useState<SortOption>("recomendados");

  // Estado de Arremate
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [arrematando, setArrematando] = useState(false);

  // Contagem de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (req && maxPreco < req.tetoCentavos / 100) count++;
    if (minNota > 0) count++;
    if (maxPrazo > 0) count++;
    if (apenasVerificados) count++;
    if (apenasPortfolio) count++;
    if (apenasGarantia) count++;
    return count;
  }, [req, maxPreco, minNota, maxPrazo, apenasVerificados, apenasPortfolio, apenasGarantia]);

  function clearFilters() {
    if (req) setMaxPreco(req.tetoCentavos / 100);
    setMinNota(0);
    setMaxPrazo(0);
    setApenasVerificados(false);
    setApenasPortfolio(false);
    setApenasGarantia(false);
  }

  // Filtragem e Ordenação
  const filteredBids = useMemo(() => {
    return allBids.filter((bid) => {
      if (bid.valorCentavos > maxPreco * 100) return false;
      if (minNota > 0 && bid.providerNota < minNota) return false;
      if (maxPrazo > 0 && bid.prazoDias > maxPrazo) return false;
      if (apenasVerificados && !bid.verificado) return false;
      if (apenasPortfolio && !bid.temPortfolio) return false;
      if (apenasGarantia && !bid.temGarantia) return false;
      return true;
    });
  }, [allBids, maxPreco, minNota, maxPrazo, apenasVerificados, apenasPortfolio, apenasGarantia]);

  // Scores para Recomendados (RN10)
  const sortedBids = useMemo(() => {
    if (!req) return filteredBids;

    if (sortOption === "recomendados") {
      const scorable = filteredBids.map((b) => ({
        id: b.id,
        valorCentavos: b.valorCentavos,
        prazoDias: b.prazoDias,
        nota: b.providerNota,
        totalAvaliacoes: b.providerContratos,
        taxaResposta: 0.95,
        taxaCumprimento: 0.98,
        itens: b.inclui.length,
        temPortfolio: b.temPortfolio,
      }));
      const scores = scoreBids(scorable, req.tetoCentavos);
      return [...filteredBids].sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0));
    }

    if (sortOption === "menor_preco") {
      return [...filteredBids].sort((a, b) => a.valorCentavos - b.valorCentavos);
    }
    if (sortOption === "maior_avaliacao") {
      return [...filteredBids].sort((a, b) => b.providerNota - a.providerNota);
    }
    if (sortOption === "menor_prazo") {
      return [...filteredBids].sort((a, b) => a.prazoDias - b.prazoDias);
    }
    if (sortOption === "mais_contratos") {
      return [...filteredBids].sort((a, b) => b.providerContratos - a.providerContratos);
    }
    if (sortOption === "mais_recentes") {
      return [...filteredBids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filteredBids;
  }, [filteredBids, sortOption, req]);

  // Identificação do menor lance e melhor lance
  const menorLanceValor = useMemo(() => {
    if (!allBids.length) return null;
    return Math.min(...allBids.map((b) => b.valorCentavos));
  }, [allBids]);

  const bestBidId = sortedBids.length > 0 ? sortedBids[0].id : null;

  if (!req) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Leilão não encontrado</h1>
        <ButtonLink href="/painel-cliente" variant="secondary" className="mt-4">
          Voltar aos leilões
        </ButtonLink>
      </div>
    );
  }

  const selectedBid = allBids.find((b) => b.id === selectedBidId);

  function handleConfirmArremate() {
    if (!selectedBidId) return;
    setArrematando(true);
    setTimeout(() => {
      const res = store.acceptBid(selectedBidId);
      setArrematando(false);
      setConfirmModalOpen(false);
      if (res.ok && res.contractId) {
        setShowConfetti(true);
        success("Arremate confirmado. Contrato gerado.");
        setTimeout(() => {
          router.push(`/painel-cliente/contrato/${res.contractId}`);
        }, 1200);
      }
    }, 400);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      {showConfetti && <Confetti />}

      {/* Breadcrumb e Topo */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link href="/painel-cliente" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-1">
            <ArrowLeft size={14} /> Voltar para todos os leilões
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[26px] font-semibold text-fg md:text-[32px]">{req.titulo}</h1>
            {req.status === "aberto" ? (
              <Badge tone="accent">Recebendo lances</Badge>
            ) : req.status === "contratado" ? (
              <Badge tone="success">Arrematado</Badge>
            ) : (
              <Badge tone="neutral">Encerrado</Badge>
            )}
          </div>
          <p className="text-xs text-fg-2 flex items-center gap-3 pt-0.5">
            <span className="flex items-center gap-1"><MapPin size={13} /> {req.cidade}</span>
            <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(req.dataEvento)}</span>
          </p>
        </div>

        {req.status === "aberto" && (
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-medium text-fg-2">Encerra em</span>
            <AuctionTimer fechaEm={req.fechaEm} />
          </div>
        )}
      </div>

      {/* Card de Resumo (só o cliente vê o orçamento máximo) */}
      <Card className="mb-8 p-5 md:p-6 bg-surface grid gap-6 sm:grid-cols-3 border-line">
        <div>
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Orçamento máximo</p>
          <Mono className="text-[26px] font-semibold text-fg mt-1 block">
            {formatBRL(req.tetoCentavos)}
          </Mono>
          <p className="text-xs text-fg-2 mt-0.5">Definido por você</p>
        </div>

        <div>
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Menor valor atual</p>
          <Mono className="text-[26px] font-semibold text-accent-text mt-1 block">
            {menorLanceValor ? formatBRL(menorLanceValor) : "—"}
          </Mono>
          <p className="text-xs text-fg-2 mt-0.5">
            {menorLanceValor
              ? `Economia de ${formatBRL(Math.max(0, req.tetoCentavos - menorLanceValor))}`
              : "Aguardando lances"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Lances recebidos</p>
          <div className="flex items-baseline gap-2 mt-1">
            <Mono className="text-[26px] font-semibold text-fg">{allBids.length}</Mono>
            <span className="text-xs text-fg-2">fornecedores na disputa</span>
          </div>
          <p className="text-xs text-fg-2 mt-0.5">Atualizado em tempo real</p>
        </div>
      </Card>

      {/* Barra Sticky de Filtros e Ordenação */}
      <div className="sticky top-16 z-30 mb-6 rounded-[12px] border border-line bg-surface/95 p-3.5 backdrop-blur-md shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Esquerda: Filtros rápidos desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase text-fg-2 tracking-wider mr-1">Filtros:</span>

            {/* Chips de Avaliação */}
            {([0, 4, 4.5] as const).map((nota) => (
              <button
                key={nota}
                type="button"
                onClick={() => setMinNota(minNota === nota ? 0 : nota)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-medium border transition-colors",
                  minNota === nota
                    ? "border-accent bg-accent text-ink font-semibold"
                    : "border-line bg-surface text-fg hover:bg-muted"
                )}
              >
                {nota === 0 ? "Todas notas" : `${nota}+ estrelas`}
              </button>
            ))}

            {/* Chips de Prazo */}
            {([0, 3, 7] as const).map((dias) => (
              <button
                key={dias}
                type="button"
                onClick={() => setMaxPrazo(maxPrazo === dias ? 0 : dias)}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-medium border transition-colors",
                  maxPrazo === dias
                    ? "border-accent bg-accent text-ink font-semibold"
                    : "border-line bg-surface text-fg hover:bg-muted"
                )}
              >
                {dias === 0 ? "Todos prazos" : `Até ${dias} dias`}
              </button>
            ))}

            {/* Toggle Verificado */}
            <button
              type="button"
              onClick={() => setApenasVerificados(!apenasVerificados)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium border transition-colors flex items-center gap-1",
                apenasVerificados
                  ? "border-accent bg-accent text-ink font-semibold"
                  : "border-line bg-surface text-fg hover:bg-muted"
              )}
            >
              <BadgeCheck size={14} /> Verificado
            </button>

            {/* Toggle Portfólio */}
            <button
              type="button"
              onClick={() => setApenasPortfolio(!apenasPortfolio)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium border transition-colors",
                apenasPortfolio
                  ? "border-accent bg-accent text-ink font-semibold"
                  : "border-line bg-surface text-fg hover:bg-muted"
              )}
            >
              Com portfólio
            </button>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-accent-text hover:underline ml-2 font-medium"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {/* Botão Mobile para Bottom Sheet */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 py-1.5 text-xs font-medium"
          >
            <Filter size={14} />
            <span>Filtros {activeFiltersCount > 0 ? `· ${activeFiltersCount}` : ""}</span>
          </button>

          {/* Direita: Ordenação e Contagem */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-fg-2">
              <strong className="text-fg">{sortedBids.length}</strong> {sortedBids.length === 1 ? "lance encontrado" : "lances encontrados"}
            </span>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="sr-only">Ordenar lances</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="h-9 rounded-[8px] border border-line bg-surface px-2.5 text-xs font-medium text-fg hover:border-fg focus-visible:outline-none"
              >
                <option value="recomendados">Ordenar: Recomendados (Score)</option>
                <option value="menor_preco">Ordenar: Menor preço</option>
                <option value="maior_avaliacao">Ordenar: Maior avaliação</option>
                <option value="menor_prazo">Ordenar: Menor prazo</option>
                <option value="mais_contratos">Ordenar: Mais contratos</option>
                <option value="mais_recentes">Ordenar: Mais recentes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista / Grade de Lances */}
      {sortedBids.length === 0 ? (
        <EmptyState
          kind={allBids.length === 0 ? "no_bids" : "no_results"}
          onAction={allBids.length > 0 ? clearFilters : undefined}
          actionLabel={allBids.length > 0 ? "Limpar filtros" : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedBids.map((bid) => {
            const isBest = bid.id === bestBidId;
            const isAcimaTeto = bid.valorCentavos > req.tetoCentavos;

            return (
              <div
                key={bid.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-[16px] border bg-surface p-5 transition-all duration-200",
                  isBest ? "border-2 border-accent shadow-md" : "border-line hover:border-fg-2",
                  bid.status === "recusado" && "opacity-50"
                )}
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-fg text-[17px] truncate">{bid.providerNome}</h3>
                        {bid.verificado && (
                          <BadgeCheck size={16} strokeWidth={1.5} className="text-accent-text shrink-0" aria-label="Fornecedor verificado" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-fg-2">
                        <span className="flex items-center gap-0.5 text-fg font-medium">
                          <Star size={13} className="text-accent-text fill-accent" />
                          {bid.providerNota.toLocaleString("pt-BR")}
                        </span>
                        <span>·</span>
                        <span>{bid.providerContratos} contratos</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isBest && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-ink uppercase tracking-wider">
                          Melhor lance
                        </span>
                      )}
                      {bid.isNovo && !isBest && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-fg-2">
                          Novo lance
                        </span>
                      )}
                      {bid.emRevisao && (
                        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">
                          Em revisão
                        </span>
                      )}
                      {isAcimaTeto && (
                        <span className="rounded-full bg-error/10 px-2 py-0.5 text-[11px] font-medium text-error-text">
                          Acima do orçamento
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Valor do Lance em JetBrains Mono 32px */}
                  <div className="my-5 border-y border-line/60 py-3">
                    <p className="text-xs text-fg-2 uppercase tracking-wider">Valor do lance</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <Mono className="text-[30px] font-bold tracking-tight text-fg">
                        {formatBRL(bid.valorCentavos)}
                      </Mono>
                    </div>
                    <p className="text-xs text-fg-2 mt-1 flex items-center gap-1">
                      <Clock size={13} />
                      Pronto em <strong>{bid.prazoDias} dias</strong>
                    </p>
                  </div>

                  {/* Mensagem e Itens Inclusos */}
                  <div className="space-y-3 text-xs">
                    <p className="text-fg leading-relaxed italic">&quot;{bid.mensagem}&quot;</p>

                    <div>
                      <span className="font-semibold text-fg block mb-1">O que está incluso:</span>
                      <ul className="space-y-1 text-fg-2">
                        {bid.inclui.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check size={13} className="text-success-text shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 flex items-center gap-2 border-t border-line/60 pt-4">
                  <ButtonLink
                    href={`/painel-cliente/fornecedor/${bid.providerId}`}
                    variant="ghost"
                    className="h-11 flex-1 text-xs"
                  >
                    Ver perfil
                  </ButtonLink>

                  {/* REGRA SAGRADA DO DOC MESTRE:
                      "Um primário âmbar por região de decisão. No card do melhor lance, âmbar; nos demais, botão escuro (ink)." */}
                  <Button
                    variant={isBest ? "primary" : "dark"}
                    className="h-11 flex-1 text-sm font-semibold"
                    onClick={() => {
                      setSelectedBidId(bid.id);
                      setConfirmModalOpen(true);
                    }}
                  >
                    Arrematar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Arremate (Regra RN12 / RN13) */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirmar arremate"
      >
        {selectedBid && (
          <div className="space-y-5">
            <p className="text-sm text-fg-2">
              Ao confirmar o arremate, o contrato simples é gerado imediatamente em PDF e o contato direto de ambas as partes é liberado.
            </p>

            <Card className="p-4 bg-muted/40 border-line space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-2">Fornecedor:</span>
                <strong className="text-fg">{selectedBid.providerNome}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-2">Valor arrematado:</span>
                <Mono className="text-base font-bold text-fg">{formatBRL(selectedBid.valorCentavos)}</Mono>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-2">Prazo de entrega:</span>
                <strong className="text-fg">{selectedBid.prazoDias} dias</strong>
              </div>
            </Card>

            <div className="rounded-[10px] bg-accent/10 p-3 text-xs text-accent-text flex items-start gap-2">
              <Sparkles size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong>Garantia de cancelamento gratuito:</strong> você pode cancelar o arremate em até 24 horas sem custo algum (RN13).
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmModalOpen(false)}
                disabled={arrematando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1 font-semibold"
                onClick={handleConfirmArremate}
                loading={arrematando}
              >
                Confirmar arremate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bottom Sheet Mobile para Filtros */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filtros de lances"
      >
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase text-fg-2 block mb-2">Avaliação mínima</label>
            <div className="grid grid-cols-3 gap-2">
              {([0, 3, 4, 4.5, 5] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinNota(n)}
                  className={cn(
                    "h-10 rounded-[8px] border text-xs font-medium",
                    minNota === n ? "border-accent bg-accent text-ink font-semibold" : "border-line"
                  )}
                >
                  {n === 0 ? "Todas" : `${n}+ estrelas`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-fg-2 block mb-2">Prazo máximo</label>
            <div className="grid grid-cols-3 gap-2">
              {([0, 1, 3, 7, 15] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMaxPrazo(p)}
                  className={cn(
                    "h-10 rounded-[8px] border text-xs font-medium",
                    maxPrazo === p ? "border-accent bg-accent text-ink font-semibold" : "border-line"
                  )}
                >
                  {p === 0 ? "Todos" : `Até ${p} dias`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-line">
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Apenas fornecedores verificados</span>
              <input
                type="checkbox"
                checked={apenasVerificados}
                onChange={(e) => setApenasVerificados(e.target.checked)}
                className="size-4 accent-accent rounded"
              />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Com portfólio anexado</span>
              <input
                type="checkbox"
                checked={apenasPortfolio}
                onChange={(e) => setApenasPortfolio(e.target.checked)}
                className="size-4 accent-accent rounded"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={clearFilters} className="flex-1 text-xs">
              Limpar tudo
            </Button>
            <Button variant="primary" onClick={() => setMobileFilterOpen(false)} className="flex-1">
              Ver {sortedBids.length} lances
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
