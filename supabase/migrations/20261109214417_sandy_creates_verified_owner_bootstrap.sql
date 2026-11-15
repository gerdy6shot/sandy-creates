-- Owner access is granted only after Supabase Auth has verified the configured email.
-- No shared passwords, browser metadata, or service role tokens authorize access.
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
  select 1 from private.admin_roles roles
  join auth.users users on users.id=roles.user_id
  where roles.user_id = auth.uid()
    and lower(users.email) = 'becomeunfazed@gmail.com'
    and users.email_confirmed_at is not null
 );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create function private.provision_sandy_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if lower(new.email) = 'becomeunfazed@gmail.com' and new.email_confirmed_at is not null then
  insert into private.admin_roles(user_id) values(new.id) on conflict(user_id) do nothing;
 end if;
 return new;
end;
$$;
revoke all on function private.provision_sandy_owner() from public, anon, authenticated;
create trigger provision_sandy_owner_on_verified_email
 after insert or update of email, email_confirmed_at on auth.users
 for each row execute function private.provision_sandy_owner();
insert into private.admin_roles(user_id)
 select id from auth.users
 where lower(email)='becomeunfazed@gmail.com' and email_confirmed_at is not null
on conflict(user_id) do nothing;
