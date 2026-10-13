-- 0001_schema.sql
-- Modelo de dados do Arremate (Documento Mestre v2.1, seção 17)

create extension if not exists "uuid-ossp";

-- Perfis de usuários
create type user_role as enum ('cliente', 'fornecedor', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'cliente',
  nome text not null,
  telefone text,
  cidade text not null default 'Paulínia',
  created_at timestamptz not null default now()
);

-- Categorias de serviços
create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  nome text not null,
  ativa boolean not null default true
);

-- Fornecedores
create type provider_tipo as enum ('mei', 'pj', 'pf');
create type provider_status as enum ('pendente', 'verificado', 'suspenso');

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  nome_fantasia text not null,
  documento text not null unique,
  tipo provider_tipo not null default 'mei',
  descricao text,
  status provider_status not null default 'pendente',
  nota_media numeric(3,2) not null default 5.00,
  total_avaliacoes int not null default 0,
  taxa_resposta numeric(3,2) not null default 1.00,
  taxa_cumprimento numeric(3,2) not null default 1.00,
  raio_km int not null default 30,
  cidade_base text not null default 'Paulínia',
  lat numeric(10,7) not null default -22.7636,
  lng numeric(10,7) not null default -47.1539,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_categories (
  provider_id uuid not null references public.providers(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  primary key (provider_id, category_id)
);

-- Pedidos / Leilões
create type request_status as enum (
  'rascunho', 'aberto', 'encerrado', 'contratado', 'em_execucao', 'concluido', 'expirado', 'cancelado', 'em_disputa'
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  category_id text not null references public.categories(id),
  titulo text not null,
  descricao text not null,
  data_evento timestamptz not null,
  cidade text not null,
  lat numeric(10,7) not null default -22.7636,
  lng numeric(10,7) not null default -47.1539,
  quantidade int not null default 1,
  teto_centavos int not null,
  teto_visivel boolean not null default true,
  status request_status not null default 'aberto',
  abre_em timestamptz not null default now(),
  fecha_em timestamptz not null,
  extensoes int not null default 0,
  raio_ampliado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_requests_status_fecha on public.requests(status, fecha_em);
create index if not exists idx_requests_customer on public.requests(customer_id);

-- Lances
create type bid_status as enum ('ativo', 'retirado', 'aceito', 'recusado', 'expirado');

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  valor_centavos int not null,
  prazo_dias int not null default 3,
  inclui text[] not null default '{}',
  observacoes text,
  validade_ate timestamptz not null,
  status bid_status not null default 'ativo',
  em_revisao boolean not null default false,
  tem_portfolio boolean not null default false,
  created_at timestamptz not null default now(),
  constraint unq_bid_provider_request unique (request_id, provider_id)
);

create index if not exists idx_bids_request_valor on public.bids(request_id, valor_centavos);
create index if not exists idx_bids_provider on public.bids(provider_id);

-- Histórico de revisões de lances (RN06)
create table if not exists public.bid_revisions (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid not null references public.bids(id) on delete cascade,
  valor_anterior_centavos int not null,
  valor_novo_centavos int not null,
  created_at timestamptz not null default now()
);

-- Contratos (RN12)
create type contract_status as enum ('ativo', 'concluido', 'cancelado', 'em_disputa');

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  bid_id uuid not null references public.bids(id),
  customer_id uuid not null references public.profiles(id),
  provider_id uuid not null references public.providers(id),
  valor_centavos int not null,
  sinal_centavos int not null default 0,
  comissao_pct numeric(5,2) not null default 0.00,
  status contract_status not null default 'ativo',
  aceito_em timestamptz not null default now(),
  concluido_em timestamptz,
  cancelado_em timestamptz,
  cancelado_por uuid references public.profiles(id)
);

-- Pagamentos (V2 - estrutura pronta mas desligada no MVP)
create type payment_tipo as enum ('sinal', 'saldo', 'repasse', 'reembolso');
create type payment_status as enum ('pendente', 'pago', 'reembolsado', 'falho');

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  tipo payment_tipo not null,
  valor_centavos int not null,
  status payment_status not null default 'pendente',
  provider_ref text,
  created_at timestamptz not null default now()
);

-- Mensagens de contato (V2 mock)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  corpo text not null,
  created_at timestamptz not null default now()
);

-- Avaliações bilaterais (RN14)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  autor_id uuid not null references public.profiles(id),
  alvo_id uuid not null references public.profiles(id),
  nota int not null check (nota between 1 and 5),
  comentario text,
  created_at timestamptz not null default now()
);

-- Disputas (RN19)
create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  aberta_por uuid not null references public.profiles(id),
  motivo text not null,
  status text not null default 'aberta',
  resolucao text,
  created_at timestamptz not null default now()
);

-- Notificações
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tipo text not null,
  payload jsonb not null default '{}'::jsonb,
  lida_em timestamptz,
  created_at timestamptz not null default now()
);

-- Planos e Assinaturas (RN17)
create table if not exists public.plans (
  id text primary key,
  nome text not null,
  preco_centavos int not null default 0,
  lances_por_mes int not null default 3,
  destaque boolean not null default false
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'ativa',
  inicio timestamptz not null default now(),
  fim timestamptz
);

-- Relatórios pós-leilão (RN15)
create table if not exists public.loss_reports (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  posicao_final int not null,
  valor_vencedor_centavos int not null,
  mediana_categoria_centavos int not null,
  diferenciais jsonb not null default '{}'::jsonb,
  gerado_em timestamptz not null default now()
);

-- Auditoria (RN19 / RN20)
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  ator_id uuid references public.profiles(id),
  entidade text not null,
  entidade_id uuid,
  acao text not null,
  antes jsonb,
  depois jsonb,
  created_at timestamptz not null default now()
);

-- Verificações de fornecedor (RN05 / RN20 bucket privado)
create table if not exists public.provider_verifications (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  documento_url text not null,
  selfie_url text not null,
  status provider_status not null default 'pendente',
  revisado_por uuid references public.profiles(id),
  revisado_em timestamptz,
  created_at timestamptz not null default now()
);
