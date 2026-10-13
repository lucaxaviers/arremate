"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Phone, CheckCircle2, ArrowLeft, Star } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Badge, Mono } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/lib/store";
import { formatBRL, formatDate } from "@/lib/utils";
import { maskPhone, maskCPFOrCNPJ } from "@/lib/masks";

export default function ContratoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const store = useAppStore();
  const { warning } = useToast();

  const contract = store.getContract(id);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const reviews = contract ? store.getContractReviews(contract.id) : [];
  const myReview = reviews.find((r) => r.tipo === "cliente_avalia_fornecedor");
  const providerReview = reviews.find((r) => r.tipo === "fornecedor_avalia_cliente");

  if (!contract) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Contrato não encontrado</h1>
        <ButtonLink href="/painel-cliente" variant="secondary" className="mt-4">
          Voltar ao painel
        </ButtonLink>
      </div>
    );
  }

  // Verifica se está na janela de 24h para cancelamento gratuito (RN13)
  const aceitoEm = new Date(contract.aceitoEm);
  const horasPassadas = (Date.now() - aceitoEm.getTime()) / (1000 * 3600);
  const podeCancelarGratis = horasPassadas <= 24;

  function handleCancel() {
    setCancelando(true);
    setTimeout(() => {
      setCancelando(false);
      setCancelModalOpen(false);
      warning("Contrato cancelado conforme a regra de 24 horas. O leilão foi reaberto.");
      router.push("/painel-cliente");
    }, 500);
  }

  function handleDownloadPDF() {
    window.open(`/api/contracts/${id}/pdf`, "_blank");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/painel-cliente" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg">
          <ArrowLeft size={14} /> Voltar ao painel
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-10 text-xs" onClick={handleDownloadPDF}>
            <Download size={14} /> Baixar PDF
          </Button>
          <ButtonLink href={`/painel-cliente/avaliar/${contract.id}`} variant="primary" className="h-10 text-xs">
            <Star size={14} className="mr-1 fill-amber-400 text-amber-500" />
            {myReview ? "Ver avaliação" : "Avaliar serviço"}
          </ButtonLink>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2">
          <Eyebrow>Termo de arremate e intermediação</Eyebrow>
          <Badge tone="success">Contrato ativo</Badge>
        </div>
        <h1 className="text-[32px] font-semibold text-fg">Contrato de Prestação de Serviços</h1>
        <p className="text-sm text-fg-2">
          Gerado automaticamente em {formatDate(contract.aceitoEm)} pelo Arremate.
        </p>
      </div>

      {/* Contato Direto Liberado (RN12) */}
      <Card className="mb-6 p-6 bg-accent/5 border-accent/30">
        <div className="flex items-start gap-4">
          <div className="grid size-10 place-items-center rounded-full bg-accent/20 text-accent-text shrink-0">
            <Phone size={20} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-fg">Contato direto liberado</h2>
            <p className="text-sm text-fg-2">
              Você já pode alinhar os detalhes operacionais diretamente com o fornecedor arrematado.
            </p>
            <div className="mt-4 flex flex-wrap gap-6 pt-2 text-sm">
              <div>
                <span className="text-xs text-fg-2 block">Fornecedor:</span>
                <strong className="text-fg">{contract.providerNome}</strong>
                <p className="font-mono text-accent-text">{maskPhone(contract.providerTelefone)}</p>
              </div>
              <div>
                <span className="text-xs text-fg-2 block">Documento (CPF/CNPJ):</span>
                <p className="font-mono text-fg">{maskCPFOrCNPJ(contract.providerDocumento)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Avaliação Bilateral (RN14) */}
      <Card className="mb-8 p-6 bg-surface border-line">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eyebrow>Reputação Bilateral · RN14</Eyebrow>
              {myReview ? (
                <Badge variant="success">Avaliação Enviada</Badge>
              ) : (
                <Badge variant="accent">Avaliação Pendente</Badge>
              )}
            </div>
            <h2 className="text-base font-semibold text-fg">Avaliação mútua de prestação de serviços</h2>
            <p className="text-xs text-fg-2 mt-0.5">
              Tanto o cliente quanto o prestador avaliam a experiência com nota de 1 a 5 e breves comentários.
            </p>
          </div>

          <ButtonLink
            href={`/painel-cliente/avaliar/${contract.id}`}
            variant={myReview ? "secondary" : "primary"}
            className="h-10 text-xs shrink-0"
          >
            <Star size={14} className="mr-1 fill-amber-400 text-amber-500" />
            {myReview ? "Ver minha avaliação" : "Avaliar serviço agora"}
          </ButtonLink>
        </div>

        {/* Exibe as avaliações deste contrato se já existirem */}
        {(myReview || providerReview) && (
          <div className="mt-4 pt-4 border-t border-line/70 grid gap-3 sm:grid-cols-2 text-xs">
            {myReview ? (
              <div className="p-3 rounded-[10px] bg-muted/40 border border-line/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-fg">Sua avaliação do fornecedor:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-400" /> {myReview.nota}.0
                  </span>
                </div>
                <p className="text-fg-2 italic">&quot;{myReview.comentario}&quot;</p>
              </div>
            ) : (
              <div className="p-3 rounded-[10px] bg-muted/20 border border-line/40 text-fg-2">
                Você ainda não avaliou este fornecedor.
              </div>
            )}

            {providerReview ? (
              <div className="p-3 rounded-[10px] bg-muted/40 border border-line/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-fg">Avaliação do fornecedor sobre você:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-400" /> {providerReview.nota}.0
                  </span>
                </div>
                <p className="text-fg-2 italic">&quot;{providerReview.comentario}&quot;</p>
              </div>
            ) : (
              <div className="p-3 rounded-[10px] bg-muted/20 border border-line/40 text-fg-2">
                Aguardando avaliação do fornecedor sobre a negociação.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Corpo do Contrato Simples */}
      <Card className="p-8 space-y-8 bg-surface border-line">
        <div className="grid gap-6 sm:grid-cols-2 border-b border-line pb-6 text-sm">
          <div>
            <span className="text-xs uppercase text-fg-2 font-medium">Contratante (Cliente)</span>
            <p className="font-semibold text-fg mt-1">{contract.customerNome}</p>
            <p className="text-fg-2 text-xs">{contract.cidade} · Telefone: {maskPhone(contract.customerTelefone)}</p>
          </div>
          <div>
            <span className="text-xs uppercase text-fg-2 font-medium">Contratado (Fornecedor)</span>
            <p className="font-semibold text-fg mt-1">{contract.providerNome}</p>
            <p className="text-fg-2 text-xs">CNPJ/CPF: {maskCPFOrCNPJ(contract.providerDocumento)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-fg">1. Objeto e Escopo do Serviço</h3>
          <p className="text-sm text-fg-2 leading-relaxed">
            O presente instrumento tem por objeto a prestação do serviço de <strong>{contract.titulo}</strong> na cidade de{" "}
            <strong>{contract.cidade}</strong>, previsto para execução em <strong>{formatDate(contract.dataEvento)}</strong>.
          </p>
          <div className="mt-3 rounded-[10px] bg-muted p-4">
            <p className="text-xs font-semibold text-fg mb-2 uppercase">Itens inclusos expressamente acordados:</p>
            <ul className="space-y-1 text-xs text-fg-2">
              {contract.inclui.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-success-text" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-fg">2. Valor e Condições de Pagamento</h3>
          <p className="text-sm text-fg-2 leading-relaxed">
            O valor total do arremate aprovado é de{" "}
            <Mono className="font-bold text-fg text-base">{formatBRL(contract.valorCentavos)}</Mono>, a ser pago diretamente
            ao fornecedor conforme os termos combinados entre as partes.
          </p>
        </div>

        <div className="space-y-3 border-t border-line pt-6">
          <h3 className="text-base font-semibold text-fg">3. Natureza Jurídica da Plataforma</h3>
          <p className="text-xs text-fg-2 leading-relaxed">
            O Arremate atua estritamente como intermediador tecnológico do leilão reverso e não é parte integrante da
            execução do serviço, nem garante obrigações trabalhistas, tributárias ou operacionais decorrentes da relação.
          </p>
        </div>

        {/* Regra de Cancelamento RN13 */}
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-fg-2 max-w-md">
            {podeCancelarGratis ? (
              <p className="text-success-text font-medium">
                Cancelamento gratuito disponível pelas próximas {Math.max(1, Math.round(24 - horasPassadas))} horas (RN13).
              </p>
            ) : (
              <p>Período de cancelamento gratuito sem custo expirado.</p>
            )}
          </div>
          {podeCancelarGratis && (
            <Button
              variant="destructive"
              className="h-10 text-xs"
              onClick={() => setCancelModalOpen(true)}
            >
              Cancelar contrato
            </Button>
          )}
        </div>
      </Card>

      {/* Modal de Cancelamento com Confirmação */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancelar contrato arrematado?"
      >
        <div className="space-y-4">
          <p className="text-sm text-fg-2">
            Você está dentro do prazo de 24 horas de garantia. O contrato será cancelado sem nenhum custo e o fornecedor será notificado.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)} className="flex-1">
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel} loading={cancelando} className="flex-1">
              Confirmar cancelamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
