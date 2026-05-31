-- Run this in your Supabase project → SQL editor

create table if not exists hotel_analyses (
  id          uuid        default gen_random_uuid() primary key,
  query_key   text        unique not null,
  result      jsonb       not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-update updated_at on every write
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger hotel_analyses_updated_at
  before update on hotel_analyses
  for each row execute procedure update_updated_at();

-- Fast lookup by normalised hotel name
create index if not exists hotel_analyses_query_key_idx
  on hotel_analyses (query_key);

-- Only the server (service role key) can read/write — no public access
alter table hotel_analyses enable row level security;
