import Database from "better-sqlite3";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync } from "node:crypto";
import { demoQuestions, demoUsers } from "./seed-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = process.env.DATABASE_PATH || join(projectRoot, "data", "app.db");
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(readFileSync(join(projectRoot, "db", "migrations", "001_initial.sql"), "utf8"));

const count = db.prepare("SELECT COUNT(*) AS count FROM profiles").get().count;
if (count === 0) {
  const seed = db.transaction(() => {
    db.prepare("INSERT INTO departments (id, school, group_name, department_name, code) VALUES (1, ?, ?, ?, ?)")
      .run("新北高工", "動力機械群", "汽車科", "automotive");
    db.prepare("INSERT INTO subjects (id, department_id, subject_name, curriculum_version) VALUES (1, 1, ?, ?)")
      .run("專業科目（一）", "108課綱");
    const insertUnit = db.prepare("INSERT INTO units (id, subject_id, unit_name) VALUES (?, 1, ?)");
    insertUnit.run(1, "應用力學");
    insertUnit.run(2, "引擎原理");
    insertUnit.run(3, "底盤原理");

    const insertUser = db.prepare(`
      INSERT INTO profiles (id, login_id, password_salt, password_hash, display_name, role, department_id, class_code)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);
    for (const user of demoUsers) {
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(user.password, salt, 64).toString("hex");
      insertUser.run(user.id, user.loginId, salt, hash, user.name, user.role, user.classCode);
    }

    const insertSource = db.prepare(`
      INSERT INTO source_documents (year, subject_id, url, filename, sha256, page_count, import_status, downloaded_at, note)
      VALUES (115, 1, ?, ?, ?, NULL, 'downloaded_pending_parse', '2026-11-11T23:00:00+08:00', ?)
    `);
    insertSource.run(
      "https://web1.tcte.edu.tw/EXAM/115_4y/downloader.php?obj=MTE1LTR5LTAyLTEucGRm",
      "115-4y-02-1-question.pdf",
      "3C446A138373A332246DC9075751016849BB494871F01D5094E0E67F3B807431",
      "官方試題 PDF；尚未擷取，須教師核對後才能發布。",
    );
    insertSource.run(
      "https://web1.tcte.edu.tw/EXAM/115_4y/downloader.php?obj=MTE1LTR5LTAyLTEtc3RhbmRhcmQucGRm",
      "115-4y-02-1-standard-answer.pdf",
      "6CC035DB443006AB217410B0608F6F4A7135C6568BDDB2B5F6EDD618F09CF7D2",
      "官方標準答案 PDF；須與題號逐題比對。",
    );

    const insertQuestion = db.prepare(`
      INSERT INTO questions
      (source_type, source_document_id, original_no, stem, options_json, answer, explanation, unit_id, difficulty, status, version, is_demo, source_label)
      VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `);
    for (const q of demoQuestions) {
      insertQuestion.run(q.sourceType, q.originalNo, q.stem, JSON.stringify(q.options), q.answer, q.explanation, q.unitId, q.difficulty, q.status, q.sourceLabel);
    }
  });
  seed();
  console.log(`已建立本機示範資料庫：${dbPath}`);
} else {
  console.log(`本機資料庫已存在（${count} 個帳號）：${dbPath}`);
}

db.close();
