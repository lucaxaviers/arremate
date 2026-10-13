"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck, Bell } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, Mono } from "@/components/ui/primitives";
import { useAppStore } from "@/lib/store";
import { formatBRL, formatDate } from "@/lib/utils";

function NovoSucessoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const store = useAppStore();
  const req = id ? store.getRequest(id) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:py-20 text-center">
      <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-success/15 text-success-text">
        <CheckCircle2 size={36} strokeWidth={1.5} />
      </div>

      <Eyebrow>Publicação confirmada</Eyebrow>
      <h1 className="mt-2 text-[32px] font-semibold text-fg">Seu pedido está no ar</h1>
      <p className="mt-2 text-fg-2">
        Avisamos em tempo real os fornecedores verificados da sua região que atendem à categoria.
      </p>

      {req && (
        <Card className="my-8 p-6 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="text-xs uppercase font-medium text-fg-2 tracking-wider">Resumo do leilão</span>
            <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-text">
              Recebendo lances
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-fg text-lg">{req.titulo}</h3>
            <p className="text-xs text-fg-2 mt-1">
              {req.cidade} · Data do evento: {formatDate(req.dataEvento)}
            </p>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-line text-sm">
            <span className="text-fg-2">Orçamento máximo definido</span>
            <Mono className="font-semibold text-fg">{formatBRL(req.tetoCentavos)}</Mono>
          </div>
        </Card>
      )}

      <div className="grid gap-3 text-left mb-8">
        <div className="flex items-start gap-3 rounded-[12px] border border-line bg-surface p-4">
          <Bell size={18} className="text-accent-text shrink-0 mt-0.5" />
          <div className="text-xs text-fg-2">
            <strong className="text-fg block text-sm font-medium">Notificações automáticas</strong>
            Você receberá um aviso assim que o primeiro lance for registrado no sistema.
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-[12px] border border-line bg-surface p-4">
          <ShieldCheck size={18} className="text-accent-text shrink-0 mt-0.5" />
          <div className="text-xs text-fg-2">
            <strong className="text-fg block text-sm font-medium">Somente verificados</strong>
            Apenas fornecedores aprovados por CPF ou CNPJ com selfie podem enviar lances.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row justify-center">
        {req ? (
          <ButtonLink href={`/painel-cliente/leilao/${req.id}`} variant="primary" className="h-12 px-8">
            Acompanhar lances ao vivo
            <ArrowRight size={18} />
          </ButtonLink>
        ) : (
          <ButtonLink href="/painel-cliente" variant="primary" className="h-12 px-8">
            Ir para o painel
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

export default function NovoSucessoPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-20 text-center text-sm text-fg-2">Carregando confirmação...</div>}>
      <NovoSucessoContent />
    </Suspense>
  );
}
