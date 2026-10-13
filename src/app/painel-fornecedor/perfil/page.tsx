"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ShieldCheck, Star, MapPin, CheckCircle2,
  Save, ExternalLink, Lock, User, MessageSquare, Tag
} from "lucide-react";
import { Eyebrow, Mono, Card, Badge } from "@/components/ui/primitives";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { maskPhone, maskPixKey } from "@/lib/masks";
import { formatDate } from "@/lib/utils";

export default function PerfilFornecedorPage() {
  const store = useAppStore();
  const { success: toastSuccess } = useToast();
  const provider = store.getProvider("p1") || store.getProviders()[0];
  const reviews = provider ? store.getReviews(provider.id, "cliente_avalia_fornecedor") : [];

  const [nomeFantasia, setNomeFantasia] = useState(provider?.nomeFantasia || "Cozinha da Dona Ana");
  const [responsavel, setResponsavel] = useState(provider?.responsavel || "Ana Maria Souza");
  const [avatarUrl, setAvatarUrl] = useState(provider?.avatarUrl || "/img/categories/buffet.jpg");
  const [endereco, setEndereco] = useState(provider?.endereco || "Rua Santa Cruz, 340 - Santa Terezinha, Paulínia - SP");
  const [cidade] = useState(provider?.cidade || "Paulínia");
  const [telefone, setTelefone] = useState(maskPhone(provider?.telefone || "(19) 99876-5432"));
  const [chavePix, setChavePix] = useState(maskPixKey(provider?.chavePix || "contato@cozinhadonaana.com.br"));
  const [bio, setBio] = useState(provider?.bio || "Buffet artesanal para eventos corporativos e casamentos em Paulínia e região.");
  const [salvo, setSalvo] = useState(false);

  const AVATAR_PRESETS = [
    { label: "Buffet", url: "/img/categories/buffet.jpg" },
    { label: "Fotografia", url: "/img/categories/fotografia.jpg" },
    { label: "DJ & Som", url: "/img/categories/dj.jpg" },
    { label: "Decoração", url: "/img/categories/decoracao.jpg" },
    { label: "Frete", url: "/img/categories/frete.jpg" },
    { label: "Reforma", url: "/img/categories/reforma.jpg" },
  ];

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider) {
      store.updateProvider(provider.id, {
        nomeFantasia,
        responsavel,
        avatarUrl,
        endereco,
        cidade,
        telefone,
        chavePix,
        bio,
      });
    }
    setSalvo(true);
    toastSuccess("Perfil atualizado com sucesso no marketplace!");
    setTimeout(() => setSalvo(false), 4000);
  };

  if (!provider) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/painel-fornecedor" className="hover:text-fg">Painel do fornecedor</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Meu perfil comercial</span>
      </div>

      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eyebrow>Identidade & Vitrine</Eyebrow>
            <Badge variant="success">Verificado com Selfie</Badge>
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
            Personalizar perfil da empresa
          </h1>
          <p className="mt-1.5 text-base text-fg-2">
            Configure as informações que os clientes visualizam ao receber seus lances nas disputas.
          </p>
        </div>

        <Link
          href={`/painel-cliente/fornecedor/${provider.id}`}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] border border-line text-xs font-semibold text-fg hover:border-fg transition-colors"
        >
          Visualizar como cliente <ExternalLink size={13} />
        </Link>
      </header>

      {/* Alerta de Regra de Negócio (RN) */}
      <div className="mb-6 flex items-start gap-3 rounded-[16px] border border-line bg-muted/60 p-4 text-xs text-fg-2">
        <div className="grid size-6 place-items-center rounded-full bg-accent/20 text-accent-text shrink-0 mt-0.5">
          <Lock size={13} />
        </div>
        <div className="space-y-0.5 leading-relaxed">
          <strong className="text-fg font-semibold block">Regra de Privacidade do Marketplace:</strong>
          <span>
            Os clientes que criam leilões só conseguem visualizar seu perfil e reputação <strong>depois que você submete um lance para a demanda deles</strong>. Seu telefone e WhatsApp só são liberados após o arremate vencedor (RN12).
          </span>
        </div>
      </div>

      {salvo && (
        <div className="mb-6 flex items-center gap-2 rounded-[14px] bg-success/15 border border-success/30 p-4 text-xs font-semibold text-success-text">
          <CheckCircle2 size={16} />
          Informações salvas com sucesso! O cliente verá estes dados atualizados ao receber seu lance.
        </div>
      )}

      {/* Cartão de Apresentação em Tempo Real */}
      <Card className="p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative size-22 rounded-2xl overflow-hidden border border-line bg-muted shrink-0 shadow-xs">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={nomeFantasia}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full grid place-items-center text-xl font-bold text-fg">
                {nomeFantasia.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-1 right-1 rounded-full bg-success size-3 border-2 border-surface" />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-[24px] font-semibold text-fg">{nomeFantasia}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent-text">
                <ShieldCheck size={14} /> Verificado
              </span>
              <span className="text-xs uppercase tracking-wider text-fg-2 font-medium">
                {provider.tipo.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-fg-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-accent-text" />
                {endereco || `${cidade} · Raio de ${provider.raioKm} km`}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User size={12} />
                Responsável: {responsavel}
              </span>
            </p>

            <p className="text-xs text-fg-2 line-clamp-2 pt-1">{bio}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {provider.categorias.map((c) => (
                <span key={c} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-fg">
                  {c.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Oficiais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-line">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-fg-2 font-medium block">
              Nota Média
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <Star size={16} className="text-accent fill-accent" />
              <Mono className="text-xl font-bold text-fg">{provider.nota}</Mono>
              <span className="text-xs text-fg-2">/ 5.0</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-fg-2 font-medium block">
              Avaliações
            </span>
            <Mono className="mt-1 text-xl font-bold text-fg">{provider.totalAvaliacoes}</Mono>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-fg-2 font-medium block">
              Contratos Fechados
            </span>
            <Mono className="mt-1 text-xl font-bold text-fg">{provider.totalContratos}</Mono>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-fg-2 font-medium block">
              Taxa de Resposta
            </span>
            <Mono className="mt-1 text-xl font-bold text-success-text">
              {Math.round(provider.taxaResposta * 100)}%
            </Mono>
          </div>
        </div>
      </Card>

      {/* Formulário de Edição */}
      <Card className="p-6 md:p-8 mb-8">
        <h3 className="text-[18px] font-semibold text-fg mb-1">
          Editar Informações da Vitrine
        </h3>
        <p className="text-xs text-fg-2 mb-6">
          Preencha seus dados com precisão para transmitir autoridade e confiança aos clientes.
        </p>

        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Seletor de Foto / Avatar */}
          <div className="space-y-3 rounded-[16px] border border-line bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block">
              Foto / Logotipo da Empresa
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="URL da imagem (ex: /img/categories/buffet.jpg ou https://...)"
                className="h-11 flex-1 rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
              />
            </div>
            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-fg-2 block">Escolha uma foto de exemplo ou cole o link da sua foto:</span>
              <div className="flex flex-wrap gap-2">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setAvatarUrl(p.url)}
                    className={`h-7 px-2.5 rounded-full text-xs font-medium border transition-colors ${
                      avatarUrl === p.url ? "border-accent bg-accent text-ink font-semibold" : "border-line bg-muted text-fg hover:bg-line"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
                Nome Fantasia do Negócio
              </label>
              <input
                type="text"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
                Responsável / Profissional Titular
              </label>
              <input
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
              Endereço Comercial Completo
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, Número, Bairro, Cidade - UF"
              className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
            />
            <p className="text-[11px] text-fg-2 mt-1">
              O cliente visualiza sua cidade e bairro ao comparar lances; o endereço completo é emitido no contrato pós-arremate.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
              Bio / Apresentação e Diferenciais
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-[12px] border border-line bg-surface p-3 text-sm text-fg outline-none focus:border-ink"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block">
                  Telefone / WhatsApp Comercial
                </label>
                <span className="text-[10px] font-mono text-accent-text flex items-center gap-1">
                  <Lock size={10} /> Liberado após arremate
                </span>
              </div>
              <input
                type="text"
                value={telefone}
                placeholder="(19) 99876-5432"
                onChange={(e) => setTelefone(maskPhone(e.target.value))}
                className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
                Chave Pix (Para recebimentos)
              </label>
              <input
                type="text"
                value={chavePix}
                placeholder="CPF, CNPJ, telefone ou e-mail"
                onChange={(e) => setChavePix(maskPixKey(e.target.value))}
                className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-amber h-11 px-6 text-xs font-semibold">
              <Save size={15} className="mr-1.5" />
              Salvar dados do perfil
            </button>
          </div>
        </form>
      </Card>

      {/* Seção de Avaliações Recebidas de Clientes */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eyebrow>Reputação Bilateral · RN14</Eyebrow>
              <Badge variant="accent">Avaliações Verificadas</Badge>
            </div>
            <h3 className="text-[20px] font-semibold text-fg flex items-center gap-2">
              <MessageSquare size={19} className="text-accent-text" />
              Comentários e Avaliações de Clientes ({reviews.length})
            </h3>
            <p className="text-xs text-fg-2 mt-1">
              Avaliações reais emitidas pelos clientes após a conclusão de cada contrato no Arremate.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-[12px] border border-line self-start sm:self-auto">
            <Star size={18} className="fill-amber-400 text-amber-500" />
            <div>
              <span className="font-mono text-base font-bold text-fg block leading-none">
                {provider?.nota.toFixed(1) || "5.0"}
              </span>
              <span className="text-[10px] text-fg-2 uppercase font-medium">Nota Média</span>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-[12px] bg-muted/30 border border-line p-8 text-center text-xs text-fg-2">
            Nenhuma avaliação recebida ainda. Após arrematar e concluir serviços, seus clientes poderão avaliar aqui com notas e comentários.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-[14px] bg-muted/40 border border-line/70 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-fg text-sm">{rev.autorNome}</strong>
                    <span className="text-[11px] text-fg-2 block">{formatDate(rev.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-surface px-2.5 py-1 rounded-full border border-line shadow-2xs">
                    <Star size={13} className="fill-amber-400" />
                    <span>{rev.nota}.0</span>
                  </div>
                </div>

                <p className="text-fg-2 italic leading-relaxed bg-surface/60 p-3 rounded-[10px] border border-line/60">
                  &quot;{rev.comentario}&quot;
                </p>

                {rev.criterios && rev.criterios.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.criterios.map((crit) => (
                      <span
                        key={crit}
                        className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-[10.5px] font-medium text-fg-2 border border-line"
                      >
                        <Tag size={10} /> {crit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
