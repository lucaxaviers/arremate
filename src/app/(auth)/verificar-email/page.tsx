import { CheckCircle2 } from "lucide-react";
import { Eyebrow, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function VerificarEmailPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <header className="mb-8 text-center">
        <Eyebrow>Autenticação</Eyebrow>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-fg">
          E-mail verificado!
        </h1>
        <p className="mt-1 text-sm text-fg-2">
          Sua conta no Arremate foi confirmada com sucesso.
        </p>
      </header>

      <Card className="p-8 text-center space-y-5">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/15 text-success-text">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-fg">Tudo pronto para começar</h2>
          <p className="text-xs text-fg-2 leading-relaxed">
            Seu endereço de e-mail foi validado. Agora você pode publicar necessidades, acompanhar disputas e gerenciar seus contratos.
          </p>
        </div>

        <div className="pt-3 space-y-2.5">
          <ButtonLink href="/painel-cliente" variant="primary" className="w-full h-11 justify-center text-xs">
            Acessar painel do cliente
          </ButtonLink>
          <ButtonLink href="/painel-fornecedor" variant="secondary" className="w-full h-10 justify-center text-xs">
            Acessar painel do fornecedor
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
