create or replace function public.login_user(p_login_id text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  p public.profiles;
  new_token uuid := extensions.gen_random_uuid();
  v_expires_at timestamptz := now() + interval '8 hours';
begin
  select * into p from public.profiles where login_id = trim(p_login_id) limit 1;
  if p.id is null or p.password_hash <> extensions.crypt(p_password, p.password_hash) then
    raise exception '帳號或密碼不正確' using errcode = '28000';
  end if;
  delete from public.sessions s where s.expires_at <= now();
  insert into public.sessions(token, user_id, expires_at) values (new_token, p.id, v_expires_at);
  return jsonb_build_object('token', new_token, 'expiresAt', v_expires_at, 'role', p.role);
end;
$$;

revoke execute on function public.login_user(text,text) from public, authenticated;
grant execute on function public.login_user(text,text) to anon;
notify pgrst, 'reload schema';
