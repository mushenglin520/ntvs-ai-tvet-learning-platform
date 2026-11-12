-- 先在子查詢完成各組統計，再彙整成 JSON，避免 PostgreSQL 42803
-- （jsonb_agg 不能直接包住 count / avg 等聚合函式）。
create or replace function public.teacher_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.assert_role(array['teacher','admin']);

  return jsonb_build_object(
    'units', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'unitName', unit_stats.unit_name,
          'total', unit_stats.total,
          'correct', unit_stats.correct
        )
        order by unit_stats.unit_id
      )
      from (
        select
          u.id as unit_id,
          u.unit_name,
          count(r.id)::integer as total,
          (count(r.id) filter (where r.is_correct))::integer as correct
        from public.units u
        left join public.questions q on q.unit_id = u.id
        left join public.responses r on r.question_id = q.id
        group by u.id, u.unit_name
      ) as unit_stats
    ), '[]'::jsonb),
    'students', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'name', student_stats.display_name,
          'classCode', student_stats.class_code,
          'attempts', student_stats.attempts,
          'average', student_stats.average
        )
        order by student_stats.student_id
      )
      from (
        select
          p.id as student_id,
          p.display_name,
          p.class_code,
          count(a.id)::integer as attempts,
          coalesce(round(avg(a.score)), 0)::integer as average
        from public.profiles p
        left join public.attempts a
          on a.student_id = p.id
          and a.submitted_at is not null
        where p.role = 'student'
        group by p.id, p.display_name, p.class_code
      ) as student_stats
    ), '[]'::jsonb)
  );
end;
$$;

-- 維持既有資料存取設計：前端使用 publishable key，函式內再驗證 HttpOnly 工作階段與角色。
revoke execute on function public.teacher_analytics() from public, authenticated;
grant execute on function public.teacher_analytics() to anon;

notify pgrst, 'reload schema';
