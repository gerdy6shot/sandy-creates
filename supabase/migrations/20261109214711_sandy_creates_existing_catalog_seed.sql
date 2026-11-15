
-- Seed exactly the three already-shown Spice Gurl products, not speculative inventory.
-- Existing public preorder prices: SofriDOBO $12, Sol Shine $10, Yardie Glaze $14.
insert into public.products(slug,name,category,short_description,description,ingredients,allergens,storage,published,featured,shipping,pickup,approved_for_sale)
values
('sofridobo','SofriDOBO','Blends','Complete seasoning.','Spice Gurl complete seasoning. Sizes and ingredients will be confirmed by Sandy.','Awaiting verified ingredient information.','Allergen information awaiting confirmation.','Storage instructions awaiting confirmation.',true,true,false,false,false),
('sol-shine','Sol Shine','Sauces','Passionfruit–habanero hot sauce.','Spice Gurl passionfruit–habanero hot sauce. Sizes and ingredients will be confirmed by Sandy.','Awaiting verified ingredient information.','Allergen information awaiting confirmation.','Storage instructions awaiting confirmation.',true,true,false,false,false),
('yardie-glaze','Yardie Glaze','Sauces','Jerk tamarind BBQ.','Spice Gurl jerk tamarind BBQ sauce. Sizes and ingredients will be confirmed by Sandy.','Awaiting verified ingredient information.','Allergen information awaiting confirmation.','Storage instructions awaiting confirmation.',true,true,false,false,false)
on conflict (slug) do nothing;

insert into public.product_variants(product_id,size,sku,price,inventory,active)
select p.id,'Size to be confirmed',v.sku,v.price,0,true
from (values
('sofridobo','SANDY-SOFRIDOBO',1200),
('sol-shine','SANDY-SOL-SHINE',1000),
('yardie-glaze','SANDY-YARDIE-GLAZE',1400)
) as v(slug,sku,price) join public.products p using(slug)
on conflict(sku) do nothing;

insert into public.product_images(product_id,path,alt,position)
select p.id,v.path,v.alt,0 from
(values
('sofridobo','/images/products/sofridobo.jpg','Original Spice Gurl SofriDOBO bottle photograph'),
('sol-shine','/images/products/sol-shine.jpg','Original Spice Gurl Sol Shine bottle photograph'),
('yardie-glaze','/images/products/yardie-glaze.jpg','Original Spice Gurl Yardie Glaze bottle photograph')
) as v(slug,path,alt) join public.products p using(slug);

insert into public.site_content(key,value,published) values
('heroTitle',to_jsonb('Food. Flavor.' || chr(10) || 'Culture. Lifestyle.'::text),true),
('heroIntro',to_jsonb('Where bold flavors, Caribbean soul, and modern culinary creativity come together.'::text),true),
('story',to_jsonb('SAN D CREATES brings food, culture and creativity together in one personal space. Explore Spice Gurl, discover ideas from the kitchen, and leave room for what comes next.'::text),true),
('philosophy',to_jsonb('A thoughtful ingredient. A generous table. A little room for creativity. Good things begin with care, and become even better when they’re shared.'::text),true)
on conflict(key) do nothing;

