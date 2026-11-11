export type Role = "admin" | "teacher" | "student";
export type SourceType = "official" | "ai";
export type Difficulty = "基礎" | "進階" | "挑戰";

export interface UserSession {
  id: number;
  loginId: string;
  displayName: string;
  role: Role;
  classCode: string | null;
}

export interface PublicQuestion {
  id: number;
  stem: string;
  options: Record<string, string>;
  unitName: string;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceLabel: string;
}
