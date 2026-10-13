import { describe, expect, it } from "vitest";
import {
  HOUR, MIN, applyExtension, canPublishAnother, canReviseBid, canOpenRequest, checkCeiling,
  isAnomalous, isBidBurst, minReduction, scoreBids, shouldExpandRadius, providerPosition,
  allowedDurations, canBidThisMonth, customerCancelIsFree,
} from "./rules";

const now = new Date("2026-10-13T12:00:00-03:00");

describe("RN01/RN03 abertura", () => {
  const base = { categoryId: "buffet", cidade: "Paulínia", quantidade: 120, tetoCentavos: 1_500_000, duracaoH: 48 };
  it("aceita pedido válido", () => {
    expect(canOpenRequest({ ...base, dataEvento: new Date(now.getTime() + 30 * 24 * HOUR) }, now).ok).toBe(true);
  });
  it("rejeita data com menos de 24 h", () => {
    const r = canOpenRequest({ ...base, dataEvento: new Date(now.getTime() + 10 * HOUR) }, now);
    expect(r.ok || r.code).toBe("RN01_DATA");
  });
  it("rejeita duração que fecha a menos de 24 h do evento", () => {
    const r = canOpenRequest({ ...base, duracaoH: 72, dataEvento: new Date(now.getTime() + 80 * HOUR) }, now);
    expect(r.ok || r.code).toBe("RN03_LIMITE");
  });
  it("lista durações permitidas", () => {
    expect(allowedDurations(new Date(now.getTime() + 50 * HOUR), now)).toEqual([6, 24]);
  });
});

describe("RN02 limite de leilões ativos", () => {
  it("permite até 2 ativos publicar mais um", () => expect(canPublishAnother(2).ok).toBe(true));
  it("bloqueia com 3 ativos", () => expect(canPublishAnother(3).ok).toBe(false));
});

describe("RN04 teto", () => {
  it("rejeita acima do teto visível", () => expect(checkCeiling(1600, 1500, true).ok).toBe(false));
  it("aceita e marca acima do teto oculto", () => expect(checkCeiling(1600, 1500, false)).toEqual({ ok: true, acimaDoTeto: true }));
});

describe("RN06 redução mínima", () => {
  it("mínimo de R$ 10 em lances pequenos", () => expect(minReduction(50_000)).toBe(1000));
  it("1% em lances grandes", () => expect(minReduction(1_200_000)).toBe(12_000));
  it("não deixa subir", () => expect(canReviseBid(100_000, 110_000).ok).toBe(false));
  it("exige redução mínima", () => expect(canReviseBid(1_200_000, 1_195_000).ok).toBe(false));
  it("aceita redução válida", () => expect(canReviseBid(1_200_000, 1_188_000).ok).toBe(true));
});

describe("RN09 anti-sniping", () => {
  const fecha = new Date(now.getTime() + 3 * MIN);
  it("estende 5 min nos últimos 5 min", () => {
    const r = applyExtension(fecha, 0, now);
    expect(r.estendeu).toBe(true);
    expect(r.fechaEm.getTime() - fecha.getTime()).toBe(5 * MIN);
  });
  it("no máximo 3 vezes", () => expect(applyExtension(fecha, 3, now).estendeu).toBe(false));
  it("não estende fora da janela", () => expect(applyExtension(new Date(now.getTime() + 10 * MIN), 0, now).estendeu).toBe(false));
});

describe("RN10 score Recomendados", () => {
  const mk = (id: string, valor: number, nota: number, prazo = 3) => ({
    id, valorCentavos: valor, prazoDias: prazo, nota, totalAvaliacoes: 100, taxaResposta: 0.9, taxaCumprimento: 0.95, itens: 4, temPortfolio: true,
  });
  it("lance mais barato com mesma reputação vence", () => {
    const s = scoreBids([mk("a", 1_180_000, 4.8), mk("b", 1_400_000, 4.8)], 1_500_000);
    expect(s.get("a")!).toBeGreaterThan(s.get("b")!);
  });
  it("reputação pesa: pequena diferença de preço com nota muito menor perde", () => {
    const s = scoreBids([mk("a", 1_200_000, 2.5), mk("b", 1_230_000, 4.9)], 1_500_000);
    expect(s.get("b")!).toBeGreaterThan(s.get("a")!);
  });
});

describe("RN11 lance anômalo", () => {
  it("abaixo de 50% do teto", () => expect(isAnomalous(700_000, 1_500_000)).toBe(true));
  it("abaixo de 70% da mediana com base suficiente", () => expect(isAnomalous(900_000, 1_500_000, { centavos: 1_400_000, contratos: 12 })).toBe(true));
  it("ignora mediana com menos de 10 contratos", () => expect(isAnomalous(900_000, 1_500_000, { centavos: 1_400_000, contratos: 5 })).toBe(false));
  it("rajada de mais de 10 lances em 1 h", () => {
    expect(isBidBurst(Array.from({ length: 11 }, (_, i) => new Date(now.getTime() - i * MIN)), now)).toBe(true);
  });
});

describe("RN16 ampliar raio", () => {
  const abre = new Date(now.getTime() - 25 * HOUR), fecha = new Date(now.getTime() + 23 * HOUR);
  it("amplia sem lances na metade do prazo", () => expect(shouldExpandRadius(abre, fecha, now, 0, false)).toBe(true));
  it("não amplia com lances", () => expect(shouldExpandRadius(abre, fecha, now, 1, false)).toBe(false));
  it("não amplia duas vezes", () => expect(shouldExpandRadius(abre, fecha, now, 0, true)).toBe(false));
});

describe("outras regras", () => {
  it("RN08 posição", () => expect(providerPosition(1_240_000, [1_310_000, 1_180_000, 1_240_000])).toEqual({ posicao: 2, total: 3 }));
  it("RN17 plano gratuito", () => expect(canBidThisMonth(3, false).ok).toBe(false));
  it("RN13 cancelamento grátis em 24 h", () => expect(customerCancelIsFree(new Date(now.getTime() - 23 * HOUR), now)).toBe(true));
});
