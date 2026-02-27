create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null check (status in ('active','trialing','past_due','canceled','incomplete','unpaid')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions(stripe_subscription_id)
  where stripe_subscription_id is not null;

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  question_json jsonb not null,
  selected_choice text not null check (selected_choice in ('A','B','C','D')),
  is_correct boolean not null,
  topic_tags text[] not null,
  difficulty int not null check (difficulty between 1 and 5),
  thinking_errors text[] not null default '{}',
  time_seconds int,
  feedback_json jsonb not null
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.attempts enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on public.profiles
for update using (auth.uid() = id);

create policy "Subscriptions owner read" on public.subscriptions
for select using (auth.uid() = user_id);

create policy "Subscriptions owner write" on public.subscriptions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Attempts owner read" on public.attempts
for select using (auth.uid() = user_id);

create policy "Attempts owner write" on public.attempts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
