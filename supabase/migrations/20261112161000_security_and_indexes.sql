-- 資料表不對 Data API 直接開放；以明確 deny-all RLS 政策保留第二道防線。
create policy deny_direct_access_departments on public.departments for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_profiles on public.profiles for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_subjects on public.subjects for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_units on public.units for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_source_documents on public.source_documents for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_questions on public.questions for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_question_reviews on public.question_reviews for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_exams on public.exams for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_attempts on public.attempts for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_responses on public.responses for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_audit_logs on public.audit_logs for all to anon, authenticated using (false) with check (false);
create policy deny_direct_access_sessions on public.sessions for all to anon, authenticated using (false) with check (false);

-- 內部輔助函式只供已檢查角色的 SECURITY DEFINER RPC 呼叫。
revoke execute on function public.request_session_token() from public, anon, authenticated;
revoke execute on function public.session_user_id() from public, anon, authenticated;
revoke execute on function public.assert_role(text[]) from public, anon, authenticated;
revoke execute on function public.build_public_questions(text,bigint,text,integer) from public, anon, authenticated;
-- Storage RLS 需要直接判斷工作階段角色，因此僅保留 anon 執行權。
revoke execute on function public.session_role() from public, authenticated;
grant execute on function public.session_role() to anon;

-- 外鍵查詢與刪除檢查索引。
create index idx_attempts_exam_id on public.attempts(exam_id);
create index idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index idx_exams_created_by on public.exams(created_by);
create index idx_exams_subject_id on public.exams(subject_id);
create index idx_profiles_department_id on public.profiles(department_id);
create index idx_question_reviews_question_id on public.question_reviews(question_id);
create index idx_question_reviews_reviewer_id on public.question_reviews(reviewer_id);
create index idx_questions_source_document_id on public.questions(source_document_id);
create index idx_questions_unit_id on public.questions(unit_id);
create index idx_responses_question_id on public.responses(question_id);
create index idx_sessions_user_id on public.sessions(user_id);
create index idx_source_documents_subject_id on public.source_documents(subject_id);
create index idx_subjects_department_id on public.subjects(department_id);
create index idx_units_parent_id on public.units(parent_id);
create index idx_units_subject_id on public.units(subject_id);

notify pgrst, 'reload schema';
