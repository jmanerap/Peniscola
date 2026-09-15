create extension if not exists pgcrypto;

create table if not exists public.trip_states (
  trip_id text primary key,
  completed_activities jsonb not null default '[]'::jsonb,
  completed_challenges jsonb not null default '{}'::jsonb,
  opened_envelopes jsonb not null default '[]'::jsonb,
  unlocked_surprises jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(), trip_id text not null,
  title text not null default '', body text not null default '', location text not null default '',
  photos jsonb not null default '[]'::jsonb, reactions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_moments (
  trip_id text not null, day text not null, member text not null, answer text not null,
  updated_at timestamptz not null default now(), primary key (trip_id, day, member)
);

create table if not exists public.question_answers (
  trip_id text not null, question_id text not null, member text not null, answer text not null,
  updated_at timestamptz not null default now(), primary key (trip_id, question_id, member)
);

create table if not exists public.daily_photos (
  trip_id text not null, day text not null, photo_url text not null,
  updated_at timestamptz not null default now(), primary key (trip_id, day)
);

alter table public.trip_states enable row level security;
alter table public.journal_entries enable row level security;
alter table public.daily_moments enable row level security;
alter table public.question_answers enable row level security;
alter table public.daily_photos enable row level security;

insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', false)
on conflict (id) do update set public = false;

insert into public.trip_states (trip_id) values ('peniscola-2026') on conflict do nothing;

-- Sin políticas públicas: solo el servidor, mediante service_role, puede leer o escribir.
