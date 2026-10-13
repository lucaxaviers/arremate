/**
 * Regras de negócio puras do Arremate (Documento Mestre v2.1, seção 7).
 * Usadas pelas rotas de servidor e espelhadas nas funções Postgres
 * (supabase/migrations/0003_functions.sql). Nunca confiar só no front.
 */

export const HOUR = 3_600_000;
export const MIN = 60_000;

// ---------- RN01 / RN03: abertura e duração ----------
export const DURATIONS_H = [6, 24, 48, 72, 168] as const;
export type DurationH = (typeof DURATIONS_H)[number];
export const DEFAULT_DURATION_H: DurationH = 48;

export type RuleResult = { ok: true } | { ok: false; code: string; message: string };
const fail = (code: string, message: string): RuleResult => ({ ok: false, code, message });
const OK: RuleResult = { ok: true };

export function canOpenRequest(
  input: { categoryId?: string; dataEvento: Date; cidade?: string; quantidade?: number; descricao?: string; tetoCentavos?: number; duracaoH: number },
  now: Date,
): RuleResult {
  if (!input.categoryId) return fail("RN01_CATEGORIA", "Escolha uma categoria.");
  if (!input.cidade?.trim()) return fail("RN01_CIDADE", "Informe a cidade do serviço.");
  if (!input.quantidade && !input.descricao?.trim()) return fail("RN01_ESCOPO", "Descreva o escopo ou a quantidade.");
  if (!input.tetoCentavos || input.tetoCentavos <= 0) return fail("RN01_TETO", "Informe o orçamento máximo.");
  if (input.dataEvento.getTime() - now.getTime() < 24 * HOUR) return fail("RN01_DATA", "A data precisa ser pelo menos 24 h à frente.");
  if (!DURATIONS_H.includes(input.duracaoH as DurationH)) return fail("RN03_DURACAO", "Duração inválida.");
  const fechaEm = now.getTime() + input.duracaoH * HOUR;
  if (input.dataEvento.getTime() - fechaEm < 24 * HOUR)
    return fail("RN03_LIMITE", "O leilão precisa fechar pelo menos 24 h antes do evento. Escolha uma duração menor.");
  return OK;
}

/** Durações permitidas para uma data de evento (RN03). */
export function allowedDurations(dataEvento: Date, now: Date): DurationH[] {
  return DURATIONS_H.filter((h) => dataEvento.getTime() - (now.getTime() + h * HOUR) >= 24 * HOUR);
}

// ---------- RN02: limite de leilões ativos ----------
export const MAX_ACTIVE_AUCTIONS = 3;
export function canPublishAnother(activeCount: number): RuleResult {
  return activeCount >= MAX_ACTIVE_AUCTIONS
    ? fail("RN02_LIMITE", `Você já tem ${MAX_ACTIVE_AUCTIONS} leilões ativos. Arremate ou encerre um para publicar outro.`)
    : OK;
}

// ---------- RN04: teto visível ----------
export function checkCeiling(valorCentavos: number, tetoCentavos: number, tetoVisivel: boolean): RuleResult & { acimaDoTeto?: boolean } {
  if (valorCentavos <= tetoCentavos) return { ok: true, acimaDoTeto: false };
  if (tetoVisivel) return fail("RN04_ACIMA_TETO", "O valor está acima do orçamento máximo do cliente.");
  return { ok: true, acimaDoTeto: true };
}

// ---------- RN06: redução mínima ----------
export function minReduction(valorAtualCentavos: number): number {
  return Math.max(1000, Math.ceil(valorAtualCentavos * 0.01));
}
export function canReviseBid(valorAtualCentavos: number, novoCentavos: number): RuleResult {
  if (novoCentavos >= valorAtualCentavos) return fail("RN06_SO_REDUZ", "O lance só pode ser reduzido.");
  const min = minReduction(valorAtualCentavos);
  if (valorAtualCentavos - novoCentavos < min)
    return fail("RN06_REDUCAO_MINIMA", `Reduza pelo menos R$ ${(min / 100).toFixed(2).replace(".", ",")}.`);
  return OK;
}

// ---------- RN09: anti-sniping ----------
export const EXTENSION_WINDOW_MS = 5 * MIN;
export const MAX_EXTENSIONS = 3;
export function applyExtension(fechaEm: Date, extensoes: number, bidAt: Date): { fechaEm: Date; extensoes: number; estendeu: boolean } {
  const restante = fechaEm.getTime() - bidAt.getTime();
  if (restante > 0 && restante <= EXTENSION_WINDOW_MS && extensoes < MAX_EXTENSIONS) {
    return { fechaEm: new Date(fechaEm.getTime() + EXTENSION_WINDOW_MS), extensoes: extensoes + 1, estendeu: true };
  }
  return { fechaEm, extensoes, estendeu: false };
}

// ---------- RN10: score Recomendados ----------
export type ScoreWeights = { preco: number; reputacao: number; prazo: number; confiabilidade: number; completude: number };
export const DEFAULT_WEIGHTS: ScoreWeights = { preco: 0.45, reputacao: 0.25, prazo: 0.15, confiabilidade: 0.1, completude: 0.05 };

export type ScorableBid = {
  id: string;
  valorCentavos: number;
  prazoDias: number;
  nota: number; // 0..5
  totalAvaliacoes: number;
  taxaResposta: number; // 0..1
  taxaCumprimento: number; // 0..1
  itens: number;
  temPortfolio: boolean;
};

export function scoreBids(bids: ScorableBid[], tetoCentavos: number, w: ScoreWeights = DEFAULT_WEIGHTS): Map<string, number> {
  const out = new Map<string, number>();
  if (!bids.length) return out;
  const prazos = bids.map((b) => b.prazoDias);
  const pMin = Math.min(...prazos), pMax = Math.max(...prazos);
  for (const b of bids) {
    const preco = clamp01(1 - b.valorCentavos / tetoCentavos + 0.5); // no teto = 0,5; 50% do teto = 1
    const reputacao = (b.nota / 5) * Math.min(1, Math.log10(1 + b.totalAvaliacoes) / 2);
    const prazo = pMax === pMin ? 1 : 1 - (b.prazoDias - pMin) / (pMax - pMin);
    const confiabilidade = (b.taxaResposta + b.taxaCumprimento) / 2;
    const completude = Math.min(1, b.itens / 5) * 0.7 + (b.temPortfolio ? 0.3 : 0);
    out.set(b.id, w.preco * preco + w.reputacao * reputacao + w.prazo * prazo + w.confiabilidade * confiabilidade + w.completude * completude);
  }
  return out;
}
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// ---------- RN11: lance anômalo ----------
export function isAnomalous(valorCentavos: number, tetoCentavos: number, medianaCategoria?: { centavos: number; contratos: number }): boolean {
  if (valorCentavos < tetoCentavos * 0.5) return true;
  if (medianaCategoria && medianaCategoria.contratos >= 10 && valorCentavos < medianaCategoria.centavos * 0.7) return true;
  return false;
}
/** Mais de 10 lances em menos de 1 h no mesmo leilão vai para auditoria. */
export function isBidBurst(bidTimes: Date[], now: Date): boolean {
  return bidTimes.filter((t) => now.getTime() - t.getTime() < HOUR).length > 10;
}

// ---------- RN08: posição do fornecedor ----------
export function providerPosition(myValor: number, allValores: number[]): { posicao: number; total: number } {
  const sorted = [...allValores].sort((a, b) => a - b);
  return { posicao: sorted.indexOf(myValor) + 1, total: sorted.length };
}

// ---------- RN13: cancelamento ----------
export function customerCancelIsFree(aceitoEm: Date, now: Date): boolean {
  return now.getTime() - aceitoEm.getTime() <= 24 * HOUR;
}

// ---------- RN16/RN17: sem lance na metade do prazo ----------
export function shouldExpandRadius(abreEm: Date, fechaEm: Date, now: Date, totalLances: number, jaAmpliou: boolean): boolean {
  if (totalLances > 0 || jaAmpliou) return false;
  const metade = abreEm.getTime() + (fechaEm.getTime() - abreEm.getTime()) / 2;
  return now.getTime() >= metade && now.getTime() < fechaEm.getTime();
}
export const expandedRadius = (raioKm: number) => Math.round(raioKm * 1.5);

// ---------- RN17/RN18 (doc): plano gratuito ----------
export const FREE_BIDS_PER_MONTH = 3;
export function canBidThisMonth(lancesNoMes: number, ilimitado: boolean): RuleResult {
  return !ilimitado && lancesNoMes >= FREE_BIDS_PER_MONTH
    ? fail("RN17_LIMITE_PLANO", "Você usou os 3 lances gratuitos deste mês.")
    : OK;
}

// ---------- RN15 (doc): suspensão por nota ----------
export function shouldSuspendProvider(mediasMensais: number[]): boolean {
  const ult = mediasMensais.slice(-3);
  return ult.length === 3 && ult.every((m) => m < 3.5);
}

// ---------- Distância (RN05) ----------
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
