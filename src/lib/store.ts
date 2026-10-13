"use client";

import { useEffect, useState } from "react";
import {
  INITIAL_REQUESTS, INITIAL_BIDS, INITIAL_PROVIDERS, INITIAL_CATEGORIES,
  INITIAL_CONTRACTS, INITIAL_REVIEWS,
  type AuctionRequest, type Bid, type Provider, type Contract, type Category, type Review
} from "./mock-data";
import { canPublishAnother, canReviseBid, checkCeiling, isAnomalous, applyExtension } from "./domain/rules";

const STORAGE_KEYS = {
  REQUESTS: "arremate_requests_v1",
  BIDS: "arremate_bids_v1",
  PROVIDERS: "arremate_providers_v1",
  CONTRACTS: "arremate_contracts_v1",
  REVIEWS: "arremate_reviews_v1",
  USER: "arremate_user_v1",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event("arremate_storage_change"));
  } catch {}
}

export const appStore = {
  getCategories(): Category[] {
    return INITIAL_CATEGORIES;
  },

  getRequests(): AuctionRequest[] {
    return safeGet(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  getRequest(id: string): AuctionRequest | undefined {
    return this.getRequests().find((r) => r.id === id);
  },

  createRequest(data: Omit<AuctionRequest, "id" | "abreEm" | "fechaEm" | "extensoes" | "status">): { ok: boolean; id?: string; error?: string } {
    const requests = this.getRequests();
    const activeCount = requests.filter((r) => r.customerId === data.customerId && r.status === "aberto").length;
    const rule = canPublishAnother(activeCount);
    if (!rule.ok) return { ok: false, error: rule.message };

    const now = new Date();
    const fechaEm = new Date(now.getTime() + data.duracaoH * 3600000);
    const newReq: AuctionRequest = {
      ...data,
      id: "req-" + Date.now(),
      status: "aberto",
      abreEm: now.toISOString(),
      fechaEm: fechaEm.toISOString(),
      extensoes: 0,
    };
    safeSet(STORAGE_KEYS.REQUESTS, [newReq, ...requests]);
    return { ok: true, id: newReq.id };
  },

  getBids(requestId: string): Bid[] {
    const all = safeGet(STORAGE_KEYS.BIDS, INITIAL_BIDS);
    return all.filter((b) => b.requestId === requestId && b.status !== "retirado");
  },

  getProviders(): Provider[] {
    return safeGet(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  },

  getProvider(id: string): Provider | undefined {
    return this.getProviders().find((p) => p.id === id);
  },

  updateProvider(id: string, data: Partial<Provider>): boolean {
    const providers = this.getProviders();
    const updated = providers.map((p) => (p.id === id ? { ...p, ...data } : p));
    safeSet(STORAGE_KEYS.PROVIDERS, updated);
    return true;
  },

  placeBid(data: {
    requestId: string;
    providerId: string;
    valorCentavos: number;
    prazoDias: number;
    inclui: string[];
    mensagem: string;
    validadeDias?: number;
    temPortfolio?: boolean;
    temGarantia?: boolean;
  }): { ok: boolean; error?: string; emRevisao?: boolean } {
    const req = this.getRequest(data.requestId);
    if (!req || req.status !== "aberto") return { ok: false, error: "Este leilão não está aberto." };

    const ceiling = checkCeiling(data.valorCentavos, req.tetoCentavos, req.tetoVisivel);
    if (!ceiling.ok) return { ok: false, error: ceiling.message };

    const provider = this.getProvider(data.providerId) || INITIAL_PROVIDERS[0];
    const bids = safeGet(STORAGE_KEYS.BIDS, INITIAL_BIDS);
    const existing = bids.find((b) => b.requestId === data.requestId && b.providerId === data.providerId);

    if (existing) {
      const rev = canReviseBid(existing.valorCentavos, data.valorCentavos);
      if (!rev.ok) return { ok: false, error: rev.message };
    }

    const emRevisao = isAnomalous(data.valorCentavos, req.tetoCentavos);

    const newBid: Bid = {
      id: existing ? existing.id : "bid-" + Date.now(),
      requestId: data.requestId,
      providerId: provider.id,
      providerNome: provider.nomeFantasia,
      providerNota: provider.nota,
      providerContratos: provider.totalContratos,
      verificado: provider.verificado,
      valorCentavos: data.valorCentavos,
      prazoDias: data.prazoDias,
      inclui: data.inclui,
      mensagem: data.mensagem,
      validadeDias: data.validadeDias || 30,
      emRevisao,
      temPortfolio: data.temPortfolio ?? true,
      temGarantia: data.temGarantia ?? false,
      isNovo: true,
      createdAt: new Date().toISOString(),
      status: "ativo",
    };

    const updatedBids = existing
      ? bids.map((b) => (b.id === existing.id ? newBid : b))
      : [newBid, ...bids];
    safeSet(STORAGE_KEYS.BIDS, updatedBids);

    // RN09 anti-sniping check
    const ext = applyExtension(new Date(req.fechaEm), req.extensoes, new Date());
    if (ext.estendeu) {
      const allReqs = this.getRequests().map((r) =>
        r.id === req.id ? { ...r, fechaEm: ext.fechaEm.toISOString(), extensoes: ext.extensoes } : r
      );
      safeSet(STORAGE_KEYS.REQUESTS, allReqs);
    }

    return { ok: true, emRevisao };
  },

  acceptBid(bidId: string): { ok: boolean; contractId?: string; error?: string } {
    const bids = safeGet(STORAGE_KEYS.BIDS, INITIAL_BIDS);
    const bid = bids.find((b) => b.id === bidId);
    if (!bid) return { ok: false, error: "Lance não encontrado." };

    const req = this.getRequest(bid.requestId);
    if (!req) return { ok: false, error: "Pedido não encontrado." };

    const provider = this.getProvider(bid.providerId) || INITIAL_PROVIDERS[0];
    const contractId = "ctr-" + Date.now();

    const newContract: Contract = {
      id: contractId,
      requestId: req.id,
      bidId: bid.id,
      customerId: req.customerId || "c1",
      customerNome: req.customerNome,
      customerTelefone: "(19) 99876-5432",
      providerId: provider.id,
      providerNome: provider.nomeFantasia,
      providerTelefone: "(19) 98765-4321",
      providerDocumento: provider.documento,
      titulo: req.titulo,
      cidade: req.cidade,
      dataEvento: req.dataEvento,
      valorCentavos: bid.valorCentavos,
      prazoDias: bid.prazoDias,
      inclui: bid.inclui,
      aceitoEm: new Date().toISOString(),
      status: "ativo",
    };

    const contracts = safeGet<Contract[]>(STORAGE_KEYS.CONTRACTS, INITIAL_CONTRACTS);
    safeSet(STORAGE_KEYS.CONTRACTS, [newContract, ...contracts]);

    // Atualiza status do pedido e dos lances
    const updatedReqs = this.getRequests().map((r) =>
      r.id === req.id
        ? {
            ...r,
            status: "contratado" as const,
            contratoId: contractId,
            vencedorId: bid.providerId,
            customerTelefone: "(19) 99876-5432",
            customerEmail: "mariana.silva@exemplo.com",
            customerEndereco: "Av. José Paulino, 1420 - Santa Terezinha, Paulínia - SP",
          }
        : r
    );
    safeSet(STORAGE_KEYS.REQUESTS, updatedReqs);

    const updatedBids = bids.map((b) => {
      if (b.id === bid.id) return { ...b, status: "aceito" as const };
      if (b.requestId === req.id) return { ...b, status: "recusado" as const };
      return b;
    });
    safeSet(STORAGE_KEYS.BIDS, updatedBids);

    return { ok: true, contractId };
  },

  getContracts(): Contract[] {
    return safeGet<Contract[]>(STORAGE_KEYS.CONTRACTS, INITIAL_CONTRACTS);
  },

  getContract(id: string): Contract | undefined {
    return this.getContracts().find((c) => c.id === id);
  },

  getReviews(alvoId?: string, tipo?: Review["tipo"]): Review[] {
    const all = safeGet<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return all.filter((r) => {
      if (alvoId && r.alvoId !== alvoId) return false;
      if (tipo && r.tipo !== tipo) return false;
      return true;
    });
  },

  getContractReviews(contractId: string): Review[] {
    const all = safeGet<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return all.filter((r) => r.contractId === contractId);
  },

  hasReviewed(contractId: string, autorId: string): boolean {
    const all = safeGet<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return all.some((r) => r.contractId === contractId && r.autorId === autorId);
  },

  createReview(data: Omit<Review, "id" | "createdAt">): { ok: boolean; review?: Review; error?: string } {
    if (!data.comentario.trim()) {
      return { ok: false, error: "Escreva um breve comentário sobre a experiência." };
    }
    if (data.nota < 1 || data.nota > 5) {
      return { ok: false, error: "A nota deve ser de 1 a 5 estrelas." };
    }

    const reviews = safeGet<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);

    // Evita duplicidade de avaliação do mesmo autor no mesmo contrato
    const existing = reviews.find((r) => r.contractId === data.contractId && r.autorId === data.autorId);
    if (existing) {
      return { ok: false, error: "Você já avaliou este serviço anteriormente." };
    }

    const newRev: Review = {
      ...data,
      id: "rev-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newRev, ...reviews];
    safeSet(STORAGE_KEYS.REVIEWS, updated);

    // Se o cliente avaliou o fornecedor, recalcula a nota média e total de avaliações do fornecedor
    if (data.tipo === "cliente_avalia_fornecedor") {
      const providerReviews = updated.filter((r) => r.alvoId === data.alvoId && r.tipo === "cliente_avalia_fornecedor");
      if (providerReviews.length > 0) {
        const sum = providerReviews.reduce((acc, cur) => acc + cur.nota, 0);
        const avg = Number((sum / providerReviews.length).toFixed(1));
        this.updateProvider(data.alvoId, { nota: avg, totalAvaliacoes: providerReviews.length });
      }
    }

    return { ok: true, review: newRev };
  },
};

export function useAppStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("arremate_storage_change", handler);
    return () => window.removeEventListener("arremate_storage_change", handler);
  }, []);

  return appStore;
}
