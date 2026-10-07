create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  sku text not null default '',
  price text not null default '',
  image_url text not null default '',
  specs jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read active" on public.products for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.products for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  phone1 text not null default '',
  phone2 text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin'));
insert into public.site_settings (id, phone1, phone2) values (1, '07736939153', '07736974035');

insert into public.products (handle,title,tagline,description,sku,price,image_url,specs,sort_order) values
('laavor-gloss-ultra','LaAvor Gloss Ultra','لمعان فائق مع طبقة استشفاء سريع للخدوش الدقيقة.','بكرة فيلم حماية طلاء TPU عالي اللمعان. شفافية كريستالية لا تغيّر لون الطلاء، استشفاء ذاتي للخدوش الدقيقة بالحرارة، ومقاومة اصفرار مضمونة لعشر سنوات.','PPF-GU-152','325,000 د.ع','/ppf-gloss.jpg','[{"label":"السماكة","value":"200µm"},{"label":"العرض","value":"1.52m"},{"label":"الطول","value":"15m"},{"label":"الضمان","value":"10 سنوات"}]',1),
('laavor-satin-matte','LaAvor Satin Matte','لمسة حريرية مطفيّة تمنح السيارة حضوراً راقياً.','بكرة فيلم حماية TPU بلمسة ساتان مطفية. تحوّل أي طلاء لامع إلى مظهر مخملي فاخر دون إعادة طلاء، مع حماية كاملة من الخدوش والحصى والأشعة فوق البنفسجية.','PPF-SM-152','360,000 د.ع','/ppf-matte.jpg','[{"label":"السماكة","value":"190µm"},{"label":"العرض","value":"1.52m"},{"label":"الطول","value":"15m"},{"label":"الضمان","value":"8 سنوات"}]',2),
('laavor-self-heal-pro','LaAvor Self-Heal Pro','أداء احترافي للصالونات مع مرونة قصّ عالية.','الفئة الاحترافية من LaAvor: طبقة TPU متقدمة باستشفاء ذاتي فائق السرعة ومرونة عالية تسهّل التركيب على الانحناءات المعقدة.','PPF-SHP-152','410,000 د.ع','/ppf-pro.jpg','[{"label":"السماكة","value":"210µm"},{"label":"العرض","value":"1.52m"},{"label":"الطول","value":"15m"},{"label":"الضمان","value":"10 سنوات"}]',3);

create policy "read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));