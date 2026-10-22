-- Prepared migration for a NEW Sandy Creates Supabase project. Not applied remotely.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;
create table private.admin_roles (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
alter table private.admin_roles enable row level security;
-- No public membership write path. Owner provisions explicit UUIDs through trusted SQL.
create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from private.admin_roles where user_id = auth.uid());
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text not null check(length(display_name)<=120));
create table public.products (
 id uuid primary key default gen_random_uuid(), slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 name text not null check(length(name) between 1 and 200), category text not null check(category in ('Blends','Sauces','Collections')),
 short_description text not null default '', description text not null default '', ingredients text not null default '', allergens text not null default '', storage text not null default '',
 published boolean not null default false, featured boolean not null default false, shipping boolean not null default false, pickup boolean not null default false,
 approved_for_sale boolean not null default false, created_at timestamptz not null default now()
);
create table public.product_variants (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 size text not null, sku text not null unique, price integer not null check(price>0), currency text not null default 'usd' check(currency='usd'), inventory integer not null default 0 check(inventory>=0), active boolean not null default true
);
create index variants_product_idx on public.product_variants(product_id);
create table public.product_images (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, path text not null, alt text not null check(length(alt) between 1 and 300), position integer not null default 0);
create table public.events (id uuid primary key default gen_random_uuid(),slug text not null unique,title text not null,description text not null default '',start_at timestamptz,end_at timestamptz,timezone text not null default 'America/New_York',location text,disclose_location boolean not null default false,published boolean not null default false,image_path text,check(end_at is null or end_at>start_at));
create table public.site_content (key text primary key, value jsonb not null, published boolean not null default false);
create table public.availability (id boolean primary key default true check(id), retail_paused boolean not null default true, culinary_paused boolean not null default true, timezone text not null default 'America/New_York', lead_days integer not null default 3 check(lead_days>=0), daily_capacity integer not null default 0 check(daily_capacity>=0),blocked_dates date[] not null default '{}',pickup_windows jsonb not null default '[]',message text not null default 'Ordering is not open.');
insert into public.availability(id) values(true);
-- Culinary checkout is intentionally disabled until approved schedules, menus and capacity rules exist.
create table public.orders (
 id uuid primary key default gen_random_uuid(), customer_email text not null check(length(customer_email)<=254), total integer not null check(total>0), currency text not null default 'usd' check(currency='usd'),
 payment_status text not null default 'pending' check(payment_status in ('pending','paid','expired','failed')), fulfillment_status text not null default 'unfulfilled' check(fulfillment_status in ('unfulfilled','processing','ready','shipped','completed','canceled','needs_review')),
 fulfillment text not null check(fulfillment in ('pickup','shipping')), stripe_session_id text unique, expires_at timestamptz not null, created_at timestamptz not null default now()
);
create table public.order_items (id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),variant_id uuid not null references public.product_variants(id),product_name text not null,variant_name text not null,unit_price integer not null check(unit_price>0),quantity integer not null check(quantity between 1 and 99));
create index order_items_order_idx on public.order_items(order_id);
create table public.inventory_reservations (order_id uuid not null references public.orders(id),variant_id uuid not null references public.product_variants(id),quantity integer not null check(quantity>0),status text not null default 'held' check(status in ('held','committed','released')),expires_at timestamptz not null,primary key(order_id,variant_id));
create index reservations_expiry_idx on public.inventory_reservations(expires_at) where status='held';
create table public.inquiries (id uuid primary key default gen_random_uuid(),name text not null check(length(name) between 1 and 120),email text not null check(length(email)<=254),phone text check(length(phone)<=40),category text not null check(category in ('General','Product or order support','Culinary or platter request','Event collaboration','Wholesale or retail partnership','Media or business opportunity')),message text not null check(length(message) between 10 and 4000),order_reference text check(length(order_reference)<=80),event_date date,guests integer check(guests between 1 and 10000),marketing_consent boolean not null default false,consent_recorded_at timestamptz, status text not null default 'New' check(status in ('New','In progress','Closed')),private_notes text not null default '',created_at timestamptz not null default now());
create table public.notification_jobs (id uuid primary key default gen_random_uuid(),kind text not null check(kind in ('inquiry_admin','inquiry_ack','order_admin','order_ack')),inquiry_id uuid references public.inquiries(id),order_id uuid references public.orders(id),status text not null default 'pending' check(status in ('pending','sending','sent','failed')),attempts integer not null default 0,last_error text,locked_until timestamptz,created_at timestamptz not null default now(),unique(kind,inquiry_id),unique(kind,order_id));
create table public.processed_payment_events (event_id text primary key,order_id uuid not null references public.orders(id),created_at timestamptz not null default now());
create table private.rate_limits (key text primary key,window_start timestamptz not null,count integer not null check(count>0));
alter table private.rate_limits enable row level security;

-- Default grants vary across Supabase projects: explicitly revoke and regrant.
revoke all on all tables in schema public from anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['profiles','products','product_variants','product_images','events','site_content','availability','orders','order_items','inventory_reservations','inquiries','notification_jobs','processed_payment_events'] loop
 execute format('alter table public.%I enable row level security',t);
 end loop;
 foreach t in array array['products','product_variants','product_images','events','site_content','availability'] loop
 execute format('grant select on public.%I to anon,authenticated',t);
 end loop;
 foreach t in array array['products','product_variants','product_images','events','site_content','availability','inquiries','profiles'] loop
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 execute format('create policy admin_access on public.%I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))',t);
 end loop;
 foreach t in array array['orders','order_items','inventory_reservations','notification_jobs','processed_payment_events'] loop
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy admin_read on public.%I for select to authenticated using ((select private.is_admin()))',t);
 end loop;
end $$;
create policy published_products on public.products for select to anon,authenticated using(published);
create policy published_variants on public.product_variants for select to anon,authenticated using(active and exists(select 1 from public.products p where p.id=product_id and p.published));
create policy published_images on public.product_images for select to anon,authenticated using(exists(select 1 from public.products p where p.id=product_id and p.published));
-- Event locations are returned through server allowlists, never exposed through unrestricted public table reads.
revoke select on public.events from anon;
-- Public events must use the API’s field allowlist, including location-disclosure checks.
create policy published_content on public.site_content for select to anon,authenticated using(published);
create policy public_availability on public.availability for select to anon,authenticated using(true);
grant update(fulfillment_status) on public.orders to authenticated;
create policy admin_fulfillment on public.orders for update to authenticated using((select private.is_admin())) with check((select private.is_admin()));
-- Service role is server-only; these functions are security invoker, not definer.
grant all on all tables in schema public to service_role;
grant all on all tables in schema private to service_role;

create function public.consume_rate_limit(p_key text) returns boolean language plpgsql security invoker set search_path='' as $$
 declare hits integer; begin
 insert into private.rate_limits(key,window_start,count) values(p_key,now(),1)
 on conflict(key) do update set count=case when private.rate_limits.window_start<now()-interval '1 hour' then 1 else private.rate_limits.count+1 end,window_start=case when private.rate_limits.window_start<now()-interval '1 hour' then now() else private.rate_limits.window_start end returning count into hits;
 return hits<=5;
 end $$;
create function public.save_inquiry(p_data jsonb,p_email_enabled boolean default false) returns uuid language plpgsql security invoker set search_path='' as $$
 declare inquiry_id uuid;begin
 insert into public.inquiries(name,email,phone,category,message,order_reference,event_date,guests,marketing_consent,consent_recorded_at)
 values(trim(p_data->>'name'),lower(trim(p_data->>'email')),nullif(p_data->>'phone',''),p_data->>'category',trim(p_data->>'message'),nullif(p_data->>'orderReference',''),nullif(p_data->>'eventDate','')::date,nullif(p_data->>'guests','')::integer,coalesce((p_data->>'marketing')::boolean,false),case when (p_data->>'marketing')::boolean then now() end) returning id into inquiry_id;
 insert into public.notification_jobs(kind,inquiry_id) values('inquiry_admin',inquiry_id);
 if p_email_enabled then insert into public.notification_jobs(kind,inquiry_id) values('inquiry_ack',inquiry_id);end if;
 return inquiry_id;
 end $$;
create function public.release_expired_reservations() returns integer language plpgsql security invoker set search_path='' as $$
 declare r record; released integer=0;begin
 -- Lock orders first, consistently with payment finalization; no stock is released while checkout is valid.
 for r in select id from public.orders where payment_status='pending' and expires_at<now() order by id for update skip locked loop
 with freed as(update public.inventory_reservations set status='released' where order_id=r.id and status='held' returning variant_id,quantity)
 update public.product_variants v set inventory=v.inventory+freed.quantity from freed where v.id=freed.variant_id;
 update public.orders set payment_status='expired' where id=r.id;
 released=released+1;
 end loop;
 delete from private.rate_limits where window_start<now()-interval '2 days';
 return released;
 end $$;
create function public.reserve_retail_order(p_items jsonb,p_email text,p_fulfillment text) returns jsonb language plpgsql security invoker set search_path='' as $$
 declare item record; row_data record; v_order_id uuid=gen_random_uuid(); amount integer=0;deadline timestamptz=now()+interval '35 minutes'; result jsonb; begin
 if not jsonb_typeof(p_items)='array' or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>20 then raise exception 'Invalid cart';end if;
 if p_fulfillment not in ('pickup','shipping') or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid checkout details';end if;
 perform 1 from public.availability where id=true and retail_paused=false for share;
 if not found then raise exception 'Ordering paused';end if;
 -- Reject duplicate variant IDs rather than allowing fragmented requests to bypass limits.
 if (select count(*) from jsonb_array_elements(p_items))<>(select count(distinct x->>'variantId') from jsonb_array_elements(p_items) x) then raise exception 'Duplicate variant';end if;
 for item in select * from jsonb_to_recordset(p_items) as x("variantId" uuid,quantity integer) order by "variantId" loop
 if item.quantity is null or item.quantity not between 1 and 99 then raise exception 'Invalid quantity';end if;
 select v.*,p.name,p.published,p.approved_for_sale,p.pickup,p.shipping into row_data from public.product_variants v join public.products p on p.id=v.product_id where v.id=item."variantId" for update of v;
 if not found or not row_data.active or not row_data.published or not row_data.approved_for_sale or row_data.inventory<item.quantity then raise exception 'Item unavailable';end if;
 if (p_fulfillment='shipping' and not row_data.shipping) or (p_fulfillment='pickup' and not row_data.pickup) then raise exception 'Fulfillment unavailable';end if;
 amount=amount+row_data.price*item.quantity;
 end loop;
 insert into public.orders(id,customer_email,total,fulfillment,expires_at) values(v_order_id,lower(trim(p_email)),amount,p_fulfillment,deadline);
 for item in select * from jsonb_to_recordset(p_items) as x("variantId" uuid,quantity integer) order by "variantId" loop
 select v.*,p.name into row_data from public.product_variants v join public.products p on p.id=v.product_id where v.id=item."variantId";
 update public.product_variants set inventory=inventory-item.quantity where id=item."variantId";
 insert into public.order_items(order_id,variant_id,product_name,variant_name,unit_price,quantity) values(v_order_id,item."variantId",row_data.name,row_data.size,row_data.price,item.quantity);
 insert into public.inventory_reservations(order_id,variant_id,quantity,expires_at) values(v_order_id,item."variantId",item.quantity,deadline);
 end loop;
 select jsonb_build_object('id',v_order_id,'total',amount,'currency','usd','items',jsonb_agg(jsonb_build_object('name',product_name,'size',variant_name,'price',unit_price,'quantity',quantity))) into result from public.order_items where public.order_items.order_id=v_order_id;
 return result;
 end $$;
create function public.attach_checkout(p_order uuid,p_session text) returns void language plpgsql security invoker set search_path='' as $$
 begin update public.orders set stripe_session_id=p_session where id=p_order and stripe_session_id is null and payment_status='pending';if not found then raise exception 'Checkout cannot be attached';end if;end $$;
create function public.finalize_payment(p_event text,p_order uuid,p_session text,p_amount integer,p_currency text,p_email_enabled boolean default false) returns text language plpgsql security invoker set search_path='' as $$
 declare o public.orders;begin
 select * into o from public.orders where id=p_order for update;
 if not found or o.stripe_session_id is distinct from p_session then raise exception 'Session mismatch';end if;
 if exists(select 1 from public.processed_payment_events where event_id=p_event) then return 'duplicate';end if;
 if o.total<>p_amount or o.currency<>p_currency then raise exception 'Payment amount mismatch';end if;
 insert into public.processed_payment_events(event_id,order_id) values(p_event,p_order);
 if o.payment_status='paid' then return 'already_paid';end if;
 if o.payment_status<>'pending' or exists(select 1 from public.inventory_reservations where order_id=p_order and status='released') then
 update public.orders set payment_status='paid',fulfillment_status='needs_review' where id=p_order;
 else
 update public.orders set payment_status='paid' where id=p_order;
 update public.inventory_reservations set status='committed' where order_id=p_order and status='held';
 end if;
 insert into public.notification_jobs(kind,order_id) values('order_admin',p_order) on conflict do nothing;
 if p_email_enabled then insert into public.notification_jobs(kind,order_id) values('order_ack',p_order) on conflict do nothing;end if;
 return 'recorded';end $$;
create function public.claim_notification() returns setof public.notification_jobs language sql security invoker set search_path='' as $$
 update public.notification_jobs set status='sending',attempts=attempts+1,locked_until=now()+interval '5 minutes'
 where id=(select id from public.notification_jobs where attempts<3 and (status in ('pending','failed') or (status='sending' and locked_until<now())) order by created_at for update skip locked limit 1) returning *;
$$;
revoke all on function public.consume_rate_limit(text),public.save_inquiry(jsonb,boolean),public.release_expired_reservations(),public.reserve_retail_order(jsonb,text,text),public.attach_checkout(uuid,text),public.finalize_payment(text,uuid,text,integer,text,boolean),public.claim_notification() from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text),public.save_inquiry(jsonb,boolean),public.release_expired_reservations(),public.reserve_retail_order(jsonb,text,text),public.attach_checkout(uuid,text),public.finalize_payment(text,uuid,text,integer,text,boolean),public.claim_notification() to service_role;

-- Restricted upload bucket. The frontend demo stores only local sample images.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,2097152,array['image/jpeg','image/png','image/webp']);
create policy admin_image_upload on storage.objects for insert to authenticated with check(bucket_id='product-images' and (select private.is_admin()));
create policy admin_image_update on storage.objects for update to authenticated using(bucket_id='product-images' and (select private.is_admin())) with check(bucket_id='product-images' and (select private.is_admin()));
create policy admin_image_delete on storage.objects for delete to authenticated using(bucket_id='product-images' and (select private.is_admin()));
create policy product_image_read on storage.objects for select to authenticated using(bucket_id='product-images' and (select private.is_admin()));
-- Public bucket assets are public by URL. Never upload customer, family or private images here.

create function public.is_authorized_admin() returns boolean language sql stable security invoker set search_path='' as $$ select private.is_admin(); $$;
revoke all on function public.is_authorized_admin() from public,anon;
grant execute on function public.is_authorized_admin() to authenticated;
