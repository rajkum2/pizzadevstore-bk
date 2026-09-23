-- Initial schema for New York Pizza (migrated from MongoDB/Mongoose models)

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pizzas jsonb not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'shipped', 'canceled')),
  stripe_payment_id text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_orders_created_at on public.orders(created_at desc);

-- The backend connects with the service_role key, which bypasses RLS.
-- Enabling RLS with no policies blocks all direct anon/authenticated access,
-- so the tables are only reachable through the Express API.
alter table public.users enable row level security;
alter table public.orders enable row level security;
