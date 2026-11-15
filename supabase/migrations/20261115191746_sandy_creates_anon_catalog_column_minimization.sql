-- Restrict anonymous reads to public storefront fields.
-- All anonymous policies remain read-only and restricted to published rows.
revoke select on public.products,public.product_variants,public.product_images,public.site_content,public.availability from anon;
grant select(id,slug,name,category,short_description,description,ingredients,allergens,storage,published,featured) on public.products to anon;
grant select(id,product_id,size,price,active) on public.product_variants to anon;
grant select(id,product_id,path,alt,position) on public.product_images to anon;
grant select(key,value,published) on public.site_content to anon;
grant select(id,retail_paused,culinary_paused,timezone,daily_capacity,lead_days,blocked_dates,pickup_windows,message) on public.availability to anon;

