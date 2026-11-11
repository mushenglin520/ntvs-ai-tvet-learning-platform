import { existsSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = process.env.DATABASE_PATH || join(projectRoot, "data", "app.db");
for (const suffix of ["", "-shm", "-wal"]) {
  const target = `${dbPath}${suffix}`;
  if (existsSync(target)) unlinkSync(target);
}
const result = spawnSync(process.execPath, [join(projectRoot, "scripts", "init-db.mjs")], { stdio: "inherit" });
process.exit(result.status ?? 1);
