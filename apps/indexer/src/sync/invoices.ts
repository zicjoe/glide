import {
  ClarityType,
  cvToHex,
  hexToCV,
  uintCV,
} from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";

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
  destinationId: number | null;
  paymentDestination: string;
  status: number;
  createdAt: number;
  paidAt: number;
  settlementId: number | null;
};

function cvBigIntToNumber(value: unknown, fallback = 0): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function cvString(value: any): string {
  if (!value) return "";
  if (typeof value.data === "string") return value.data;
  if (typeof value.value === "string") return value.value;
  return "";
}

function cvPrincipal(value: any): string {
  if (!value) return "";
  if (typeof value.value === "string") return value.value;
  if (typeof value.address === "string") return value.address;
  return "";
}

function decodeInvoiceResult(
  invoiceId: number,
  resultHex: string,
): DecodedInvoice | null {
  const clarityValue = hexToCV(resultHex) as any;

  if (clarityValue.type !== ClarityType.ResponseOk) {
    return null;
  }

  const optionalValue = clarityValue.value as any;

  if (!optionalValue || optionalValue.type !== ClarityType.OptionalSome) {
    return null;
  }

  const tupleValue = optionalValue.value as any;

  if (!tupleValue || tupleValue.type !== ClarityType.Tuple) {
    return null;
  }

  const data = tupleValue.value as Record<string, any>;

  const merchantId = cvBigIntToNumber(data["merchant-id"]?.value);
  const reference = cvString(data["reference"]);
  const asset = cvBigIntToNumber(data["asset"]?.value);
  const amount = cvBigIntToNumber(data["amount"]?.value);
  const description = cvString(data["description"]);
  const expiryAt = cvBigIntToNumber(data["expiry-at"]?.value);

  let destinationId: number | null = null;
  const destinationCv = data["destination-id"];
  if (destinationCv?.type === ClarityType.OptionalSome) {
    destinationId = cvBigIntToNumber(destinationCv.value?.value, 0);
  }

  const paymentDestination = cvPrincipal(data["payment-destination"]);
  const status = cvBigIntToNumber(data["status"]?.value);
  const createdAt = cvBigIntToNumber(data["created-at"]?.value);
  const paidAt = cvBigIntToNumber(data["paid-at"]?.value);

  let settlementId: number | null = null;
  const settlementCv = data["settlement-id"];
  if (settlementCv?.type === ClarityType.OptionalSome) {
    settlementId = cvBigIntToNumber(settlementCv.value?.value, 0);
  }

  return {
    invoiceId,
    merchantId,
    reference,
    asset,
    amount,
    description,
    expiryAt,
    destinationId,
    paymentDestination,
    status,
    createdAt,
    paidAt,
    settlementId,
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
        destination_id,
        payment_destination,
        status,
        created_at,
        paid_at,
        settlement_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (invoice_id) DO UPDATE SET
        merchant_id = EXCLUDED.merchant_id,
        reference = EXCLUDED.reference,
        asset = EXCLUDED.asset,
        amount = EXCLUDED.amount,
        description = EXCLUDED.description,
        expiry_at = EXCLUDED.expiry_at,
        destination_id = EXCLUDED.destination_id,
        payment_destination = EXCLUDED.payment_destination,
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
      decoded.destinationId,
      decoded.paymentDestination,
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

  for (let invoiceId = 1; invoiceId <= 20; invoiceId++) {
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

      const decoded = decodeInvoiceResult(invoiceId, response.result);

      if (!decoded) {
        continue;
      }

      if (decoded.merchantId !== merchantId) {
        continue;
      }

      await upsertInvoice(decoded);
      syncedCount += 1;
    } catch (error) {
      console.error(`invoice sync failed for invoice ${invoiceId}`, error);
      continue;
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