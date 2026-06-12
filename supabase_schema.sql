-- ==========================================
-- SUPABASE SCHEMATIC DATABASE SETUP SCRIPT
-- ==========================================

-- 1. Create Profiles Table (Syncs with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text default 'client'::text check (role in ('client'::text, 'admin'::text)),
  welcome_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 2. Create Payments Table (Manual Payments Tracker)
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  amount numeric not null,
  utr_id text unique not null,
  screenshot_url text not null,
  plan_name text not null,
  plan_category text not null,
  status text default 'pending'::text check (status in ('pending'::text, 'approved'::text, 'rejected'::text)),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Payments
alter table public.payments enable row level security;

-- 3. Create Messages Table (Support Ticket & Inquiries)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  service text not null,
  message text not null,
  status text default 'Open'::text check (status in ('Open'::text, 'Under Review'::text, 'Resolved'::text)),
  admin_reply text,
  reply_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Messages
alter table public.messages enable row level security;


-- 4. Create Appointments Table (Scheduled Calls)
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  notes text default '',
  service text not null,
  appointment_date timestamp with time zone not null,
  appointment_time text not null,
  platform text default 'google-meet',
  status text default 'pending'::text check (status in ('pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text)),
  admin_notes text,
  meeting_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Appointments
alter table public.appointments enable row level security;

-- Appointments Policies
create policy "Anyone can insert appointments" on public.appointments
  for insert with check (true);

create policy "Users can view own appointments" on public.appointments
  for select using (email = (auth.jwt() ->> 'email'));

create policy "Admins can manage all appointments" on public.appointments
  for all using (public.is_admin());


-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Helper function to check if current auth user is an admin without recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view and edit all profiles" on public.profiles
  for all using (public.is_admin());

-- Payments Policies
create policy "Users can view own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Users can insert payments" on public.payments
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all payments" on public.payments
  for all using (public.is_admin());

-- Messages Policies
create policy "Users can view own messages" on public.messages
  for select using (auth.uid() = user_id or email = (auth.jwt() ->> 'email'));

create policy "Users can insert messages" on public.messages
  for insert with check (true); -- Allow guest/authenticated forms

create policy "Admins can manage all messages" on public.messages
  for all using (public.is_admin());


-- ==========================================
-- SYNC TRIGGERS (auth.users -> public.profiles)
-- ==========================================

-- Function to handle auth user inserts
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Valued Client'),
    new.email,
    case
      when new.email = 'admin@novacraft.digital' then 'admin' -- seed default admin
      else 'client'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- AUTO UPDATE UPDATED_AT COLUMN
-- ==========================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_payment_updated
  before update on public.payments
  for each row execute procedure public.set_updated_at();
