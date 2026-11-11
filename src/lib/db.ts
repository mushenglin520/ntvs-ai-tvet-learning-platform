import Database from "better-sqlite3";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "app.db");

const globalForDb = globalThis as unknown as { tvetDb?: Database.Database };

export const db = globalForDb.tvetDb ?? new Database(dbPath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

if (process.env.NODE_ENV !== "production") globalForDb.tvetDb = db;
