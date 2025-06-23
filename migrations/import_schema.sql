-- migrations/import_schema.sql

-- 1. users (optional)
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT           NOT NULL,
  full_name     VARCHAR(100),
  email         VARCHAR(100) UNIQUE,
  role          VARCHAR(20)     NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 2. import_batches
CREATE TABLE import_batches (
  id            SERIAL PRIMARY KEY,
  file_name     VARCHAR(255)    NOT NULL,
  imported_by   INTEGER         REFERENCES users(id) ON DELETE SET NULL,
  imported_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  record_count  INTEGER         NOT NULL,
  status        VARCHAR(20)     NOT NULL DEFAULT 'pending',
  error_message TEXT
);
CREATE INDEX idx_import_batches_imported_at ON import_batches(imported_at DESC);

-- 3. transactions
CREATE TABLE transactions (
  id                SERIAL PRIMARY KEY,
  batch_id          INTEGER       NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  transaction_date  TIMESTAMPTZ   NOT NULL,
  description       TEXT          NOT NULL,
  amount            NUMERIC(15,2) NOT NULL,
  type              VARCHAR(10)   NOT NULL CHECK (type IN ('Deposit','Withdraw')),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transactions_batch_id ON transactions(batch_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
