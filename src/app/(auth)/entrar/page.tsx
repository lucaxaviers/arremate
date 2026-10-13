"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  function handleQuickLogin(targetRole: "cliente" | "fornecedor" | "admin") {
    if (targetRole === "fornecedor") {
      setEmail("fornecedor@exemplo.com");
      setSenha("123456");
    } else if (targetRole === "admin") {
      setEmail("admin@arremate.com.br");
      setSenha("123456");
    } else {
      setEmail("cliente@exemplo.com");
      setSenha("123456");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; senha?: string } = {};
    if (!email.trim()) newErrors.email = "Precisamos desse dado para continuar.";
    else if (!email.includes("@")) newErrors.email = "Confira o e-mail. Parece que falta algo.";

    if (!senha) newErrors.senha = "Precisamos desse dado para continuar.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Validação de erro específico (Documento Mestre):
      if (senha === "erro") {
        setErrors({ senha: "A senha está incorreta. Tente novamente ou recupere o acesso." });
        toastError("A senha está incorreta. Tente novamente ou recupere o acesso.");
        return;
      }

      toastSuccess("Acesso realizado com sucesso.");
      if (email.includes("fornecedor")) {
        router.push("/painel-fornecedor");
      } else if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/painel-cliente");
      }
    }, 350);
  }

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden flex flex-col md:flex-row bg-page">
      {/* Coluna Esquerda: Painel Escuro Premium (O design que o usuário gostava) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[48%] xl:w-[45%] h-full bg-[#0A0A0B] text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden select-none shrink-0 border-r border-line/40">
        {/* Glow sutil âmbar de fundo */}
        <div className="absolute -top-24 -left-24 size-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Topo: Logo com Símbolo Invertido */}
        <div className="relative z-10">
          <Logo inverted size="lg" />
        </div>

        {/* Centro: Frase Oficial de Impacto & Card de Demonstração */}
        <div className="relative z-10 space-y-6 max-w-md my-auto py-6">
          <div className="space-y-3">
            <h2 className="text-[32px] lg:text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#FAFAF9]">
              Você diz o que precisa. <br />
              O mercado diz quanto custa. <br />
              <span className="text-[#F59E0B]">Você decide.</span>
            </h2>
            <p className="text-sm lg:text-[15px] text-slate-400 leading-relaxed">
              Acompanhe seus leilões em tempo real, receba lances com detalhes transparentes e arremate pelo menor valor da sua região.
            </p>
          </div>

          {/* Simulação em tempo real do leilão reverso */}
          <div className="rounded-[16px] border border-white/10 bg-white/5 p-4 backdrop-blur-md space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                Leilão reverso em andamento
              </span>
              <span className="font-mono text-[11px] text-slate-400">Paulínia · Buffet</span>
            </div>
            <div className="flex items-baseline justify-between pt-1.5 border-t border-white/10">
              <span className="text-xs text-slate-300">Menor proposta atual:</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-[20px] font-bold text-[#FAFAF9]">R$ 8.400</span>
                <span className="text-[11px] text-emerald-400 font-semibold">(-30%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Painel Escuro */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <p className="text-xs text-slate-500">
            Arremate · Plataforma de leilão reverso de serviços locais conforme RN12
          </p>
        </div>
      </div>

      {/* Coluna Direita: Formulário de Acesso Perfeitamente Centralizado e sem Scroll */}
      <div className="w-full md:w-1/2 lg:w-[52%] xl:w-[55%] h-full flex flex-col justify-between p-6 sm:p-8 lg:p-12 overflow-y-auto md:overflow-hidden bg-page">
        {/* Topo: Logo (apenas no mobile) ou link de voltar */}
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <Logo size="md" />
          </div>
          <div className="hidden md:flex ml-auto">
            <Link
              href="/"
              className="text-xs text-fg-2 hover:text-fg transition-colors inline-flex items-center gap-1"
            >
              Voltar ao início <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Centro: Formulário com largura controlada */}
        <div className="w-full max-w-[380px] mx-auto my-auto py-4 space-y-4">
          <div className="space-y-1">
            <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-fg">
              Entrar
            </h1>
            <p className="text-xs sm:text-sm text-fg-2">
              Acesse sua conta para gerenciar leilões e lances.
            </p>
          </div>

          {/* Botão Google Oficial */}
          <button
            type="button"
            onClick={() => {
              toastSuccess("Entrando com Google...");
              router.push("/painel-cliente");
            }}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[12px] border border-line bg-surface text-xs font-semibold text-fg transition-all hover:bg-muted hover:border-line-strong active:scale-[0.99] shadow-2xs"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Entrar com Google
          </button>

          <div className="relative my-3 text-center text-[11px] text-fg-2 uppercase tracking-wider font-medium">
            <span className="relative z-10 bg-page px-3">ou use e-mail e senha</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={loading}
              autoComplete="email"
              className="h-11"
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="senha-input" className="text-[13px] font-medium text-fg">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-fg-2 hover:text-accent-text transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                id="senha-input"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={errors.senha}
                disabled={loading}
                autoComplete="current-password"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 text-xs font-semibold mt-1"
              loading={loading}
            >
              Entrar
            </Button>
          </form>

          {/* Atalhos de Login Rápido de Demonstração */}
          <div className="pt-2 border-t border-line/60">
            <div className="flex items-center justify-between text-[11px] text-fg-2 mb-1.5">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Sparkles size={11} className="text-accent" /> Teste rápido:
              </span>
              <span className="text-[10px]">Preenche com 1 clique</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin("cliente")}
                className="h-7 rounded-[7px] bg-surface border border-line hover:border-fg text-[11px] font-medium text-fg transition-colors"
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("fornecedor")}
                className="h-7 rounded-[7px] bg-surface border border-line hover:border-fg text-[11px] font-medium text-fg transition-colors"
              >
                Fornecedor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="h-7 rounded-[7px] bg-surface border border-line hover:border-fg text-[11px] font-medium text-fg transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé: Links de cadastro */}
        <div className="space-y-1 text-center text-xs text-fg-2 pt-2">
          <p>
            Não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-fg underline underline-offset-4 hover:text-accent-text"
            >
              Criar conta grátis
            </Link>
          </p>
          <p>
            É prestador de serviços na região?{" "}
            <Link
              href="/cadastro-fornecedor"
              className="font-semibold text-accent-text hover:underline"
            >
              Cadastrar como fornecedor →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
