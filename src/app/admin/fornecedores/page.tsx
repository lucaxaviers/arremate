"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";

export default function AdminFornecedoresPage() {
  const { success, warning } = useToast();
  const [fornecedores, setFornecedores] = useState([
    {
      id: "f-101",
      nomeFantasia: "Churrasco & Brasa Paulínia",
      responsavel: "Marcos Vinicius",
      tipo: "MEI",
      documento: "45.123.789/0001-55",
      cidade: "Paulínia",
      segmentos: ["Buffet", "Churrasco"],
      dataEnvio: "Hoje, há 45 min",
      status: "pendente",
    },
    {
      id: "f-102",
      nomeFantasia: "DJ Alex Mix Sonorização",
      responsavel: "Alexandre Pires",
      tipo: "PF",
      documento: "389.456.123-09",
      cidade: "Campinas",
      segmentos: ["DJ e Som"],
      dataEnvio: "Hoje, há 2h",
      status: "pendente",
    },
  ]);

  function handleApprove(id: string) {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    success("Fornecedor aprovado com sucesso! Selo de verificado concedido.");
  }

  function handleReject(id: string) {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    warning("Documentação recusada. O fornecedor foi notificado para reenvio.");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg mb-6">
        <ArrowLeft size={14} /> Voltar ao painel admin
      </Link>

      <div className="mb-8 space-y-1">
        <Eyebrow>Moderação manual</Eyebrow>
        <h1 className="text-[32px] font-semibold text-fg">Fila de verificação de fornecedores</h1>
        <p className="text-sm text-fg-2">
          Confira o documento oficial e a selfie biométrica antes de liberar o acesso a lances (RN05).
        </p>
      </div>

      {fornecedores.length === 0 ? (
        <Card className="p-12 text-center text-sm text-fg-2">
          Nenhum fornecedor pendente na fila de verificação no momento.
        </Card>
      ) : (
        <div className="space-y-4">
          {fornecedores.map((f) => (
            <Card key={f.id} className="p-6 bg-surface border-line space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-fg">{f.nomeFantasia}</h2>
                    <Badge tone="accent">Aguardando aprovação</Badge>
                  </div>
                  <p className="text-xs text-fg-2 mt-1">
                    Responsável: <strong>{f.responsavel}</strong> ({f.tipo}) · {f.cidade} · Enviado {f.dataEnvio}
                  </p>
                  <p className="font-mono text-xs text-fg mt-1">Documento: {f.documento}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="h-10 text-xs" onClick={() => handleReject(f.id)}>
                    <X size={14} /> Recusar
                  </Button>
                  <Button variant="primary" className="h-10 text-xs" onClick={() => handleApprove(f.id)}>
                    <Check size={14} /> Aprovar fornecedor
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-line/60 pt-3 text-xs text-fg-2">
                <span className="font-medium text-fg">Arquivos anexados:</span>
                <span className="underline cursor-pointer hover:text-accent-text">documento_frente_verso.pdf</span>
                <span>·</span>
                <span className="underline cursor-pointer hover:text-accent-text">selfie_biometria.jpg</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
