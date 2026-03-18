import { query } from "../db.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type InvoiceRow = {
  invoice_id: number;
  merchant_id: number;
  asset: number;
  amount: string | number;
  expiry_at: string | number;
  status: number;
  settlement_id: string | number | null;
};

function derivePaymentStatus(invoice: InvoiceRow) {
  const now = nowTs();
  const expiryAt = Number(invoice.expiry_at);
  const settlementId =
    invoice.settlement_id == null ? null : Number(invoice.settlement_id);

  if (settlementId) {
    return "settled";
  }

  if (Number(invoice.status) === 2) {
    return "expired";
  }

  if (Number(invoice.status) === 1) {
    return "payment_confirmed";
  }

  if (expiryAt <= now) {
    return "expired";
  }

  return "awaiting_payment";
}

export async function syncInvoicePaymentStatuses(merchantId: number) {
  const invoicesResult = await query(
    `
      SELECT invoice_id, merchant_id, asset, amount, expiry_at, status, settlement_id
      FROM invoices
      WHERE merchant_id = $1
    `,
    [merchantId],
  );

  for (const row of invoicesResult.rows as InvoiceRow[]) {
    const paymentStatus = derivePaymentStatus(row);

    await query(
      `
        INSERT INTO invoice_payment_status (
          invoice_id,
          merchant_id,
          payment_status,
          observed_amount,
          observed_asset,
          observed_txid,
          observed_at,
          confirmed_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (invoice_id) DO UPDATE SET
          merchant_id = EXCLUDED.merchant_id,
          payment_status = EXCLUDED.payment_status,
          updated_at = EXCLUDED.updated_at
      `,
      [
        Number(row.invoice_id),
        Number(row.merchant_id),
        paymentStatus,
        null,
        null,
        null,
        null,
        null,
        nowTs(),
      ],
    );
  }

  await query(
    `
      INSERT INTO activity_events (
        merchant_id,
        event_type,
        entity_type,
        entity_id,
        payload_json,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5::jsonb,$6)
    `,
    [
      merchantId,
      "payment_status_synced",
      "invoice_payment_status",
      String(merchantId),
      JSON.stringify({ merchantId }),
      nowTs(),
    ],
  );
}
