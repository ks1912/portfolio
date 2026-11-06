-- Portfolio backend schema. Apply once to a fresh Supabase project.

-- ---------- Content ----------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[] not null default '{}',
  url text,
  repo text,
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  subject text check (char_length(subject) <= 200),
  body text not null check (char_length(body) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) <= 300),
  referrer text check (char_length(referrer) <= 300),
  created_at timestamptz not null default now()
);

-- Emails allowed into /admin
create table public.admin_emails (email text primary key);
insert into public.admin_emails values ('kunalsingh886312@gmail.com');

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.view_count() returns bigint
language sql stable security definer set search_path = '' as $$
  select count(*) from public.page_views;
$$;

create or replace function public.views_by_day(days int default 14)
returns table(day date, views bigint)
language sql stable security definer set search_path = '' as $$
  select d::date, count(v.id)
  from generate_series(current_date - (days - 1), current_date, interval '1 day') d
  left join public.page_views v on v.created_at::date = d::date
  where public.is_admin()
  group by d order by d;
$$;

alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.messages enable row level security;
alter table public.page_views enable row level security;
alter table public.admin_emails enable row level security;

create policy "projects public read" on public.projects for select using (true);
create policy "projects admin write" on public.projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "posts public read published" on public.posts for select
  using (published or public.is_admin());
create policy "posts admin write" on public.posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "messages anyone insert" on public.messages for insert
  to anon, authenticated with check (true);
create policy "messages admin read" on public.messages for select to authenticated
  using (public.is_admin());
create policy "messages admin update" on public.messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "messages admin delete" on public.messages for delete to authenticated
  using (public.is_admin());

create policy "views anyone insert" on public.page_views for insert
  to anon, authenticated with check (true);
create policy "views admin read" on public.page_views for select to authenticated
  using (public.is_admin());

-- ---------- Live collaborative coding ----------
create table public.collab_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  language text not null default 'javascript',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collab_members (
  session_id uuid not null references public.collab_sessions(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (session_id, email)
);

create or replace function public.is_session_owner(sid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.collab_sessions s where s.id = sid and s.owner_id = auth.uid());
$$;

create or replace function public.can_access_session(sid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_session_owner(sid) or exists (
    select 1 from public.collab_members m
    where m.session_id = sid
      and lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.collab_sessions enable row level security;
alter table public.collab_members enable row level security;

create policy "sessions read" on public.collab_sessions for select to authenticated
  using (owner_id = (select auth.uid()) or public.can_access_session(id));
create policy "sessions create" on public.collab_sessions for insert to authenticated
  with check (owner_id = auth.uid());
create policy "sessions update" on public.collab_sessions for update to authenticated
  using (public.can_access_session(id)) with check (public.can_access_session(id));
create policy "sessions delete" on public.collab_sessions for delete to authenticated
  using (owner_id = auth.uid());

create policy "members read" on public.collab_members for select to authenticated
  using (public.can_access_session(session_id));
create policy "members owner add" on public.collab_members for insert to authenticated
  with check (public.is_session_owner(session_id));
create policy "members owner remove" on public.collab_members for delete to authenticated
  using (public.is_session_owner(session_id));

-- Realtime Authorization: only owner/invited members can join a session's private channel.
create policy "collab realtime read" on realtime.messages for select to authenticated
  using (
    realtime.topic() ~ '^collab:[0-9a-f-]{36}$'
    and public.can_access_session(substring(realtime.topic() from 8)::uuid)
  );
create policy "collab realtime write" on realtime.messages for insert to authenticated
  with check (
    realtime.topic() ~ '^collab:[0-9a-f-]{36}$'
    and public.can_access_session(substring(realtime.topic() from 8)::uuid)
  );

-- ---------- Seed content ----------
insert into public.projects (title, description, tags, featured, sort) values
('Healthcare Automation & Microservices (Modmed)', 'Led a QA team of 3. Moved testing from a monolith to microservices, ran infrastructure with Helm charts and Terraform, and performed advanced SQL testing and WCAG accessibility audits on Klara and EMA.', '{Healthcare,Microservices,Helm,Terraform,SQL Testing,WCAG}', true, 1),
('E-Commerce Enterprise Framework (Feuji)', 'Playwright and Cypress automation for enterprise products such as InsightsFirst and AnalyticsApp, with Allure and Report Portal wired into CI/CD to cut manual effort.', '{E-Commerce,Playwright,Cypress,CI/CD,Allure,Report Portal}', true, 2),
('Banking & Fintech QA (IDRBT – RBI)', 'Selenium WebDriver UI frameworks for payment gateway flows, plus API testing with Rest Assured and SOAP UI for government financial systems.', '{BFSI,Selenium,Rest Assured,SOAP UI}', true, 3),
('Internal Test API Platform', 'Test APIs that generate data, mock environments and stabilise automation runs, which makes suites faster and far less flaky.', '{Ruby on Rails,Sidekiq,RabbitMQ,PostgreSQL}', false, 4),
('Load & Performance Harness', 'K6 and Locust scenarios for realistic traffic, monitored through Datadog during runs to catch regressions before production.', '{K6,Locust,Datadog}', false, 5);
