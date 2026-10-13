"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import {
  Gavel, ArrowLeft, ShieldCheck, MapPin, Calendar,
  Check, Plus, Trash2, Lock, Trophy, PhoneCall, FileText, Star
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, Badge, Mono } from "@/components/ui/primitives";
import { AuctionTimer } from "@/components/ui/timer";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/lib/store";
import { minReduction, providerPosition, canReviseBid } from "@/lib/domain/rules";
import { formatBRL, formatDate, parseBRL, cn } from "@/lib/utils";
import { maskBRL, maskPhone } from "@/lib/masks";

export default function EnviarLancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = useAppStore();
  const { success, error: toastError } = useToast();

  const req = store.getRequest(id);
  const allBids = store.getBids(id);

  // Fornecedor logado na simulação (Cozinha da Dona Ana)
  const myProviderId = "p1";
  const existingBid = allBids.find((b) => b.providerId === myProviderId);

  // Verifica se o leilão já foi encerrado/arrematado
  const isFinalizado = req?.status === "contratado" || req?.status === "encerrado";
  const euVenci = isFinalizado && (req?.vencedorId === myProviderId || existingBid?.status === "aceito");

  // Calcula posição do fornecedor sem vazar concorrentes (RN08)
  const posInfo = useMemo(() => {
    if (!existingBid) return null;
    const valores = allBids.map((b) => b.valorCentavos);
    return providerPosition(existingBid.valorCentavos, valores);
  }, [existingBid, allBids]);

  // Form states
  const [valorInput, setValorInput] = useState(
    existingBid ? (existingBid.valorCentavos / 100).toLocaleString("pt-BR") : "11.800"
  );
  const [prazoDias, setPrazoDias] = useState<number>(existingBid ? existingBid.prazoDias : 3);
  const [mensagem, setMensagem] = useState(
    existingBid ? existingBid.mensagem : "Atendemos casamentos em Paulínia há 8 anos com degustação prévia."
  );
  const [itens, setItens] = useState<string[]>(
    existingBid ? existingBid.inclui : ["Entradas e canapés", "Prato principal com massa e carne", "Sobremesa artesanal", "Equipe de garçons inclusa"]
  );
  const [novoItem, setNovoItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [posicaoFeedback, setPosicaoFeedback] = useState<"subiu" | "desceu" | null>(null);

  if (!req) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Leilão não encontrado</h1>
        <ButtonLink href="/painel-fornecedor/leiloes" variant="secondary" className="mt-4">
          Voltar aos leilões
        </ButtonLink>
      </div>
    );
  }

  function handleAddItem() {
    if (!novoItem.trim()) return;
    setItens([...itens, novoItem.trim()]);
    setNovoItem("");
  }

  function handleRemoveItem(idx: number) {
    setItens(itens.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!req) return;
    setErrors({});

    if (isFinalizado) {
      toastError("Este leilão já foi finalizado e não aceita mais propostas.");
      return;
    }

    const valorCentavos = parseBRL(valorInput);
    if (!valorCentavos || valorCentavos <= 0) {
      setErrors({ valor: "Informe o valor do lance." });
      return;
    }

    // RN06: Redução mínima se já tiver lance
    if (existingBid) {
      const rev = canReviseBid(existingBid.valorCentavos, valorCentavos);
      if (!rev.ok) {
        setErrors({ valor: rev.message });
        toastError(rev.message);
        return;
      }
    }

    if (itens.length === 0) {
      setErrors({ itens: "Informe pelo menos um item incluso no lance (RN07)." });
      return;
    }

    if (!mensagem.trim()) {
      setErrors({ mensagem: "Escreva uma mensagem de até 300 caracteres para o cliente." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.placeBid({
        requestId: req.id,
        providerId: myProviderId,
        valorCentavos,
        prazoDias,
        inclui: itens,
        mensagem,
      });

      setLoading(false);
      if (res.ok) {
        if (res.emRevisao) {
          toastError("Seu lance ficou abaixo de 50% do orçamento e entrou em revisão pela moderação (RN11).");
        } else {
          setPosicaoFeedback("subiu");
          success("Lance enviado com sucesso! Sua posição foi recalculada.");
          setTimeout(() => setPosicaoFeedback(null), 3000);
        }
      } else {
        toastError(res.error || "Não foi possível enviar o lance.");
      }
    }, 350);
  }

  const minRed = existingBid ? minReduction(existingBid.valorCentavos) : 1000;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/painel-fornecedor/leiloes" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-6">
        <ArrowLeft size={14} /> Voltar para lista de oportunidades
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Lado Esquerdo: Detalhes do Pedido */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-fg-2">
                {req.categoriaNome}
              </span>
              {isFinalizado ? (
                <Badge variant={euVenci ? "success" : "neutral"}>
                  {euVenci ? "Arrematado por você" : "Leilão encerrado"}
                </Badge>
              ) : (
                <Badge variant="accent">Leilão aberto</Badge>
              )}
            </div>

            <h1 className="text-[28px] font-semibold text-fg md:text-[34px]">{req.titulo}</h1>

            <p className="text-xs text-fg-2 flex flex-wrap items-center gap-4 pt-1">
              <span className="flex items-center gap-1"><MapPin size={13} /> {req.cidade}</span>
              <span className="flex items-center gap-1"><Calendar size={13} /> Data do evento: {formatDate(req.dataEvento)}</span>
              <span>Quantidade: <strong>{req.quantidade}</strong></span>
            </p>
          </div>

          {/* Banner de Vitória com Dados do Cliente Desbloqueados (Regra: só aparece se a empresa venceu) */}
          {isFinalizado && euVenci && (
            <div className="rounded-[20px] border-2 border-success bg-success/10 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-success-text font-bold text-base sm:text-lg">
                <Trophy size={22} className="shrink-0" />
                <span>Parabéns! Sua empresa venceu este leilão!</span>
              </div>
              <p className="text-xs text-fg leading-relaxed">
                O cliente escolheu sua proposta e o contrato foi gerado. Os dados de contato direto do criador do leilão estão liberados abaixo conforme a regra RN12:
              </p>

              <div className="rounded-[14px] bg-surface border border-line p-4 space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-line/60 gap-1">
                  <span className="text-fg-2">Nome do Criador do Leilão:</span>
                  <strong className="text-fg text-sm">{req.customerNome || "Mariana Fernandes Silva"}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-line/60 gap-1">
                  <span className="text-fg-2">Telefone / WhatsApp:</span>
                  <strong className="text-fg font-mono">{maskPhone(req.customerTelefone || "19998765432")}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-line/60 gap-1">
                  <span className="text-fg-2">E-mail para contato:</span>
                  <strong className="text-fg">{req.customerEmail || "mariana.silva@exemplo.com"}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1 gap-1">
                  <span className="text-fg-2">Endereço da Execução:</span>
                  <strong className="text-fg">{req.customerEndereco || "Av. José Paulino, 1420 - Santa Terezinha, Paulínia - SP"}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`https://wa.me/55${(req.customerTelefone || "19998765432").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[10px] bg-success text-white text-xs font-semibold hover:bg-success/90 transition-colors shadow-xs"
                >
                  <PhoneCall size={14} /> Chamar cliente no WhatsApp
                </a>
                {req.contratoId && (
                  <ButtonLink href={`/api/contracts/${req.contratoId}/pdf`} variant="secondary" className="h-10 text-xs">
                    <FileText size={14} className="mr-1" /> Baixar Contrato em PDF
                  </ButtonLink>
                )}
                <ButtonLink
                  href={`/painel-fornecedor/avaliar/${req.contratoId || "ctr-1"}`}
                  variant="primary"
                  className="h-10 text-xs font-semibold"
                >
                  <Star size={14} className="mr-1 fill-amber-400 text-amber-500" />
                  {store.hasReviewed(req.contratoId || "ctr-1", myProviderId)
                    ? "Ver avaliação do cliente"
                    : "Avaliar cliente (RN14)"}
                </ButtonLink>
              </div>
            </div>
          )}

          {/* Banner de Leilão Encerrado por Outro Fornecedor */}
          {isFinalizado && !euVenci && (
            <div className="rounded-[16px] border border-line bg-muted p-5 space-y-2 text-xs text-fg-2">
              <div className="flex items-center gap-2 font-semibold text-fg text-sm">
                <Lock size={15} /> Leilão encerrado
              </div>
              <p className="leading-relaxed">
                Este pedido foi arrematado por outro concorrente. Conforme a regra de privacidade RN12, as informações pessoais do criador do leilão permanecem restritas exclusivamente ao fornecedor vencedor.
              </p>
            </div>
          )}

          {/* Aviso durante a disputa aberta: Dados do Criador Anônimos */}
          {!isFinalizado && (
            <div className="rounded-[16px] border border-line bg-muted/60 p-4.5 flex items-start gap-3 text-xs text-fg-2">
              <div className="grid size-7 place-items-center rounded-full bg-accent/20 text-accent-text shrink-0 mt-0.5">
                <Lock size={14} />
              </div>
              <div className="space-y-1 leading-relaxed">
                <div className="flex items-center gap-2">
                  <strong className="text-fg font-semibold">Criador: Cliente Arremate #{req.id.slice(-4)}</strong>
                  <span className="text-[11px] font-mono text-accent-text font-medium">· Paulínia</span>
                </div>
                <p>
                  Nome completo, telefone e e-mail do criador do leilão só aparecem para você <strong>depois que sua empresa vencer o leilão</strong> (RN12).
                </p>
              </div>
            </div>
          )}

          {/* Detalhes da Demanda */}
          <Card className="p-6 bg-surface border-line space-y-4">
            <h2 className="text-base font-semibold text-fg">O que o cliente precisa</h2>
            <p className="text-sm text-fg-2 leading-relaxed whitespace-pre-line">{req.descricao}</p>

            <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-fg-2 block">Orçamento máximo do cliente</span>
                {req.tetoVisivel ? (
                  <Mono className="text-base font-bold text-fg mt-0.5">{formatBRL(req.tetoCentavos)}</Mono>
                ) : (
                  <span className="italic text-fg-2">Oculto pelo cliente</span>
                )}
              </div>
              <div>
                <span className="text-fg-2 block">Tempo restante do leilão</span>
                <div className="mt-1">
                  {isFinalizado ? (
                    <span className="font-semibold text-fg-2">Encerrado</span>
                  ) : (
                    <AuctionTimer fechaEm={req.fechaEm} />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-muted/40 border-line text-xs text-fg-2 space-y-2">
            <div className="flex items-center gap-2 text-fg font-semibold">
              <ShieldCheck size={16} className="text-accent-text" />
              Regras do leilão para fornecedores
            </div>
            <p>• Você só pode reduzir o valor do seu lance, nunca aumentá-lo (RN06).</p>
            <p>• Redução mínima: R$ 10 ou 1%, o que for maior.</p>
            <p>• Para garantir a privacidade e evitar leilão predatório, os preços dos concorrentes não são exibidos (RN08).</p>
            <p>• Lances nos últimos 5 minutos estendem o leilão em 5 minutos automaticamente (RN09).</p>
          </Card>
        </div>

        {/* Lado Direito: Painel de Lance */}
        <div className="lg:sticky lg:top-20 space-y-6 self-start">
          {/* Posição atual */}
          <Card className={cn(
            "p-5 transition-colors duration-300",
            posicaoFeedback === "subiu" ? "bg-success/20 border-success" : "bg-surface border-line"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-medium text-fg-2 tracking-wider">Sua posição na disputa</p>
                {posInfo ? (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[28px] font-bold text-fg">
                      {posInfo.posicao}º lugar
                    </span>
                    <span className="text-xs text-fg-2">de {posInfo.total} fornecedores</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-fg-2 mt-1">Nenhum lance enviado por você ainda</p>
                )}
              </div>
              <div className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent-text">
                <Gavel size={20} />
              </div>
            </div>

            {posInfo && !isFinalizado && (
              <p className="mt-3 text-xs text-fg-2 border-t border-line/60 pt-3">
                {posInfo.posicao === 1
                  ? "Parabéns! Você está com a melhor proposta no momento."
                  : "Reduza seu lance para subir de posição e aumentar suas chances."}
              </p>
            )}
          </Card>

          {/* Formulário de Envio / Redução */}
          <Card className="p-6 bg-surface border-line space-y-5">
            <h2 className="text-lg font-semibold text-fg">
              {isFinalizado
                ? "Disputa encerrada"
                : existingBid
                ? "Reduzir seu lance"
                : "Enviar proposta de lance"}
            </h2>

            {isFinalizado ? (
              <p className="text-xs text-fg-2 leading-relaxed">
                Este leilão foi finalizado e não aceita mais alterações de propostas.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="valor-lance" className="font-medium text-fg">Valor do lance (R$)</label>
                    {existingBid && (
                      <span className="text-fg-2">
                        Anterior: <Mono>{formatBRL(existingBid.valorCentavos)}</Mono>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-2 font-mono font-medium">R$</span>
                    <input
                      id="valor-lance"
                      type="text"
                      inputMode="decimal"
                      value={valorInput}
                      onChange={(e) => setValorInput(maskBRL(e.target.value))}
                      className="h-12 w-full rounded-[10px] border border-line bg-surface pl-12 pr-4 text-[18px] font-mono font-semibold text-fg focus-visible:outline-none focus-visible:border-ink"
                      placeholder="11.800"
                    />
                  </div>
                  {existingBid && (
                    <p className="text-[11px] text-fg-2">
                      Redução mínima permitida: <strong>{formatBRL(minRed)}</strong> (RN06)
                    </p>
                  )}
                  {errors.valor && <p className="text-[13px] text-error-text">{errors.valor}</p>}
                </div>

                <Input
                  label="Prazo de execução (em dias)"
                  type="number"
                  min={0}
                  max={365}
                  value={prazoDias}
                  onChange={(e) => setPrazoDias(Number(e.target.value))}
                />

                {/* Itens Inclusos */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-fg">O que está incluso na sua proposta?</label>
                  <div className="space-y-1.5">
                    {itens.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-[8px] bg-muted px-3 py-2 text-xs">
                        <span className="flex items-center gap-1.5 text-fg">
                          <Check size={13} className="text-success-text" /> {it}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-fg-2 hover:text-error-text p-1"
                          aria-label="Remover item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Adicionar item (ex: 5 garçons)..."
                      value={novoItem}
                      onChange={(e) => setNovoItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      className="h-9 flex-1 rounded-[8px] border border-line bg-surface px-3 text-xs focus-visible:outline-none"
                    />
                    <Button type="button" variant="secondary" onClick={handleAddItem} className="h-9 px-3 text-xs">
                      <Plus size={14} /> Adicionar
                    </Button>
                  </div>
                  {errors.itens && <p className="text-[13px] text-error-text">{errors.itens}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-medium text-fg">Mensagem para o cliente</label>
                    <span className="text-fg-2">{mensagem.length} / 300</span>
                  </div>
                  <Textarea
                    placeholder="Destaque seus diferenciais e disponibilidade..."
                    value={mensagem}
                    maxLength={300}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={3}
                  />
                  {errors.mensagem && <p className="text-[13px] text-error-text">{errors.mensagem}</p>}
                </div>

                <Button type="submit" variant="primary" className="w-full h-12 font-semibold" loading={loading}>
                  {existingBid ? "Atualizar e reduzir lance" : "Enviar proposta de lance"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
