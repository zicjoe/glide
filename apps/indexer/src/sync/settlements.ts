import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedSettlement = {
  settlementId: number;
  merchantId: number;
  invoiceId: number;
  asset: number;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: number;
  createdAt: number;
  completedAt: number;
  executor: string;
};

type DecodedAllocation = {
  settlementId: number;
  bucketId: number;
  allocationBps: number;
  amount: number;
  destinationId: number;
};

function decodeSettlementResult(
  settlementId: number,
  result: string,
): DecodedSettlement | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const merchantId = Number(row["merchant-id"] ?? 0);
  const invoiceId = Number(row["invoice-id"] ?? 0);

  if (!merchantId || !invoiceId) return null;

  return {
    settlementId,
    merchantId,
    invoiceId,
    asset: Number(row["asset"] ?? 0),
    grossAmount: Number(row["gross-amount"] ?? 0),
    feeAmount: Number(row["fee-amount"] ?? 0),
    netAmount: Number(row["net-amount"] ?? 0),
    status: Number(row["status"] ?? 0),
    createdAt: Number(row["created-at"] ?? 0),
    completedAt: Number(row["completed-at"] ?? 0),
    executor: String(row["executor"] ?? ""),
  };
}

function decodeAllocationResult(
  settlementId: number,
  bucketId: number,
  result: string,
): DecodedAllocation | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const allocationBps = Number(row["allocation-bps"] ?? 0);

  if (!allocationBps) return null;

  return {
    settlementId,
    bucketId,
    allocationBps,
    amount: Number(row["amount"] ?? 0),
    destinationId: Number(row["destination-id"] ?? 0),
  };
}

async function upsertSettlement(decoded: DecodedSettlement) {
  await query(
    `
      INSERT INTO settlements (
        settlement_id,
        merchant_id,
        invoice_id,
        asset,
        gross_amount,
        fee_amount,
        net_amount,
        status,
        created_at,
        completed_at,
        executor
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (settlement_id) DO UPDATE SET
        merchant_id = EXCLUDED.merchant_id,
        invoice_id = EXCLUDED.invoice_id,
        asset = EXCLUDED.asset,
        gross_amount = EXCLUDED.gross_amount,
        fee_amount = EXCLUDED.fee_amount,
        net_amount = EXCLUDED.net_amount,
        status = EXCLUDED.status,
        created_at = EXCLUDED.created_at,
        completed_at = EXCLUDED.completed_at,
        executor = EXCLUDED.executor
    `,
    [
      decoded.settlementId,
      decoded.merchantId,
      decoded.invoiceId,
      decoded.asset,
      decoded.grossAmount,
      decoded.feeAmount,
      decoded.netAmount,
      decoded.status,
      decoded.createdAt,
      decoded.completedAt,
      decoded.executor,
    ],
  );
}

async function upsertAllocation(decoded: DecodedAllocation) {
  await query(
    `
      INSERT INTO settlement_allocations (
        settlement_id,
        bucket_id,
        allocation_bps,
        amount,
        destination_id
      )
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (settlement_id, bucket_id) DO UPDATE SET
        allocation_bps = EXCLUDED.allocation_bps,
        amount = EXCLUDED.amount,
        destination_id = EXCLUDED.destination_id
    `,
    [
      decoded.settlementId,
      decoded.bucketId,
      decoded.allocationBps,
      decoded.amount,
      decoded.destinationId,
    ],
  );
}

export async function syncSettlements(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideSettlements.split(".");

  let syncedCount = 0;

  for (let settlementId = 1; settlementId <= 100; settlementId++) {
try {
    const response = await callReadOnly(
      contractAddress,
      contractName,
      "get-settlement",
      [cvToHex(uintCV(settlementId))],
    );

    if (!response?.result) continue;

    const decoded = decodeSettlementResult(settlementId, response.result);
    if (!decoded) continue;
    if (decoded.merchantId !== merchantId) continue;

    await upsertSettlement(decoded);

    for (const bucketId of [1, 2, 3]) {
      try {
        const allocationResponse = await callReadOnly(
          contractAddress,
          contractName,
          "get-settlement-allocation",
          [cvToHex(uintCV(settlementId)), cvToHex(uintCV(bucketId))],
        );

        if (!allocationResponse?.result) continue;

        const allocation = decodeAllocationResult(
          settlementId,
          bucketId,
          allocationResponse.result,
        );

        if (!allocation) continue;
        await upsertAllocation(allocation);
      } catch {
        continue;
      }
    }

    syncedCount += 1;
  } catch {
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
    "settlements_synced",
    "settlement",
    String(merchantId),
    JSON.stringify({ merchantId, syncedCount }),
    nowTs(),
  ],
);
}