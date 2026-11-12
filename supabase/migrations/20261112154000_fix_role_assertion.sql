create or replace function public.assert_role(allowed_roles text[])
returns bigint language plpgsql stable security definer set search_path = public as $$
declare
  uid bigint := public.session_user_id();
  v_role text := public.session_role();
begin
  if uid is null then raise exception '尚未登入' using errcode = '28000'; end if;
  if not (v_role = any(allowed_roles)) then raise exception '權限不足' using errcode = '42501'; end if;
  return uid;
end;
$$;

revoke execute on function public.assert_role(text[]) from public, anon, authenticated;
notify pgrst, 'reload schema';
