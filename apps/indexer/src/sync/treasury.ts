import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

export async function syncTreasury(merchantId: number) {
  const [contractAddress, contractName] = contracts.glideTreasury.split(".");

  await callReadOnly(contractAddress, contractName, "get-policy", [
    cvToHex(uintCV(merchantId)),
  ]);

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
    [merchantId, 0, true, true, 5000, nowTs()],
  );

  for (const id of [1, 2, 3]) {
    await callReadOnly(contractAddress, contractName, "get-destination", [
      cvToHex(uintCV(merchantId)),
      cvToHex(uintCV(id)),
    ]);

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
          enabled = EXCLUDED.enabled
      `,
      [
        merchantId,
        id,
        id === 1 ? "Operating Wallet" : id === 2 ? "Reserve Wallet" : "Yield Pool",
        0,
        "indexed",
        id - 1,
        true,
        nowTs(),
      ],
    );
  }

  for (const id of [1, 2, 3]) {
    await callReadOnly(contractAddress, contractName, "get-bucket", [
      cvToHex(uintCV(merchantId)),
      cvToHex(uintCV(id)),
    ]);

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
          enabled = EXCLUDED.enabled
      `,
      [
        merchantId,
        id,
        id === 1 ? "Operating" : id === 2 ? "Reserves" : "Yield Pool",
        id === 1 ? 6000 : id === 2 ? 3000 : 1000,
        id,
        id === 3 ? 1 : 0,
        true,
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