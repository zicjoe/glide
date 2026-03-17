import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedInvoice = {
  invoiceId: number;
  merchantId: number;
  reference: string;
  asset: number;
  amount: number;
  description: string;
  expiryAt: number;
  status: number;
  createdAt: number;
  paidAt: number;
  settlementId: number | null;
};

function decodeInvoiceResult(result: string): DecodedInvoice | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const invoice = decoded as Record<string, unknown>;

  const invoiceId = Number(invoice["invoice-id"] ?? 0);
  const merchantId = Number(invoice["merchant-id"] ?? 0);

  if (!invoiceId || !merchantId) return null;

  const settlementRaw = invoice["settlement-id"];

  return {
    invoiceId,
    merchantId,
    reference: String(invoice["reference"] ?? ""),
    asset: Number(invoice["asset"] ?? 0),
    amount: Number(invoice["amount"] ?? 0),
    description: String(invoice["description"] ?? ""),
    expiryAt: Number(invoice["expiry-at"] ?? 0),
    status: Number(invoice["status"] ?? 0),
    createdAt: Number(invoice["created-at"] ?? 0),
    paidAt: Number(invoice["paid-at"] ?? 0),
    settlementId:
      settlementRaw == null || settlementRaw === ""
        ? null
        : Number(settlementRaw),
  };
}

async function upsertInvoice(decoded: DecodedInvoice) {
  await query(
    `
      INSERT INTO invoices (
        invoice_id,
        merchant_id,
        reference,
        asset,
        amount,
        description,
        expiry_at,
        status,
        created_at,
        paid_at,
        settlement_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (invoice_id) DO UPDATE SET
        merchant_id = EXCLUDED.merchant_id,
        reference = EXCLUDED.reference,
        asset = EXCLUDED.asset,
        amount = EXCLUDED.amount,
        description = EXCLUDED.description,
        expiry_at = EXCLUDED.expiry_at,
        status = EXCLUDED.status,
        created_at = EXCLUDED.created_at,
        paid_at = EXCLUDED.paid_at,
        settlement_id = EXCLUDED.settlement_id
    `,
    [
      decoded.invoiceId,
      decoded.merchantId,
      decoded.reference,
      decoded.asset,
      decoded.amount,
      decoded.description,
      decoded.expiryAt,
      decoded.status,
      decoded.createdAt,
      decoded.paidAt,
      decoded.settlementId,
    ],
  );
}

export async function syncInvoices(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideInvoices.split(".");

  let syncedCount = 0;

  for (let invoiceId = 1; invoiceId <= 100; invoiceId++) {
    try {
      const response = await callReadOnly(
        contractAddress,
        contractName,
        "get-invoice",
        [cvToHex(uintCV(invoiceId))],
      );

      if (!response?.result) {
        continue;
      }

      const decoded = decodeInvoiceResult(response.result);
      if (!decoded) {
        continue;
      }

      if (decoded.merchantId !== merchantId) {
        continue;
      }

      await upsertInvoice(decoded);
      syncedCount += 1;
    } catch (error) {
      console.error(`invoice sync failed for id ${invoiceId}`, error);
    }
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
      VALUES ($1, $2, $3, $4, $5::jsonb, $6)
    `,
    [
      merchantId,
      "invoices_synced",
      "invoice",
      String(merchantId),
      JSON.stringify({ merchantId, syncedCount }),
      nowTs(),
    ],
  );
}