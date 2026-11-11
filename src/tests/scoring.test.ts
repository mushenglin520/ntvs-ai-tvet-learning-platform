import { describe,expect,it } from "vitest";
import { calculateScore,isCorrectAnswer } from "@/lib/scoring";

describe("評分規則",()=>{
  it("依答對題數換算百分制",()=>{expect(calculateScore(4,5)).toBe(80);expect(calculateScore(0,0)).toBe(0)});
  it("答案比較會忽略大小寫與前後空白",()=>{expect(isCorrectAnswer(" a ","A")).toBe(true);expect(isCorrectAnswer("B","A")).toBe(false)});
});
