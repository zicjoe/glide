import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedPolicy = {
  settlementAsset: number;
  autoSplit: boolean;
  idleYield: boolean;
  yieldThreshold: number;
  updatedAt: number;
};

type DecodedDestination = {
  destinationId: number;
  label: string;
  asset: number;
  destination: string;
  destinationType: number;
  enabled: boolean;
  createdAt: number;
};

type DecodedBucket = {
  bucketId: number;
  name: string;
  allocationBps: number;
  destinationId: number;
  idleMode: number;
  enabled: boolean;
  createdAt: number;
};

function decodePolicyResult(result: string): DecodedPolicy | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;

  return {
    settlementAsset: Number(row["settlement-asset"] ?? 0),
    autoSplit: Boolean(row["auto-split"]),
    idleYield: Boolean(row["idle-yield"]),
    yieldThreshold: Number(row["yield-threshold"] ?? 0),
    updatedAt: Number(row["updated-at"] ?? 0),
  };
}

function decodeDestinationResult(
  destinationId: number,
  result: string,
): DecodedDestination | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const label = String(row["label"] ?? "");
  const destination = String(row["destination"] ?? "");

  if (!label || !destination) return null;

  return {
    destinationId,
    label,
    asset: Number(row["asset"] ?? 0),
    destination,
    destinationType: Number(row["destination-type"] ?? 0),
    enabled: Boolean(row["enabled"]),
    createdAt: Number(row["created-at"] ?? 0),
  };
}

function decodeBucketResult(bucketId: number, result: string): DecodedBucket | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const name = String(row["name"] ?? "");

  if (!name) return null;

  return {
    bucketId,
    name,
    allocationBps: Number(row["allocation-bps"] ?? 0),
    destinationId: Number(row["destination-id"] ?? 0),
    idleMode: Number(row["idle-mode"] ?? 0),
    enabled: Boolean(row["enabled"]),
    createdAt: Number(row["created-at"] ?? 0),
  };
}

async function upsertPolicy(merchantId: number, policy: DecodedPolicy) {
  await query(
    `
      INSERT INTO treasury_policies (
        merchant_id,
        settlement_asset,
        auto_split,
        idle_yield,
        yield_threshold,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (merchant_id) DO UPDATE SET
        settlement_asset = EXCLUDED.settlement_asset,
        auto_split = EXCLUDED.auto_split,
        idle_yield = EXCLUDED.idle_yield,
        yield_threshold = EXCLUDED.yield_threshold,
        updated_at = EXCLUDED.updated_at
    `,
    [
      merchantId,
      policy.settlementAsset,
      policy.autoSplit,
      policy.idleYield,
      policy.yieldThreshold,
      policy.updatedAt || nowTs(),
    ],
  );
}

async function upsertDestination(merchantId: number, destination: DecodedDestination) {
  await query(
    `
      INSERT INTO payout_destinations (
        merchant_id,
        destination_id,
        label,
        asset,
        destination,
        destination_type,
        enabled,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (merchant_id, destination_id) DO UPDATE SET
        label = EXCLUDED.label,
        asset = EXCLUDED.asset,
        destination = EXCLUDED.destination,
        destination_type = EXCLUDED.destination_type,
        enabled = EXCLUDED.enabled,
        created_at = EXCLUDED.created_at
    `,
    [
      merchantId,
      destination.destinationId,
      destination.label,
      destination.asset,
      destination.destination,
      destination.destinationType,
      destination.enabled,
      destination.createdAt || nowTs(),
    ],
  );
}

async function upsertBucket(merchantId: number, bucket: DecodedBucket) {
  await query(
    `
      INSERT INTO treasury_buckets (
        merchant_id,
        bucket_id,
        name,
        allocation_bps,
        destination_id,
        idle_mode,
        enabled,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (merchant_id, bucket_id) DO UPDATE SET
        name = EXCLUDED.name,
        allocation_bps = EXCLUDED.allocation_bps,
        destination_id = EXCLUDED.destination_id,
        idle_mode = EXCLUDED.idle_mode,
        enabled = EXCLUDED.enabled,
        created_at = EXCLUDED.created_at
    `,
    [
      merchantId,
      bucket.bucketId,
      bucket.name,
      bucket.allocationBps,
      bucket.destinationId,
      bucket.idleMode,
      bucket.enabled,
      bucket.createdAt || nowTs(),
    ],
  );
}

export async function syncTreasury(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideTreasury.split(".");

  const policyResponse = await callReadOnly(contractAddress, contractName, "get-policy", [
    cvToHex(uintCV(merchantId)),
  ]);

  if (policyResponse?.result) {
    const policy = decodePolicyResult(policyResponse.result);
    if (policy) {
      await upsertPolicy(merchantId, policy);
    }
  }

  for (const destinationId of [1, 2, 3]) {
    try {
      const destinationResponse = await callReadOnly(
        contractAddress,
        contractName,
        "get-destination",
        [cvToHex(uintCV(merchantId)), cvToHex(uintCV(destinationId))],
      );

      if (!destinationResponse?.result) continue;

      const destination = decodeDestinationResult(
        destinationId,
        destinationResponse.result,
      );

      if (!destination) continue;

      await upsertDestination(merchantId, destination);
    } catch {
      continue;
    }
  }

  for (const bucketId of [1, 2, 3]) {
    try {
      const bucketResponse = await callReadOnly(
        contractAddress,
        contractName,
        "get-bucket",
        [cvToHex(uintCV(merchantId)), cvToHex(uintCV(bucketId))],
      );

      if (!bucketResponse?.result) continue;

      const bucket = decodeBucketResult(bucketId, bucketResponse.result);
      if (!bucket) continue;

      await upsertBucket(merchantId, bucket);
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
      "treasury_synced",
      "treasury",
      String(merchantId),
      JSON.stringify({ merchantId }),
      nowTs(),
    ],
  );
}