import { ButtonLink } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-start gap-6 px-4 py-24">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="28" cy="28" r="16" />
          <path d="M40 40l14 14" />
          <path d="M22 28h12" stroke="#F59E0B" />
        </svg>
        <p className="font-mono text-sm text-accent-text">404</p>
        <h1 className="text-[40px] font-semibold">Página não encontrada</h1>
        <p className="text-fg-2">O endereço pode ter mudado ou o leilão já foi encerrado.</p>
        <ButtonLink href="/" variant="secondary">Voltar ao início</ButtonLink>
      </main>
    </>
  );
}
