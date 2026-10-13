-- supabase/seed.sql
-- Seed de desenvolvimento do Arremate (Paulínia e Campinas)

-- Categorias
insert into public.categories (id, slug, nome, ativa) values
  ('buffet', 'buffet', 'Buffet e Gastronomia', true),
  ('fotografia', 'fotografia', 'Fotografia e Filmagem', true),
  ('dj', 'dj', 'DJ e Sonorização', true),
  ('decoracao', 'decoracao', 'Decoração de Eventos', true),
  ('frete', 'frete', 'Frete e Mudança', true),
  ('reforma', 'reforma', 'Reforma e Reparos', true)
on conflict (id) do nothing;

-- Planos
insert into public.plans (id, nome, preco_centavos, lances_por_mes, destaque) values
  ('gratis', 'Grátis', 0, 3, false),
  ('pro', 'Pro', 9990, 9999, true),
  ('prime', 'Prime', 19990, 9999, true)
on conflict (id) do nothing;
