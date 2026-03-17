import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function decodeInvoiceResult(result: string) {
    const decoded = decodeReadOnlyResult(result);
    if (!decoded) return null;
  
    return {
      invoiceId: Number((decoded as any)["invoice-id"] ?? 0),
      merchantId: Number((decoded as any)["merchant-id"] ?? 0),
      reference: String((decoded as any)["reference"] ?? ""),
      asset: Number((decoded as any)["asset"] ?? 0),
      amount: Number((decoded as any)["amount"] ?? 0),
      description: String((decoded as any)["description"] ?? ""),
      expiryAt: Number((decoded as any)["expiry-at"] ?? 0),
      status: Number((decoded as any)["status"] ?? 0),
      createdAt: Number((decoded as any)["created-at"] ?? 0),
      paidAt: Number((decoded as any)["paid-at"] ?? 0),
      settlementId:
        (decoded as any)["settlement-id"] == null
          ? null
          : Number((decoded as any)["settlement-id"]),
    };
  }
  

export async function syncInvoices(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideInvoices.split(".");

  for (let invoiceId = 1; invoiceId <= 25; invoiceId++) {
    try {
      const response = await callReadOnly(
        contractAddress,
        contractName,
        "get-invoice",
        [cvToHex(uintCV(invoiceId))],
      );

      if (!response?.result || response.result === "0x0709") {
        continue;
      }

      const decoded = decodeInvoiceResult(response.result);

      if (!decoded) {
        continue;
      }

      if (decoded.merchantId !== merchantId) {
        continue;
      }

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
      JSON.stringify({ merchantId }),
      nowTs(),
    ],
  );
}