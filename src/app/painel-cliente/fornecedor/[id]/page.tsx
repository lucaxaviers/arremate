"use client";

import { use } from "react";
import Link from "next/link";
import { BadgeCheck, Star, MapPin, ArrowLeft, Lock, Tag, MessageSquare } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Badge, Mono } from "@/components/ui/primitives";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function PerfilFornecedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = useAppStore();
  const provider = store.getProvider(id);
  const reviews = provider ? store.getReviews(provider.id, "cliente_avalia_fornecedor") : [];

  if (!provider) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Fornecedor não encontrado</h1>
        <ButtonLink href="/painel-cliente" variant="secondary" className="mt-4">
          Voltar
        </ButtonLink>
      </div>
    );
  }

  // Regra: o criador do leilão só pode ver o perfil do fornecedor depois que o cara deu o lance
  const allRequests = store.getRequests();
  const hasPlacedBid = allRequests.some((r) => {
    const bids = store.getBids(r.id);
    return bids.some((b) => b.providerId === id);
  });

  if (!hasPlacedBid) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-muted text-fg-2 mb-4">
          <Lock size={28} />
        </div>
        <Badge variant="accent" className="mb-2">Perfil Restrito pela RN</Badge>
        <h1 className="text-2xl font-bold text-fg">Perfil indisponível no momento</h1>
        <p className="mt-2 text-sm text-fg-2 leading-relaxed">
          Pelas regras de concorrência e privacidade do Arremate, você só tem acesso à vitrine e dados deste fornecedor <strong>após ele submeter um lance formal para o seu leilão</strong>.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/painel-cliente" variant="primary">
            Voltar aos meus leilões
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/painel-cliente" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-6">
        <ArrowLeft size={14} /> Voltar para leilões
      </Link>

      <Card className="p-6 md:p-8 bg-surface border-line space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative size-18 rounded-2xl overflow-hidden border border-line bg-muted shrink-0 shadow-xs">
              {provider.avatarUrl ? (
                <img
                  src={provider.avatarUrl}
                  alt={provider.nomeFantasia}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full grid place-items-center text-xl font-bold text-fg">
                  {provider.nomeFantasia.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-[26px] font-semibold text-fg">{provider.nomeFantasia}</h1>
                {provider.verificado && (
                  <BadgeCheck size={20} className="text-accent-text shrink-0" aria-label="Fornecedor verificado" />
                )}
              </div>
              <p className="text-sm text-fg-2 flex items-center gap-2">
                <MapPin size={14} className="text-accent-text" />
                {provider.endereco || `${provider.cidade} · Atende em raio de ${provider.raioKm} km`}
              </p>
            </div>
          </div>

          <Badge variant="success">Fornecedor Verificado</Badge>
        </div>

        <p className="text-sm text-fg-2 leading-relaxed">{provider.bio}</p>

        {/* 4 Métricas de Reputação */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-line py-5">
          <div>
            <span className="text-xs text-fg-2 uppercase">Nota média</span>
            <div className="flex items-center gap-1 mt-1">
              <Mono className="text-[24px] font-bold text-fg">{provider.nota.toFixed(1)}</Mono>
              <Star size={16} className="text-accent fill-accent" />
            </div>
          </div>
          <div>
            <span className="text-xs text-fg-2 uppercase">Contratos concluídos</span>
            <Mono className="text-[24px] font-bold text-fg mt-1 block">{provider.totalContratos}</Mono>
          </div>
          <div>
            <span className="text-xs text-fg-2 uppercase">Taxa de resposta</span>
            <Mono className="text-[24px] font-bold text-fg mt-1 block">{(provider.taxaResposta * 100).toFixed(0)}%</Mono>
          </div>
          <div>
            <span className="text-xs text-fg-2 uppercase">Tipo cadastral</span>
            <span className="text-sm font-semibold uppercase text-fg mt-2 block">{provider.tipo}</span>
          </div>
        </div>

        {/* Aviso de Contato Seguro RN12 */}
        <div className="rounded-[14px] bg-muted/60 border border-line p-4 flex items-center gap-3 text-xs text-fg-2">
          <div className="grid size-7 place-items-center rounded-full bg-accent/20 text-accent-text shrink-0">
            <Lock size={14} />
          </div>
          <p>
            <strong className="text-fg font-semibold">Contato direto:</strong> O telefone, WhatsApp e dados bancários deste fornecedor são liberados para você imediatamente após a confirmação do arremate (RN12).
          </p>
        </div>

        {/* Avaliações Recentes Dinâmicas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg flex items-center gap-2">
              <MessageSquare size={17} className="text-accent-text" />
              Avaliações verificadas de clientes ({reviews.length})
            </h2>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-fg">
              <Star size={13} className="fill-amber-400 text-amber-500" />
              <span>{provider.nota.toFixed(1)}</span>
              <span className="text-fg-2 font-normal">/ 5.0</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="p-6 rounded-[12px] bg-muted/30 border border-line text-center text-xs text-fg-2">
              Nenhuma avaliação registrada ainda para este fornecedor.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((av) => (
                <div key={av.id} className="p-4 rounded-[12px] bg-muted/40 border border-line text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-fg">{av.autorNome}</strong>
                      <span className="text-[11px] text-fg-2 block">{formatDate(av.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold bg-surface px-2 py-0.5 rounded-full border border-line">
                      <Star size={12} className="fill-amber-400" /> {av.nota}.0
                    </div>
                  </div>
                  <p className="text-fg-2 italic">&quot;{av.comentario}&quot;</p>
                  {av.criterios && av.criterios.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {av.criterios.map((crit) => (
                        <span
                          key={crit}
                          className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[10px] text-fg-2 border border-line"
                        >
                          <Tag size={9} /> {crit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
