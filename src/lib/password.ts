import { scryptSync, timingSafeEqual } from "node:crypto";

export function verifyPassword(password: string, salt: string, expectedHex: string) {
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
