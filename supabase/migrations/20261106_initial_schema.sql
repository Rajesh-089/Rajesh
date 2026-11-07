-- AgriGuide AI – Production Database Schema (PostgreSQL with Supabase)
-- Enable pgcrypto for UUID generation
create extension if not exists pgcrypto;

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    phone text,
    state text,
    district text,
    village text,
    preferred_language text not null default 'en' check (preferred_language in ('en', 'kn', 'hi')),
    farming_experience integer check (farming_experience >= 0),
    total_land_area numeric(12,2),
    land_measurement_unit text default 'acre' check (land_measurement_unit in ('acre', 'hectare', 'guntha', 'bigha')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. LANDS TABLE (Farms / Agricultural parcels)
create table if not exists public.lands (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    land_name text not null,
    area numeric(12,2) not null check (area > 0),
    area_unit text not null default 'acre' check (area_unit in ('acre', 'hectare', 'guntha', 'bigha')),
    state text not null,
    district text not null,
    village text,
    soil_type text,
    soil_ph numeric(4,2) check (soil_ph between 0 and 14),
    nitrogen numeric(12,2) check (nitrogen >= 0),
    phosphorus numeric(12,2) check (phosphorus >= 0),
    potassium numeric(12,2) check (potassium >= 0),
    soil_moisture numeric(5,2) check (soil_moisture between 0 and 100),
    irrigation_available boolean default false,
    previous_crop text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists lands_user_id_idx on public.lands(user_id);

-- 3. CROP CATALOGUE TABLE
create table if not exists public.crops (
    id uuid primary key default gen_random_uuid(),
    crop_name text not null unique,
    crop_category text not null,
    scientific_name text,
    suitable_soil_types text[],
    suitable_seasons text[],
    water_requirement text,
    growing_period_days integer,
    description text,
    created_at timestamptz not null default now()
);

-- 4. ADVISORY HISTORY TABLE
create table if not exists public.advisories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    land_id uuid references public.lands(id) on delete set null,
    advisory_type text not null check (
        advisory_type in (
            'crop',
            'fertilizer',
            'irrigation',
            'pest',
            'disease',
            'chat'
        )
    ),
    input_data jsonb not null,
    ai_response jsonb not null,
    language text default 'en',
    model_name text,
    created_at timestamptz not null default now()
);

create index if not exists advisories_user_id_idx on public.advisories(user_id);
create index if not exists advisories_created_at_idx on public.advisories(created_at desc);

-- 5. WEATHER RECORDS TABLE
create table if not exists public.weather_records (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    location_name text not null,
    temperature numeric(6,2),
    humidity numeric(5,2),
    rainfall numeric(8,2),
    wind_speed numeric(8,2),
    weather_description text,
    provider text,
    observed_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists weather_user_id_idx on public.weather_records(user_id);

-- 6. CHAT MESSAGES TABLE
create table if not exists public.chat_messages (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    conversation_id uuid not null,
    role text not null check (role in ('user', 'assistant')),
    content text not null,
    created_at timestamptz not null default now()
);

create index if not exists chat_user_conversation_idx on public.chat_messages(user_id, conversation_id);

-- 7. AUTOMATIC UPDATED_AT TRIGGER
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists lands_updated_at on public.lands;
create trigger lands_updated_at
before update on public.lands
for each row execute function public.set_updated_at();

-- 8. AUTOMATIC PROFILE CREATION ON USER SIGNUP TRIGGER
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, preferred_language)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'),
        coalesce(new.raw_user_meta_data->>'preferred_language', 'en')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.lands enable row level security;
alter table public.crops enable row level security;
alter table public.advisories enable row level security;
alter table public.weather_records enable row level security;
alter table public.chat_messages enable row level security;

-- PROFILES POLICIES
create policy "Users read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- LANDS POLICIES
create policy "Users read own lands"
on public.lands for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert own lands"
on public.lands for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update own lands"
on public.lands for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users delete own lands"
on public.lands for delete
to authenticated
using (auth.uid() = user_id);

-- CROP CATALOGUE POLICIES (Publicly readable by authenticated & anonymous users)
create policy "Anyone can read crops"
on public.crops for select
to authenticated, anon
using (true);

-- ADVISORY POLICIES
create policy "Users read own advisories"
on public.advisories for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert own advisories"
on public.advisories for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users delete own advisories"
on public.advisories for delete
to authenticated
using (auth.uid() = user_id);

-- WEATHER RECORDS POLICIES
create policy "Users read own weather records"
on public.weather_records for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert own weather records"
on public.weather_records for insert
to authenticated
with check (auth.uid() = user_id);

-- CHAT MESSAGES POLICIES
create policy "Users read own chat messages"
on public.chat_messages for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert own chat messages"
on public.chat_messages for insert
to authenticated
with check (auth.uid() = user_id);
