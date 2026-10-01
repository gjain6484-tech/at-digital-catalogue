create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  price numeric(12,2),
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
on public.products for select
to authenticated
using (auth.uid() is not null);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (auth.uid() is not null);
