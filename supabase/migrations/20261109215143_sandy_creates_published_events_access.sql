-- Public events reveal only approved event copy and dates; never private location details.
grant select (id,slug,title,description,start_at,end_at,timezone,published,image_path) on public.events to anon;
create policy published_events on public.events for select to anon using (published);

