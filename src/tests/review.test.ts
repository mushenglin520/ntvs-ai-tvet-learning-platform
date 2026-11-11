import { describe,expect,it } from "vitest";
import { validateReview } from "@/lib/review";

describe("教師審題規則",()=>{
  it("接受三種明確決定",()=>{expect(validateReview("approved","答案已核對")).toBe("approved");expect(validateReview("returned","解析需補充")).toBe("returned");expect(validateReview("rejected","題意不清")).toBe("rejected")});
  it("拒絕空白備註與未知狀態",()=>{expect(()=>validateReview("approved"," ")).toThrow();expect(()=>validateReview("publish","同意")).toThrow()});
});
