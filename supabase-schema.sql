-- =============================================
-- Asset Wallet — Supabase Schema
-- Ejecutar en: Dashboard > SQL Editor > New Query
-- =============================================

-- 1. Tabla de activos
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'other',
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- 2. Tabla de transacciones (registros de valor)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  value double precision not null,
  date text not null,
  note text,
  created_at timestamptz default now()
);

-- 3. Tabla de configuración del usuario
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  currency text default 'MXN',
  locale text default 'es-MX'
);

-- 4. Habilitar Row Level Security
alter table public.assets enable row level security;
alter table public.transactions enable row level security;
alter table public.settings enable row level security;

-- 5. Políticas RLS — cada usuario solo ve/modifica sus propios datos
create policy "Users manage own assets"
  on public.assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own settings"
  on public.settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Índices para rendimiento
create index idx_assets_user on public.assets(user_id);
create index idx_transactions_asset on public.transactions(asset_id);
create index idx_transactions_user on public.transactions(user_id);
create index idx_settings_user on public.settings(user_id);
