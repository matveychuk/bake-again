-- Product membership is validated against the deployed public registry by the
-- server. Keep a structural ID constraint here so a new product needs no DDL.
-- Rebuild preserves every pending confirmation, delivery identity and timestamp.
CREATE TABLE lead_magnet_requests_next (
  id TEXT PRIMARY KEY NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  dedupe_key TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  magnet TEXT NOT NULL CHECK (
    length(magnet) BETWEEN 1 AND 64
    AND substr(magnet, 1, 1) GLOB '[a-z]'
    AND magnet NOT GLOB '*[^a-z0-9-]*'
    AND magnet NOT IN ('constructor', 'prototype')
  ),
  network_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'awaiting_confirmation', 'delivering', 'sent', 'failed')),
  sending_at INTEGER,
  attempted_at INTEGER,
  sent_at INTEGER
);
INSERT INTO lead_magnet_requests_next
  (id, token_hash, dedupe_key, email, magnet, network_key, created_at, expires_at, status, sending_at, attempted_at, sent_at)
SELECT id, token_hash, dedupe_key, email, magnet, network_key, created_at, expires_at, status, sending_at, attempted_at, sent_at
FROM lead_magnet_requests;
DROP TABLE lead_magnet_requests;
ALTER TABLE lead_magnet_requests_next RENAME TO lead_magnet_requests;
CREATE INDEX lead_magnet_network_created ON lead_magnet_requests(network_key, created_at);
CREATE INDEX lead_magnet_email_created ON lead_magnet_requests(email, created_at);
