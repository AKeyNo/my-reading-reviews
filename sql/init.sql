-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for read list of users
create table read_list (
    book_id not null,
    user_id uuid references auth.users not null,
    pages_read smallint DEFAULT 0,
    score numeric DEFAULT 0,
    status text DEFAULT 'Reading',
    review text,
    review_post_time timestamptz,
    favorite boolean DEFAULT false,
    notes text,
    start_date timestamptz,
    end_date timestamptz,
    times_read smallint DEFAULT 0,

    primary key (book_id, user_id),
    constraint pages_read_check check (pages_read >= 0),
    constraint score_check check (score >= 0 and score <= 10),
    constraint status_check check (status in ('Reading', 'Planning to Read', 'Completed', 'Paused', 'Dropped')),
    constraint times_read_check check (times_read >= 0)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

alter table read_list
  enable row level security;

create policy "Read lists are viewable by everyone." on read_list
  for select using (true);

create policy "Users can create entries for their own book list" on read_list
  for insert using (uid() = user_id);

create policy "Users can edit their own book list" on read_list
  for update using (uid() = user_id);


-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
declare
  new_username varchar(50) := new.raw_user_meta_data->>'username';
begin
  if exists (select username from public.profiles where username=new_username) then
    raise exception 'Username "%" is already taken!', new_username;
  else
    insert into public.profiles (id, username)
    values (new.id, new_username);
    return new;
  end if;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');