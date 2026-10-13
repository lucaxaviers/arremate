"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/components/ui/toast";
import { signupSchema } from "@/lib/schemas";

export default function CadastroPage() {
  const router = useRouter();
  const { success } = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ nome, email, senha, consentimento });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success("Conta criada com sucesso.");
      router.push("/painel-cliente");
    }, 400);
  }

  return (
    <div className="mx-auto max-w-[440px] px-4 py-10 md:py-14">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-[32px] font-semibold text-fg">Criar conta</h1>
        <p className="text-sm text-fg-2">Publique necessidades e receba lances em minutos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nome completo"
          placeholder="Mariana Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={errors.nome}
          disabled={loading}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="mariana@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={errors.senha}
          hint="Use pelo menos 8 caracteres."
          disabled={loading}
        />

        <div className="space-y-1 pt-2">
          <label className="flex items-start gap-3 cursor-pointer text-sm text-fg-2 select-none">
            <input
              type="checkbox"
              checked={consentimento}
              onChange={(e) => setConsentimento(e.target.checked)}
              className="mt-1 size-4 rounded accent-accent"
              disabled={loading}
            />
            <span>
              Concordo com os{" "}
              <Link href="/termos" className="underline hover:text-fg">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="underline hover:text-fg">
                Política de Privacidade
              </Link>{" "}
              (LGPD).
            </span>
          </label>
          {errors.consentimento && (
            <p className="text-[13px] text-error-text" role="alert">
              {errors.consentimento}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full mt-4" loading={loading}>
          Criar minha conta
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-fg-2">
        Já tem uma conta?{" "}
        <Link href="/entrar" className="font-medium text-fg underline underline-offset-4 hover:text-accent-text">
          Entrar
        </Link>
      </p>
    </div>
  );
}
