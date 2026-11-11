PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY,
  school TEXT NOT NULL,
  group_name TEXT NOT NULL,
  department_name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY,
  login_id TEXT NOT NULL UNIQUE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  department_id INTEGER NOT NULL REFERENCES departments(id),
  class_code TEXT
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  subject_name TEXT NOT NULL,
  curriculum_version TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  unit_name TEXT NOT NULL,
  parent_id INTEGER REFERENCES units(id)
);

CREATE TABLE IF NOT EXISTS source_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  sha256 TEXT,
  page_count INTEGER,
  import_status TEXT NOT NULL,
  downloaded_at TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL CHECK (source_type IN ('official', 'ai')),
  source_document_id INTEGER REFERENCES source_documents(id),
  original_no TEXT,
  stem TEXT NOT NULL,
  options_json TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  unit_id INTEGER NOT NULL REFERENCES units(id),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('基礎', '進階', '挑戰')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'returned', 'rejected')),
  version INTEGER NOT NULL DEFAULT 1,
  is_demo INTEGER NOT NULL DEFAULT 1,
  source_label TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  reviewer_id INTEGER NOT NULL REFERENCES profiles(id),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'returned', 'rejected')),
  note TEXT NOT NULL,
  reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'mock')),
  source_type TEXT NOT NULL CHECK (source_type IN ('official', 'ai', 'mixed')),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  settings_json TEXT NOT NULL,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  student_id INTEGER NOT NULL REFERENCES profiles(id),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  score REAL,
  duration_sec INTEGER
);

CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL REFERENCES attempts(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  selected_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id INTEGER NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES profiles(id),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_student_bank ON questions(status, source_type, unit_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_responses_attempt ON responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
