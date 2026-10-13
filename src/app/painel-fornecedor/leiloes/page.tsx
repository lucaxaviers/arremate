"use client";

import { useState, useMemo } from "react";
import { MapPin, Check, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/lib/store";
import { INITIAL_CATEGORIES } from "@/lib/mock-data";
import { formatBRL, formatDate, cn } from "@/lib/utils";

type ProviderSort = "recentes" | "encerrando" | "maior_valor" | "menos_concorridos";

export default function FeedLeiloesFornecedorPage() {
  const store = useAppStore();
  const allRequests = store.getRequests().filter((r) => r.status === "aberto");

  // Filtros
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [maxDistanciaKm, setMaxDistanciaKm] = useState<number>(50);
  const [apenasUrgente, setApenasUrgente] = useState(false);
  const [sortOption, setSortOption] = useState<ProviderSort>("recentes");

  const filtered = useMemo(() => {
    return allRequests.filter((r) => {
      if (selectedCats.length > 0 && !selectedCats.includes(r.categoryId)) return false;
      if (apenasUrgente) {
        const diffHours = (new Date(r.fechaEm).getTime() - Date.now()) / 3600000;
        if (diffHours > 24) return false;
      }
      return true;
    });
  }, [allRequests, selectedCats, apenasUrgente]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortOption === "encerrando") {
      return list.sort((a, b) => new Date(a.fechaEm).getTime() - new Date(b.fechaEm).getTime());
    }
    if (sortOption === "maior_valor") {
      return list.sort((a, b) => b.tetoCentavos - a.tetoCentavos);
    }
    if (sortOption === "menos_concorridos") {
      return list.sort((a, b) => store.getBids(a.id).length - store.getBids(b.id).length);
    }
    return list.sort((a, b) => new Date(b.abreEm).getTime() - new Date(a.abreEm).getTime());
  }, [filtered, sortOption, store]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 space-y-2">
        <Eyebrow>Oportunidades locais</Eyebrow>
        <h1 className="text-[32px] font-semibold text-fg">Leilões abertos para você</h1>
        <p className="text-sm text-fg-2">
          Clientes com data e escopo definidos buscando propostas de serviços na sua região.
        </p>
      </div>

      {/* Barra de Filtros */}
      <Card className="mb-8 p-5 bg-surface border-line space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase text-fg-2 tracking-wider block mb-2">Categorias</span>
          <div className="flex flex-wrap gap-2">
            {INITIAL_CATEGORIES.map((c) => {
              const sel = selectedCats.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCats((prev) =>
                      sel ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                    );
                  }}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-medium border transition-colors flex items-center gap-1",
                    sel ? "border-accent bg-accent text-ink font-semibold" : "border-line bg-surface text-fg hover:bg-muted"
                  )}
                >
                  {sel && <Check size={12} />}
                  <span>{c.nome}</span>
                </button>
              );
            })}
            {selectedCats.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCats([])}
                className="text-xs text-accent-text hover:underline px-2 self-center"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line/60">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={apenasUrgente}
                onChange={(e) => setApenasUrgente(e.target.checked)}
                className="size-4 rounded accent-accent"
              />
              <span className="font-medium text-fg">Encerra em até 24h</span>
            </label>

            <span className="text-xs text-fg-2">·</span>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-fg-2">Distância máxima:</span>
              <select
                value={maxDistanciaKm}
                onChange={(e) => setMaxDistanciaKm(Number(e.target.value))}
                className="h-8 rounded-[6px] border border-line bg-surface px-2 text-xs font-medium"
              >
                <option value={10}>Até 10 km</option>
                <option value={25}>Até 25 km</option>
                <option value={50}>Até 50 km</option>
                <option value={100}>Até 100 km</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-2">Ordenar:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as ProviderSort)}
              className="h-8 rounded-[6px] border border-line bg-surface px-2 text-xs font-medium"
            >
              <option value="recentes">Mais recentes</option>
              <option value="encerrando">Encerrando em breve</option>
              <option value="maior_valor">Maior valor do teto</option>
              <option value="menos_concorridos">Menos concorridos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Leilões */}
      {sorted.length === 0 ? (
        <EmptyState kind="provider_feed" />
      ) : (
        <div className="space-y-3">
          {sorted.map((req) => {
            const bids = store.getBids(req.id);
            return (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-4 rounded-[16px] border border-line bg-surface p-5 hover:border-fg transition-all sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-fg-2">
                      {req.categoriaNome}
                    </span>
                    <span className="text-xs text-accent-text font-medium flex items-center gap-1">
                      <MapPin size={12} /> {req.cidade} · aprox. 8 km
                    </span>
                  </div>

                  <h3 className="text-[18px] font-semibold text-fg">{req.titulo}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-fg-2 pt-0.5">
                    <span>Data: {formatDate(req.dataEvento)}</span>
                    <span>{bids.length} lances enviados</span>
                    {/* RN04: Orçamento máximo só aparece se tetoVisivel for true */}
                    {req.tetoVisivel ? (
                      <span>Teto máximo: <Mono className="font-semibold text-fg">{formatBRL(req.tetoCentavos)}</Mono></span>
                    ) : (
                      <span className="italic text-fg-2">Orçamento sob consulta</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-line/60 pt-3 sm:border-0 sm:pt-0">
                  <AuctionTimer fechaEm={req.fechaEm} />
                  <ButtonLink
                    href={`/painel-fornecedor/leilao/${req.id}`}
                    variant="primary"
                    className="h-11 px-6 text-sm"
                  >
                    Enviar lance
                    <ArrowRight size={16} />
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
