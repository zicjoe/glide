import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedVaultBalance = {
  merchantId: number;
  bucketId: number;
  asset: number;
  available: number;
  queued: number;
  deployed: number;
  updatedAt: number;
};

function decodeBalanceResult(
  merchantId: number,
  bucketId: number,
  asset: number,
  result: string,
): DecodedVaultBalance | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;

  return {
    merchantId,
    bucketId,
    asset,
    available: Number(row["available"] ?? 0),
    queued: Number(row["queued"] ?? 0),
    deployed: Number(row["deployed"] ?? 0),
    updatedAt: Number(row["updated-at"] ?? 0),
  };
}

async function upsertVaultBalance(balance: DecodedVaultBalance) {
  await query(
    `
      INSERT INTO vault_balances (
        merchant_id,
        bucket_id,
        asset,
        available,
        queued,
        deployed,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (merchant_id, bucket_id, asset) DO UPDATE SET
        available = EXCLUDED.available,
        queued = EXCLUDED.queued,
        deployed = EXCLUDED.deployed,
        updated_at = EXCLUDED.updated_at
    `,
    [
      balance.merchantId,
      balance.bucketId,
      balance.asset,
      balance.available,
      balance.queued,
      balance.deployed,
      balance.updatedAt || nowTs(),
    ],
  );
}

export async function syncVaultBalances(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideVault.split(".");

  for (const bucketId of [1, 2, 3]) {
    for (const asset of [0, 1]) {
      try {
        const response = await callReadOnly(
          contractAddress,
          contractName,
          "get-balance",
          [cvToHex(uintCV(merchantId)), cvToHex(uintCV(bucketId)), cvToHex(uintCV(asset))],
        );

        if (!response?.result) continue;

        const decoded = decodeBalanceResult(
          merchantId,
          bucketId,
          asset,
          response.result,
        );

        if (!decoded) continue;
        await upsertVaultBalance(decoded);
      } catch {
        continue;
      }
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
      "vault_synced",
      "vault",
      String(merchantId),
      JSON.stringify({ merchantId }),
      nowTs(),
    ],
  );
}