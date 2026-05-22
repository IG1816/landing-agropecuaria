-- Execute no Supabase: SQL Editor → New query → Run
-- Cria tabelas de favoritos e pedidos com segurança por usuário (RLS)

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_name text not null,
  category text,
  created_at timestamptz not null default now(),
  unique (user_id, product_name)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pendente'
    check (status in ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);
create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.favorites enable row level security;
alter table public.orders enable row level security;

drop policy if exists "favorites_select_own" on public.favorites;
drop policy if exists "favorites_insert_own" on public.favorites;
drop policy if exists "favorites_delete_own" on public.favorites;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_update_own" on public.orders;
drop policy if exists "orders_delete_own" on public.orders;

create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "orders_update_own" on public.orders
  for update using (auth.uid() = user_id);

create policy "orders_delete_own" on public.orders
  for delete using (auth.uid() = user_id);

-- ─── Administradores da loja ───
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own" on public.admin_users
  for select using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "orders_admin_select" on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "favorites_admin_select" on public.favorites;

create policy "orders_admin_select" on public.orders
  for select using (public.is_admin());

create policy "orders_admin_update" on public.orders
  for update using (public.is_admin());

create policy "favorites_admin_select" on public.favorites
  for select using (public.is_admin());

create or replace function public.admin_list_orders()
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  title text,
  description text,
  status text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select o.id, o.user_id, u.email::text, o.title, o.description, o.status, o.created_at
  from public.orders o
  join auth.users u on u.id = o.user_id
  where public.is_admin()
  order by o.created_at desc;
$$;

grant execute on function public.admin_list_orders() to authenticated;

create or replace function public.admin_update_order_status(order_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if new_status not in ('pendente', 'em_andamento', 'concluido', 'cancelado') then
    raise exception 'invalid status';
  end if;
  update public.orders
  set status = new_status, updated_at = now()
  where id = order_id;
end;
$$;

grant execute on function public.admin_update_order_status(uuid, text) to authenticated;
