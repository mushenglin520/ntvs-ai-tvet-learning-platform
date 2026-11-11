export type ReviewDecision = "approved" | "returned" | "rejected";

export function validateReview(decision: string, note: string): ReviewDecision {
  if (!["approved", "returned", "rejected"].includes(decision)) {
    throw new Error("審核決定不正確");
  }
  if (note.trim().length < 2) throw new Error("請填寫至少 2 個字的審核備註");
  return decision as ReviewDecision;
}
