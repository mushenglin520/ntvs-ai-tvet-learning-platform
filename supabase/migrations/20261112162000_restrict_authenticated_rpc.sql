-- 本版只使用 publishable key + 自訂 HttpOnly 工作階段；未採 Supabase Auth JWT。
-- 因此 authenticated 角色不需要任何 RPC 執行權，避免形成第二條未檢查的路徑。
revoke execute on all functions in schema public from public, authenticated;

-- 還原應用程式所需的 anon RPC（每個函式內都會驗證工作階段與角色）。
grant execute on function public.login_user(text,text) to anon;
grant execute on function public.logout_user() to anon;
grant execute on function public.get_current_user() to anon;
grant execute on function public.list_units() to anon;
grant execute on function public.start_exam(text,text,bigint,text,integer) to anon;
grant execute on function public.answer_practice(bigint,bigint,text) to anon;
grant execute on function public.finish_practice(bigint) to anon;
grant execute on function public.submit_mock(bigint,jsonb) to anon;
grant execute on function public.student_dashboard() to anon;
grant execute on function public.student_results() to anon;
grant execute on function public.teacher_dashboard() to anon;
grant execute on function public.teacher_review_queue() to anon;
grant execute on function public.teacher_questions() to anon;
grant execute on function public.teacher_sources() to anon;
grant execute on function public.teacher_analytics() to anon;
grant execute on function public.review_question(bigint,text,text) to anon;
grant execute on function public.import_source_document(integer,text,text,text,text,text,jsonb) to anon;
grant execute on function public.session_role() to anon;

notify pgrst, 'reload schema';
