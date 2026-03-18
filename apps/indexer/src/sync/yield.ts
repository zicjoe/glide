import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedQueueItem = {
  queueId: number;
  merchantId: number;
  bucketId: number;
  asset: number;
  amount: number;
  strategyId: number;
  status: number;
  createdAt: number;
  executor: string;
};

type DecodedPosition = {
  positionId: number;
  merchantId: number;
  bucketId: number;
  asset: number;
  amount: number;
  strategyId: number;
  status: number;
  queuedId: number;
  deployedAt: number;
  withdrawnAt: number;
  executor: string;
};

function decodeQueueResult(
  queueId: number,
  result: string,
): DecodedQueueItem | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const merchantId = Number(row["merchant-id"] ?? 0);

  if (!merchantId) return null;

  return {
    queueId,
    merchantId,
    bucketId: Number(row["bucket-id"] ?? 0),
    asset: Number(row["asset"] ?? 0),
    amount: Number(row["amount"] ?? 0),
    strategyId: Number(row["strategy-id"] ?? 0),
    status: Number(row["status"] ?? 0),
    createdAt: Number(row["created-at"] ?? 0),
    executor: String(row["executor"] ?? ""),
  };
}

function decodePositionResult(
  positionId: number,
  result: string,
): DecodedPosition | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const merchantId = Number(row["merchant-id"] ?? 0);

  if (!merchantId) return null;

  return {
    positionId,
    merchantId,
    bucketId: Number(row["bucket-id"] ?? 0),
    asset: Number(row["asset"] ?? 0),
    amount: Number(row["amount"] ?? 0),
    strategyId: Number(row["strategy-id"] ?? 0),
    status: Number(row["status"] ?? 0),
    queuedId: Number(row["queued-id"] ?? 0),
    deployedAt: Number(row["deployed-at"] ?? 0),
    withdrawnAt: Number(row["withdrawn-at"] ?? 0),
    executor: String(row["executor"] ?? ""),
  };
}

async function upsertQueueItem(item: DecodedQueueItem) {
  await query(
    `
      INSERT INTO yield_queue_items (
        queue_id,
        merchant_id,
        bucket_id,
        asset,
        amount,
        strategy_id,
        status,
        created_at,
        executor
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (queue_id) DO UPDATE SET
        merchant_id = EXCLUDED.merchant_id,
        bucket_id = EXCLUDED.bucket_id,
        asset = EXCLUDED.asset,
        amount = EXCLUDED.amount,
        strategy_id = EXCLUDED.strategy_id,
        status = EXCLUDED.status,
        created_at = EXCLUDED.created_at,
        executor = EXCLUDED.executor
    `,
    [
      item.queueId,
      item.merchantId,
      item.bucketId,
      item.asset,
      item.amount,
      item.strategyId,
      item.status,
      item.createdAt || nowTs(),
      item.executor,
    ],
  );
}

async function upsertPosition(item: DecodedPosition) {
  await query(
    `
      INSERT INTO yield_positions (
        position_id,
        merchant_id,
        bucket_id,
        asset,
        amount,
        strategy_id,
        status,
        queued_id,
        deployed_at,
        withdrawn_at,
        executor
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (position_id) DO UPDATE SET
        merchant_id = EXCLUDED.merchant_id,
        bucket_id = EXCLUDED.bucket_id,
        asset = EXCLUDED.asset,
        amount = EXCLUDED.amount,
        strategy_id = EXCLUDED.strategy_id,
        status = EXCLUDED.status,
        queued_id = EXCLUDED.queued_id,
        deployed_at = EXCLUDED.deployed_at,
        withdrawn_at = EXCLUDED.withdrawn_at,
        executor = EXCLUDED.executor
    `,
    [
      item.positionId,
      item.merchantId,
      item.bucketId,
      item.asset,
      item.amount,
      item.strategyId,
      item.status,
      item.queuedId,
      item.deployedAt || 0,
      item.withdrawnAt || 0,
      item.executor,
    ],
  );
}

export async function syncYield(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideYield.split(".");

  for (let queueId = 1; queueId <= 100; queueId++) {
    try {
      const response = await callReadOnly(
        contractAddress,
        contractName,
        "get-queue-item",
        [cvToHex(uintCV(queueId))],
      );

      if (!response?.result) continue;

      const decoded = decodeQueueResult(queueId, response.result);
      if (!decoded) continue;
      if (decoded.merchantId !== merchantId) continue;

      await upsertQueueItem(decoded);
    } catch {
      continue;
    }
  }

  for (let positionId = 1; positionId <= 100; positionId++) {
    try {
      const response = await callReadOnly(
        contractAddress,
        contractName,
        "get-position",
        [cvToHex(uintCV(positionId))],
      );

      if (!response?.result) continue;

      const decoded = decodePositionResult(positionId, response.result);
      if (!decoded) continue;
      if (decoded.merchantId !== merchantId) continue;

      await upsertPosition(decoded);
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
      VALUES ($1,$2,$3,$4,$5::jsonb,$6)
    `,
    [
      merchantId,
      "yield_synced",
      "yield",
      String(merchantId),
      JSON.stringify({ merchantId }),
      nowTs(),
    ],
  );
}
