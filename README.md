<div align="center">

# 🔨 Arremate — Leilão Reverso de Serviços Locais

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tests-28%20passed-10B981?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Status-MVP_Concluído-10B981?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  <b>Você diz o que precisa. O mercado diz quanto custa. Você decide.</b><br/>
  O cliente publica a necessidade e o orçamento máximo; fornecedores verificados da região enviam lances em tempo real; o cliente compara e arremata o melhor.
</p>

---

</div>

## 💡 Como Funciona (Leilão Reverso)

O Arremate inverte a lógica tradicional de contratação. O cliente define o escopo e o teto orçamentário; os fornecedores competem enviando lances menores com itens inclusos transparentes:

| Etapa | Ator | Descrição da Mecânica |
|---|---|---|
| 📝 **Publicar** | Cliente | Publica necessidade guiada em 4 etapas com rascunho persistido localmente (RN01, RN02, RN03). |
| 🔔 **Notificar** | Sistema | Dispara aviso aos fornecedores verificados por CPF/CNPJ e selfie no raio de atendimento (RN05). |
| 📉 **Dar Lance** | Fornecedor | Envia valor, prazo, itens inclusos e mensagem. Visibilidade selada: vê apenas sua posição ("2º de 4") sem expor concorrentes (RN06, RN07, RN08). |
| ⏱️ **Anti-Sniping** | Sistema | Lances enviados nos últimos 5 minutos prorrogam o fechamento em +5 min (até 3 vezes) (RN09). |
| ⚖️ **Comparar** | Cliente | Filtra por preço, avaliação, prazo e garantias. Ordena por **Recomendados** (score ponderado 45/25/15/10/5) ou menor preço (RN10). |
| 🔨 **Arrematar** | Cliente | Escolhe o fornecedor a qualquer momento. Aciona confete (800ms sem som), gera contrato simples em PDF no servidor e libera contato direto (RN12). |
| 🛡️ **Garantia** | Cliente | Cancelamento 100% gratuito em até 24 horas após o arremate (RN13). |
| ⭐ **Avaliar** | Ambas as partes | Avaliação bilateral (1 a 5 estrelas) após a execução do serviço (RN14). |
| 📊 **Pós-Leilão** | Fornecedor | Fornecedores que perderam recebem relatório com colocação final, valor vencedor e diferenciais para aprender (RN15). |

---

## 🎨 Identidade Visual & O Símbolo "Menor Lance"

Conforme a **Seção 04 do Documento Mestre v2.1**, a marca Arremate utiliza a direção com **três barras verticais descendentes**:
- Cada barra representa um lance menor que o anterior (mecânica do leilão reverso).
- A menor barra é destacada na cor de ação **Âmbar (#F59E0B)**, simbolizando o *arremate* e o menor lance vitorioso.
- O wordmark utiliza `arremate` em minúsculas com tracking `-0.02em` e ponto final em âmbar (`.`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Detalhes |
|---|---|---|
| 🖥️ **Frontend** | Next.js 15 (App Router, Turbopack) | TypeScript estrito, React 19 |
| 🎨 **Estilização** | Tailwind CSS v4 | Tokens CSS oficiais em `globals.css` (modo claro e escuro) |
| 🧩 **Componentes** | Radix / Custom acessível | Cobertura dos 8 estados: repouso, hover, foco, ativo, loading, erro, vazio e disabled |
| 🗄️ **Banco & Auth** | Supabase Postgres | Migrations com 17 tabelas, Row Level Security e funções RPC |
| ⚡ **Tempo Real** | Supabase Realtime + Store Reativa | Sincronização de lances com isolamento selado por ator |
| 🧪 **Testes** | Vitest | 28 testes unitários cobrindo todas as regras de negócio puras |
| 📄 **Contrato** | Server-side PDF Route | Endpoint `/api/contracts/[id]/pdf` gerando documento simples para download |
| 🚀 **Deploy** | Vercel | Otimizado com suporte a Suspense e Server Components |

---

## 🗺️ Roadmap de Entrega (Documento Mestre v2.1)

| # | Etapa | Status | Detalhes |
|---|---|:---:|---|
| 1 | Setup, design system (claro/escuro), componentes base e landing page | 🟢 Concluído | Tokens de cor, tipografia Inter/JetBrains Mono, logo de 3 barras, hero, FAQ e problemas |
| 2 | Autenticação, perfis, cadastro de fornecedor em 3 etapas e verificação no admin | 🟢 Concluído | Validação de CPF/CNPJ, upload de selfie e documento, moderação no admin |
| 3 | Publicação de pedido com rascunho salvo, limite de 3 ativos e notificações | 🟢 Concluído | Stepper de 4 fases, persistência local de rascunho, bloqueio RN02 |
| 4 | Lances em tempo real, posição selada, extensão automática, filtros e timer | 🟢 Concluído | Redução mínima de R$ 10 ou 1%, anti-sniping (+5 min), ordenação por score |
| 5 | Arremate, contrato simples em PDF, liberação de contato e avaliações | 🟢 Concluído | Botão âmbar apenas no melhor lance, modal de confirmação, geração de PDF e avaliação 1-5 |
| 6 | Moderação de lances anômalos, auditoria, relatório pós-leilão e painel admin | 🟢 Concluído | Sinalização <50% do teto, aprovação/rejeição no admin |
| 7 | Estados vazios, skeletons, toasts, modais, microinterações e confete | 🟢 Concluído | SVGs minimalistas com traço 1,5px, confete com 40 partículas (prefers-reduced-motion) |
| 8 | Polimento: acessibilidade, SEO, Open Graph, performance e checklist final | 🟢 Concluído | Build com 30 rotas estáticas/dinâmicas geradas com zero erros |

---

## 🎨 Tokens de Design System

| Token | Modo Claro | Modo Escuro | Uso |
|---|---|---|---|
| **ink** | `#0A0A0B` | `#FAFAF9` | Texto principal e botões escuros da lista |
| **page** | `#FAFAF9` | `#0A0A0B` | Fundo principal da aplicação |
| **surface** | `#FFFFFF` | `#141416` | Fundo de cards elevados com borda de 1px |
| **line / border** | `#E7E5E4` | `#26262B` | Bordas e divisores estruturais |
| **accent** | `#F59E0B` | `#F59E0B` | Âmbar: ação principal, card do melhor lance, filtros ativos |
| **accent-text** | `#B45309` | `#F59E0B` | Texto e ícones âmbar sobre fundo claro (contraste AA 5:1) |
| **success** | `#10B981` | `#34D399` | Estado arrematado e feedback positivo |
| **error** | `#EF4444` | `#F87171` | Validações e mensagens de erro |
| **num** | JetBrains Mono | JetBrains Mono | Exibição obrigatória de moedas (BRL), contadores e timers |

---

## 📁 Estrutura de Arquivos

```text
arremate/
├── docs/                                # Documento mestre v2.1 e prompt do MVP
├── supabase/
│   ├── migrations/
│   │   ├── 0001_schema.sql             # 17 tabelas (requests, bids, contracts, etc.)
│   │   ├── 0002_rls.sql                # Políticas de isolamento por papel (RN08)
│   │   └── 0003_functions.sql          # RPCs de lances, ranking e cron de encerramento
│   └── seed.sql                        # Categorias, planos e dados de inicialização
├── src/
│   ├── app/
│   │   ├── (public)/                   # Landing cliente (/), fornecedores (/fornecedores), preços, termos
│   │   ├── (auth)/                     # Entrar, cadastro cliente, cadastro fornecedor (3 etapas)
│   │   ├── painel-cliente/             # Dashboard, novo pedido (rascunho), sala do leilão, contrato, avaliar
│   │   ├── painel-fornecedor/          # Dashboard, feed de leilões, sala de envio/redução, lances
│   │   ├── admin/                      # Dashboard admin, moderação de fornecedores e lances anômalos
│   │   └── api/contracts/[id]/pdf/     # Endpoint gerador de PDF de contrato simples
│   ├── components/
│   │   ├── ui/                         # Button, Input, Modal, Toast, Timer, Logo, Confetti, EmptyState
│   │   └── layout/                     # SiteHeader, SiteFooter com novo logo e navegação
│   └── lib/
│       ├── domain/
│       │   ├── rules.ts                # Implementação pura de RN01 a RN22
│       │   └── rules.test.ts           # 28 testes unitários passando no Vitest
│       ├── mock-data.ts                # Seed com fornecedores de Paulínia e Campinas
│       ├── schemas.ts                  # Validação Zod com CPF e CNPJ reais
│       ├── store.ts                    # Engine reativa client-side com persistência
│       └── utils.ts                    # Formatação BRL e datas (America/Sao_Paulo)
```

---

## 🚀 Como Executar Localmente

### 1. Clonar e Instalar

```bash
git clone https://github.com/lucaxaviers/arremate.git
cd arremate
npm install
```

### 2. Rodar a Suíte de Testes Unitários

```bash
npm test
```
> Executa 28 testes de regras de negócio com o Vitest.

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** no seu navegador.

### 4. Validar o Build de Produção

```bash
npm run build
```

---

## 👨‍💻 Autor

| Nome | GitHub |
|---|---|
| **Lucas Rodrigues Xavier** | [@lucaxaviers](https://github.com/lucaxaviers) |
