import { db } from "@/lib/db";
import type { PublicQuestion, SourceType } from "@/lib/types";

type QuestionRow = {
  id: number; stem: string; options_json: string; unitName: string; difficulty: PublicQuestion["difficulty"];
  source_type: SourceType; source_label: string;
};

export function selectPublishedQuestions(sourceType: SourceType, unitId: number | null, difficulty: string | null, count: number) {
  const filters = ["q.status = 'approved'", "q.source_type = ?"];
  const params: Array<string | number> = [sourceType];
  if (unitId) { filters.push("q.unit_id = ?"); params.push(unitId); }
  if (difficulty) { filters.push("q.difficulty = ?"); params.push(difficulty); }
  params.push(count);
  const rows = db.prepare(`
    SELECT q.id, q.stem, q.options_json, u.unit_name AS unitName, q.difficulty, q.source_type, q.source_label
    FROM questions q JOIN units u ON u.id = q.unit_id
    WHERE ${filters.join(" AND ")}
    ORDER BY RANDOM() LIMIT ?
  `).all(...params) as QuestionRow[];
  return rows.map((row) => ({ id: row.id, stem: row.stem, options: JSON.parse(row.options_json), unitName: row.unitName, difficulty: row.difficulty, sourceType: row.source_type, sourceLabel: row.source_label } satisfies PublicQuestion));
}
