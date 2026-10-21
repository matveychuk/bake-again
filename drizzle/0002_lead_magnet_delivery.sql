CREATE TABLE IF NOT EXISTS lead_magnet_requests (
  id TEXT PRIMARY KEY NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  dedupe_key TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  magnet TEXT NOT NULL CHECK (magnet IN ('shokolad', 'mlyntsi')),
  network_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'awaiting_confirmation', 'delivering', 'sent', 'failed')),
  sending_at INTEGER,
  attempted_at INTEGER,
  sent_at INTEGER
);
CREATE INDEX IF NOT EXISTS lead_magnet_network_created ON lead_magnet_requests(network_key, created_at);
CREATE INDEX IF NOT EXISTS lead_magnet_email_created ON lead_magnet_requests(email, created_at);
