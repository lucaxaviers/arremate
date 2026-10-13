import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export { Logo };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-page/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6" aria-label="Principal">
        <Logo />
        <div className="hidden items-center gap-6 text-[15px] text-fg-2 md:flex">
          <Link href="/como-funciona" className="hover:text-fg">Como funciona</Link>
          <Link href="/#categorias" className="hover:text-fg">Categorias</Link>
          <Link href="/precos" className="hover:text-fg">Preços</Link>
          <Link href="/fornecedores" className="hover:text-fg">Sou fornecedor</Link>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/entrar" variant="ghost" className="hidden sm:inline-flex">Entrar</ButtonLink>
          <ButtonLink href="/painel-cliente/novo" variant="dark" className="h-10 px-4 text-sm font-semibold !text-[#FAFAF9]">
            Publicar necessidade
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    { t: "Produto", l: [["Como funciona", "/como-funciona"], ["Preços", "/precos"], ["Para fornecedores", "/fornecedores"]] },
    { t: "Conta", l: [["Entrar", "/entrar"], ["Criar conta", "/cadastro"], ["Cadastro de fornecedor", "/cadastro-fornecedor"]] },
    { t: "Legal", l: [["Termos de uso", "/termos"], ["Privacidade", "/privacidade"]] },
  ];
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-fg-2">Você diz o que precisa. O mercado diz quanto custa. Você decide.</p>
        </div>
        {cols.map((c) => (
          <div key={c.t}>
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-fg-2">{c.t}</p>
            <ul className="space-y-2 text-[15px]">
              {c.l.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-fg hover:text-accent-text">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 py-6 text-xs text-fg-2 md:px-6">
          <p>Arremate · Feito em Paulínia · Intermediadora tecnológica conforme RN12.</p>
          <p>© 2026 Arremate. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
