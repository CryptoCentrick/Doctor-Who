CREATE TABLE IF NOT EXISTS local_biometric_cache (
  id TEXT PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  synced INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS local_reports (
  id TEXT PRIMARY KEY,
  module_type TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  score INTEGER NOT NULL,
  payload TEXT NOT NULL
);
