-- 0002_rls.sql
-- Políticas de Row Level Security (RLS) do Arremate

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.providers enable row level security;
alter table public.provider_categories enable row level security;
alter table public.requests enable row level security;
alter table public.bids enable row level security;
alter table public.bid_revisions enable row level security;
alter table public.contracts enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;
alter table public.notifications enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.loss_reports enable row level security;
alter table public.audit_log enable row level security;
alter table public.provider_verifications enable row level security;

-- Categories & Plans: leitura pública
create policy "Categorias visíveis a todos" on public.categories for select using (true);
create policy "Planos visíveis a todos" on public.plans for select using (true);

-- Profiles: cada usuário vê e altera o seu perfil; admin vê tudo
create policy "Usuário lê próprio perfil" on public.profiles for select using (
  auth.uid() = id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Usuário atualiza próprio perfil" on public.profiles for update using (auth.uid() = id);

-- Providers: público pode ler perfil verificado; fornecedor gerencia seu registro
create policy "Perfil de fornecedor visível" on public.providers for select using (
  status = 'verificado' or profile_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Fornecedor atualiza próprio registro" on public.providers for update using (profile_id = auth.uid());

-- Requests:
-- Cliente lê e altera seus próprios pedidos.
-- Fornecedores verificados leem pedidos abertos dentro da categoria.
create policy "Cliente gerencia seus pedidos" on public.requests for all using (
  customer_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Fornecedor vê pedidos elegíveis abertos" on public.requests for select using (
  status = 'aberto' and exists (
    select 1 from public.providers p
    join public.provider_categories pc on pc.provider_id = p.id
    where p.profile_id = auth.uid()
      and p.status = 'verificado'
      and pc.category_id = requests.category_id
  )
);

-- Bids (RN08 Visibilidade):
-- Cliente dono do pedido lê TODOS os lances do pedido dele.
-- Fornecedor lê SOMENTE os próprios lances.
create policy "Cliente dono lê lances de seu pedido" on public.bids for select using (
  exists (select 1 from public.requests r where r.id = bids.request_id and r.customer_id = auth.uid())
);

create policy "Fornecedor gerencia apenas seus próprios lances" on public.bids for all using (
  exists (select 1 from public.providers p where p.id = bids.provider_id and p.profile_id = auth.uid())
);

-- Contracts: visível para o cliente e o fornecedor contratado
create policy "Partes veem seu contrato" on public.contracts for select using (
  customer_id = auth.uid() or
  exists (select 1 from public.providers p where p.id = contracts.provider_id and p.profile_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Reviews: visíveis a todos
create policy "Avaliações públicas" on public.reviews for select using (true);
create policy "Partes do contrato podem avaliar" on public.reviews for insert with check (
  autor_id = auth.uid()
);

-- Notifications: usuário lê apenas as suas
create policy "Usuário lê próprias notificações" on public.notifications for select using (profile_id = auth.uid());
create policy "Usuário marca própria notificação como lida" on public.notifications for update using (profile_id = auth.uid());

-- Loss reports: fornecedor lê apenas seus relatórios
create policy "Fornecedor lê seus relatórios de perda" on public.loss_reports for select using (
  exists (select 1 from public.providers p where p.id = loss_reports.provider_id and p.profile_id = auth.uid())
);

-- Verificações e Auditoria: restritos ao próprio usuário e admin
create policy "Verificações acessíveis por dono e admin" on public.provider_verifications for select using (
  exists (select 1 from public.providers p where p.id = provider_verifications.provider_id and p.profile_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin gerencia auditoria" on public.audit_log for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
