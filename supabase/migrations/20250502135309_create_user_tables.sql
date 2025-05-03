-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_cart table
create table if not exists public.user_cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  product_id text not null,
  quantity integer not null default 1,
  product_name text not null,
  product_price numeric not null,
  product_image_url text,
  product_brand text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Create user_wishlist table
create table if not exists public.user_wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  product_id text not null,
  product_name text not null,
  product_price numeric not null,
  product_image_url text,
  product_brand text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_cart enable row level security;
alter table public.user_wishlist enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view their own cart"
  on public.user_cart for select
  using (auth.uid() = user_id);

create policy "Users can manage their own cart"
  on public.user_cart for all
  using (auth.uid() = user_id);

create policy "Users can view their own wishlist"
  on public.user_wishlist for select
  using (auth.uid() = user_id);

create policy "Users can manage their own wishlist"
  on public.user_wishlist for all
  using (auth.uid() = user_id);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_cart_updated_at
  before update on public.user_cart
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_wishlist_updated_at
  before update on public.user_wishlist
  for each row
  execute function public.handle_updated_at();
