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
      destination_id INTEGER,
      payment_destination TEXT NOT NULL,
      status INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      paid_at BIGINT NOT NULL,
      settlement_id BIGINT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS provisional_invoices (
      reference TEXT PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      asset INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      description TEXT NOT NULL,
      expiry_at BIGINT NOT NULL,
      destination_id INTEGER,
      payment_destination TEXT NOT NULL,
      status INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      paid_at BIGINT NOT NULL DEFAULT 0,
      settlement_id BIGINT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settlements (
      settlement_id INTEGER PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      invoice_id INTEGER NOT NULL,
      asset INTEGER NOT NULL,
      gross_amount BIGINT NOT NULL,
      fee_amount BIGINT NOT NULL,
      net_amount BIGINT NOT NULL,
      status INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      completed_at BIGINT NOT NULL,
      executor TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settlement_allocations (
      settlement_id INTEGER NOT NULL,
      bucket_id INTEGER NOT NULL,
      allocation_bps INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      destination_id INTEGER NOT NULL,
      PRIMARY KEY (settlement_id, bucket_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS invoice_payment_status (
      invoice_id INTEGER PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      payment_status TEXT NOT NULL,
      observed_amount BIGINT,
      observed_asset INTEGER,
      observed_txid TEXT,
      observed_at BIGINT,
      confirmed_at BIGINT,
      updated_at BIGINT NOT NULL,
      selected_payment_rail TEXT,
      quoted_amount BIGINT,
      quoted_asset TEXT,
      route_type TEXT,
      route_status TEXT,
      normalized_asset INTEGER,
      normalized_amount BIGINT,
      cashback_eligible BOOLEAN NOT NULL DEFAULT false,
      cashback_bps INTEGER NOT NULL DEFAULT 0,
      cashback_amount BIGINT NOT NULL DEFAULT 0
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

  await query(`
    CREATE TABLE IF NOT EXISTS strategies (
      strategy_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      asset INTEGER NOT NULL,
      risk_level INTEGER NOT NULL,
      active BOOLEAN NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS yield_queue_items (
      queue_id INTEGER PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      bucket_id INTEGER NOT NULL,
      asset INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      strategy_id INTEGER NOT NULL,
      status INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      executor TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS yield_positions (
      position_id INTEGER PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      bucket_id INTEGER NOT NULL,
      asset INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      strategy_id INTEGER NOT NULL,
      status INTEGER NOT NULL,
      queued_id INTEGER NOT NULL,
      deployed_at BIGINT NOT NULL,
      withdrawn_at BIGINT NOT NULL,
      executor TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS vault_balances (
      merchant_id INTEGER NOT NULL,
      bucket_id INTEGER NOT NULL,
      asset INTEGER NOT NULL,
      available BIGINT NOT NULL,
      queued BIGINT NOT NULL,
      deployed BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      PRIMARY KEY (merchant_id, bucket_id, asset)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS refunds (
      refund_id TEXT PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      invoice_id INTEGER,
      settlement_id INTEGER,
      asset INTEGER NOT NULL,
      amount BIGINT NOT NULL,
      destination TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL,
      requested_by TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS cashback_rewards (
      reward_id BIGSERIAL PRIMARY KEY,
      invoice_id INTEGER NOT NULL,
      merchant_id INTEGER NOT NULL,
      payment_rail TEXT NOT NULL,
      reward_asset INTEGER NOT NULL,
      reward_amount BIGINT NOT NULL,
      reward_bps INTEGER NOT NULL,
      status TEXT NOT NULL,
      wallet_address TEXT,
      created_at BIGINT NOT NULL,
      paid_at BIGINT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS merchant_receive_rails (
      owner TEXT PRIMARY KEY,
      stacks_address TEXT,
      btc_address TEXT,
      usdc_address TEXT,
      usdcx_address TEXT,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS invoice_payment_rails (
      invoice_id INTEGER NOT NULL,
      rail TEXT NOT NULL,
      label TEXT NOT NULL,
      asset_label TEXT NOT NULL,
      amount BIGINT NOT NULL,
      normalized_asset INTEGER NOT NULL,
      normalized_amount BIGINT NOT NULL,
      customer_status_label TEXT NOT NULL,
      cashback_eligible BOOLEAN NOT NULL,
      cashback_bps INTEGER NOT NULL,
      cashback_amount BIGINT NOT NULL,
      route_type TEXT NOT NULL,
      visible_message TEXT NOT NULL,
      address TEXT,
      address_label TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (invoice_id, rail)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS conversion_transactions (
      conversion_id BIGSERIAL PRIMARY KEY,
      merchant_id INTEGER NOT NULL,
      from_asset TEXT NOT NULL,
      to_asset TEXT NOT NULL,
      from_amount BIGINT NOT NULL,
      to_amount BIGINT NOT NULL,
      quote_rate NUMERIC NOT NULL,
      source_address TEXT,
      destination_address TEXT,
      txid TEXT,
      status TEXT NOT NULL,
      metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_invoices_reference
    ON invoices(reference);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_provisional_invoices_reference
    ON provisional_invoices(reference);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_invoice_payment_status_merchant
    ON invoice_payment_status(merchant_id);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_cashback_rewards_invoice
    ON cashback_rewards(invoice_id);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_conversion_transactions_merchant
    ON conversion_transactions(merchant_id);
  `);
}