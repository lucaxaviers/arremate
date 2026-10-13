"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Eyebrow, Card } from "@/components/ui/primitives";
import { Logo } from "@/components/ui/logo";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEnviado(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <header className="mb-8 text-center">
        <Eyebrow>Acesso à Conta</Eyebrow>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-fg">
          Recuperar sua senha
        </h1>
        <p className="mt-1 text-sm text-fg-2">
          Informe seu e-mail para receber as instruções de recuperação.
        </p>
      </header>

      <Card className="p-6 md:p-8">
        {enviado ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success-text">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-base font-semibold text-fg">Verifique sua caixa de entrada</h2>
            <p className="text-xs text-fg-2 leading-relaxed">
              Enviamos um link de redefinição para <strong>{email}</strong>. Siga as instruções para criar uma nova senha.
            </p>
            <div className="pt-2">
              <Link
                href="/entrar"
                className="inline-flex items-center justify-center h-10 px-5 rounded-[10px] bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-colors"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recuperar-email" className="text-xs font-semibold uppercase tracking-wider text-fg-2 block mb-2">
                E-mail cadastrado
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-2" />
                <input
                  id="recuperar-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-11 w-full rounded-[10px] border border-line bg-surface pl-10 pr-3 text-sm text-fg outline-none focus:border-ink"
                />
              </div>
            </div>

            <button type="submit" className="btn-amber w-full h-11 text-xs font-semibold justify-center">
              Enviar link de recuperação
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/entrar"
                className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg font-medium"
              >
                <ArrowLeft size={13} /> Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
