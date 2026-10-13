"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ArrowLeft, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/lib/store";

const CRITERIA_OPTIONS = [
  "Pontualidade britânica",
  "Atendimento impecável",
  "Superou expectativas",
  "Ótimo custo-benefício",
  "Qualidade excepcional",
  "Contrato 100% cumprido",
];

export default function AvaliarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const store = useAppStore();
  const { success, error: toastError } = useToast();

  const contract = store.getContract(id);
  const myCustomerId = contract?.customerId || "c1";

  // Verifica se o cliente já enviou avaliação para este contrato
  const existingReviews = contract ? store.getContractReviews(contract.id) : [];
  const myReview = existingReviews.find(
    (r) => r.tipo === "cliente_avalia_fornecedor" && r.autorId === myCustomerId
  );
  const providerReview = existingReviews.find(
    (r) => r.tipo === "fornecedor_avalia_cliente"
  );

  const [nota, setNota] = useState<number>(5);
  const [hoverNota, setHoverNota] = useState<number>(0);
  const [comentario, setComentario] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Pontualidade britânica",
    "Atendimento impecável",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!contract) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-fg">Contrato não encontrado</h1>
        <p className="mt-2 text-sm text-fg-2">Verifique o link ou volte para a lista de pedidos.</p>
        <ButtonLink href="/painel-cliente" variant="primary" className="mt-6">
          Voltar ao painel
        </ButtonLink>
      </div>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comentario.trim() || comentario.length < 10) {
      setError("Escreva pelo menos uma frase curta (mínimo 10 caracteres) sobre a experiência.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.createReview({
        contractId: contract!.id,
        requestId: contract!.requestId,
        tipo: "cliente_avalia_fornecedor",
        autorId: myCustomerId,
        autorNome: contract!.customerNome,
        alvoId: contract!.providerId || "p1",
        alvoNome: contract!.providerNome,
        nota,
        comentario: comentario.trim(),
        criterios: selectedTags,
      });

      setLoading(false);

      if (res.ok) {
        success("Avaliação registrada com sucesso! A reputação do fornecedor foi atualizada.");
        router.push(`/painel-cliente/contrato/${contract!.id}`);
      } else {
        toastError(res.error || "Não foi possível registrar a avaliação.");
      }
    }, 400);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:px-8 md:py-16">
      <Link
        href={`/painel-cliente/contrato/${contract.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-6"
      >
        <ArrowLeft size={14} /> Voltar ao contrato
      </Link>

      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Eyebrow>Avaliação Bilateral · RN14</Eyebrow>
          <Badge variant="accent">Avaliação do Cliente</Badge>
        </div>

        <h1 className="mt-2 text-[26px] font-semibold text-fg">
          Como foi sua experiência com o fornecedor?
        </h1>
        <p className="mt-1 text-sm text-fg-2 leading-relaxed">
          Sua avaliação mantém o ecossistema do Arremate seguro, transparente e premia os melhores prestadores da região.
        </p>

        {/* Resumo do Contrato */}
        <div className="my-6 rounded-[12px] bg-muted/60 border border-line/70 p-4 text-sm space-y-1">
          <div className="flex items-center justify-between">
            <strong className="text-fg text-base">{contract.providerNome}</strong>
            <span className="text-xs text-accent-text font-semibold flex items-center gap-1">
              <ShieldCheck size={14} /> Contrato Seguro
            </span>
          </div>
          <p className="text-xs text-fg-2">
            {contract.titulo} em {contract.cidade}
          </p>
        </div>

        {myReview ? (
          /* Se já avaliou, exibe a avaliação registrada */
          <div className="space-y-6">
            <div className="rounded-[16px] border-2 border-emerald-500/40 bg-emerald-500/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <CheckCircle2 size={18} />
                <span>Você já avaliou este serviço com sucesso!</span>
              </div>
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={22}
                    className={s <= myReview.nota ? "fill-amber-400 text-amber-500" : "text-line"}
                  />
                ))}
                <span className="ml-2 font-mono font-bold text-fg text-base">{myReview.nota}.0</span>
              </div>
              <p className="text-sm text-fg italic bg-surface/80 p-3 rounded-[10px] border border-line">
                &quot;{myReview.comentario}&quot;
              </p>
              {myReview.criterios && myReview.criterios.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {myReview.criterios.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-fg-2 border border-line"
                    >
                      <Tag size={10} /> {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Avaliação recíproca feita pelo fornecedor, se houver */}
            {providerReview ? (
              <div className="rounded-[14px] border border-line bg-surface p-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-2 block">
                  Avaliação que o fornecedor fez sobre você:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= providerReview.nota ? "fill-amber-400 text-amber-500" : "text-line"}
                    />
                  ))}
                  <span className="ml-1.5 font-mono font-bold text-xs">{providerReview.nota}.0</span>
                </div>
                <p className="text-xs text-fg-2 italic">&quot;{providerReview.comentario}&quot;</p>
              </div>
            ) : (
              <div className="rounded-[12px] bg-muted/40 p-3 text-xs text-fg-2">
                Aguardando a avaliação recíproca do fornecedor (RN14 bilateral).
              </div>
            )}

            <ButtonLink href={`/painel-cliente/contrato/${contract.id}`} variant="primary" className="w-full">
              Voltar aos detalhes do contrato
            </ButtonLink>
          </div>
        ) : (
          /* Formulário de Avaliação */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seletor de Estrelas */}
            <div>
              <label className="block text-sm font-medium text-fg mb-2">
                Sua nota de 1 a 5 estrelas
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = (hoverNota || nota) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHoverNota(n)}
                      onMouseLeave={() => setHoverNota(0)}
                      onClick={() => setNota(n)}
                      className="p-1 text-accent focus-visible:outline-none transition-transform hover:scale-110"
                      aria-label={`${n} estrelas`}
                    >
                      <Star
                        size={34}
                        strokeWidth={1.5}
                        className={filled ? "fill-amber-400 text-amber-500" : "text-line"}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 font-mono font-semibold text-fg text-lg">{nota}.0</span>
              </div>
            </div>

            {/* Destaques / Tags Rápidas */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-2">
                Destaques da experiência (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {CRITERIA_OPTIONS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`h-7 px-3 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? "border-accent bg-accent/20 text-accent-text font-semibold"
                          : "border-line bg-surface text-fg-2 hover:bg-muted"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comentário Breve */}
            <Textarea
              label="Breve comentário sobre o serviço"
              placeholder="Conte sobre a pontualidade, qualidade da execução, atendimento da equipe e cumprimento do combinado..."
              value={comentario}
              onChange={(e) => {
                setComentario(e.target.value);
                setError("");
              }}
              error={error}
              rows={4}
              hint="Seu comentário ficará visível publicamente no perfil do fornecedor."
            />

            <div className="rounded-[12px] bg-muted/40 border border-line/60 p-3 text-xs text-fg-2 leading-relaxed">
              <strong>Regra de Avaliação Bilateral (RN14):</strong> Após você enviar sua avaliação, o prestador também registrará um parecer sobre a comunicação e facilidade de alinhamento com você.
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-sm font-semibold" loading={loading}>
              Publicar avaliação do fornecedor
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
