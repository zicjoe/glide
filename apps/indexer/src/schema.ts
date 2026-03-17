import { query } from "./db.js";

export async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS merchants (
      merchant_id INTEGER PRIMARY KEY,
      owner TEXT NOT NULL UNIQUE,
      active BOOLEAN NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS treasury_policies (
      merchant_id INTEGER PRIMARY KEY,
      settlement_asset INTEGER NOT NULL,
      auto_split BOOLEAN NOT NULL,
      idle_yield BOOLEAN NOT NULL,
      yield_threshold BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS payout_destinations (
      merchant_id INTEGER NOT NULL,
      destination_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      asset INTEGER NOT NULL,
      destination TEXT NOT NULL,
      destination_type INTEGER NOT NULL,
      enabled BOOLEAN NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (merchant_id, destination_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS treasury_buckets (
      merchant_id INTEGER NOT NULL,
      bucket_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      allocation_bps INTEGER NOT NULL,
      destination_id INTEGER NOT NULL,
      idle_mode INTEGER NOT NULL,
      enabled BOOLEAN NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (merchant_id, bucket_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS invoices (
      invoice_id INTEGER PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      reference TEXT NOT NULL,
      asset INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      description TEXT NOT NULL,
      expiry_at BIGINT NOT NULL,
      status INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      paid_at BIGINT NOT NULL,
      settlement_id BIGINT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS activity_events (
      id BIGSERIAL PRIMARY KEY,
      merchant_id INTEGER,
      event_type TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json JSONB NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);
}