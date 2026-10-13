"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell, MapPin, Shield, Download, Trash2, Check,
  ChevronRight, Save
} from "lucide-react";
import { Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";

export default function ConfigFornecedorPage() {
  const { error: toastError } = useToast();
  const [salvo, setSalvo] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(false);
  const [raioKm, setRaioKm] = useState(30);
  const [cidadeBase, setCidadeBase] = useState("Paulínia");

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  const handleExportarDados = () => {
    const dados = {
      tipo: "fornecedor",
      cidadeBase,
      raioKm,
      notificacoes: { email: notifEmail, push: notifPush, whatsapp: notifWhatsapp },
      exportadoEm: new Date().toISOString(),
      politica: "LGPD Art. 18 / RN20 Arremate",
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arremate-dados-fornecedor-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-fg-2">
        <Link href="/painel-fornecedor" className="hover:text-fg">Painel do fornecedor</Link>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">Configurações</span>
      </div>

      <header className="mb-8">
        <Eyebrow>Fornecedor</Eyebrow>
        <h1 className="mt-1 text-[30px] font-semibold tracking-tight md:text-[38px] text-fg">
          Configurações da conta
        </h1>
        <p className="mt-1.5 text-base text-fg-2">
          Gerencie alertas em tempo real, raio geográfico de atendimento e preferências de privacidade LGPD.
        </p>
      </header>

      {salvo && (
        <div className="mb-6 flex items-center gap-2.5 rounded-[12px] bg-success/15 border border-success/30 p-4 text-xs font-semibold text-success-text animate-fade-in">
          <Check size={16} strokeWidth={2.5} />
          Configurações atualizadas com sucesso!
        </div>
      )}

      <form onSubmit={handleSalvar} className="space-y-8">
        {/* Seção 1: Notificações */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <Bell size={18} className="text-accent-text" />
            <h2 className="text-[18px] font-semibold text-fg">Alertas e Notificações</h2>
          </div>
          <p className="text-xs text-fg-2 mb-6">
            Defina como deseja ser avisado quando um cliente publicar um leilão compatível na sua região.
          </p>

          <div className="space-y-4">
            <label className="flex items-start justify-between gap-4 rounded-[12px] border border-line p-4 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <strong className="text-sm font-semibold text-fg block">Notificações Push no Navegador</strong>
                <span className="text-xs text-fg-2">Avisos instantâneos quando um novo leilão abrir no seu raio.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPush}
                onChange={(e) => setNotifPush(e.target.checked)}
                className="size-4.5 accent-accent mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-[12px] border border-line p-4 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <strong className="text-sm font-semibold text-fg block">Alertas por E-mail</strong>
                <span className="text-xs text-fg-2">Resumo de lances concorrentes e encerramento de leilões.</span>
              </div>
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
                className="size-4.5 accent-accent mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-[12px] border border-line p-4 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-semibold text-fg">Avisos via WhatsApp</strong>
                  <Badge variant="neutral">V2 (Mock)</Badge>
                </div>
                <span className="text-xs text-fg-2">Notificações diretas para disputas urgentes que encerram em menos de 2h.</span>
              </div>
              <input
                type="checkbox"
                checked={notifWhatsapp}
                onChange={(e) => setNotifWhatsapp(e.target.checked)}
                className="size-4.5 accent-accent mt-0.5"
              />
            </label>
          </div>
        </Card>

        {/* Seção 2: Raio de Atendimento */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <MapPin size={18} className="text-accent-text" />
            <h2 className="text-[18px] font-semibold text-fg">Região de Atendimento (RN05)</h2>
          </div>
          <p className="text-xs text-fg-2 mb-6">
            Você só visualiza e envia lances para pedidos cujo local do evento esteja dentro do seu raio de alcance.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
                Cidade Base
              </label>
              <select
                value={cidadeBase}
                onChange={(e) => setCidadeBase(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-fg outline-none focus:border-ink"
              >
                <option value="Paulínia">Paulínia / SP</option>
                <option value="Campinas">Campinas / SP</option>
                <option value="Cosmópolis">Cosmópolis / SP</option>
                <option value="Sumaré">Sumaré / SP</option>
                <option value="Hortolândia">Hortolândia / SP</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-2 block">
                  Raio Máximo
                </label>
                <span className="text-xs font-mono font-bold text-accent-text">{raioKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={raioKm}
                onChange={(e) => setRaioKm(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[11px] text-fg-2 mt-1">
                <span>5 km (Local)</span>
                <span>30 km (Metropolitano)</span>
                <span>100 km (Regional)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Seção 3: Privacidade e LGPD (RN20) */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <Shield size={18} className="text-accent-text" />
            <h2 className="text-[18px] font-semibold text-fg">Privacidade e Dados (RN20 / LGPD)</h2>
          </div>
          <p className="text-xs text-fg-2 mb-6">
            Exercite seus direitos fundamentais de titular dos dados conforme a Lei Geral de Proteção de Dados.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] border border-line p-4">
              <div>
                <strong className="text-sm font-semibold text-fg block">Exportar Meus Dados</strong>
                <span className="text-xs text-fg-2">Baixe uma cópia legível de todas as propostas, perfis e histórico no Arremate.</span>
              </div>
              <button
                type="button"
                onClick={handleExportarDados}
                className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] border border-line text-xs font-medium text-fg hover:border-fg transition-colors shrink-0"
              >
                <Download size={14} className="mr-1.5" />
                Exportar (JSON)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] border border-error/30 bg-error/5 p-4">
              <div>
                <strong className="text-sm font-semibold text-error-text block">Excluir Minha Conta</strong>
                <span className="text-xs text-fg-2">Remove seus dados pessoais e suspende todas as propostas ativas irreversivelmente.</span>
              </div>
              <button
                type="button"
                onClick={() => toastError("Para exclusão definitiva, entre em contato com dpo@arremate.com.br ou confirme no suporte admin conforme RN20.")}
                className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] bg-error text-white text-xs font-medium hover:bg-error/90 transition-colors shrink-0"
              >
                <Trash2 size={14} className="mr-1.5" />
                Excluir conta
              </button>
            </div>
          </div>
        </Card>

        {/* Botão de Salvar Alterações */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/painel-fornecedor"
            className="inline-flex items-center justify-center h-11 px-5 rounded-[10px] border border-line text-xs font-medium text-fg hover:border-fg"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn-amber h-11 px-6 text-xs font-semibold"
          >
            <Save size={15} className="mr-1.5" />
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
