import { principalCV, cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { config, contracts } from "../config.js";
import { callReadOnly } from "./common.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function parseMerchantIdResult(result: string): number | null {
  if (result === "0x0709") return null;
  return 1;
}

function parseMerchantResult(_result: string) {
  return {
    merchantId: 1,
    owner: config.merchantOwner,
    active: true,
    createdAt: nowTs(),
  };
}

export async function syncMerchant() {
  const [contractAddress, contractName] = contracts.glideCore.split(".");

  const merchantIdRes = await callReadOnly(
    contractAddress,
    contractName,
    "get-merchant-id-by-owner",
    [cvToHex(principalCV(config.merchantOwner))],
  );

  const merchantId = parseMerchantIdResult(merchantIdRes.result);
  if (!merchantId) return null;

  const merchantRes = await callReadOnly(
    contractAddress,
    contractName,
    "get-merchant",
    [cvToHex(uintCV(merchantId))],
  );

  const merchant = parseMerchantResult(merchantRes.result);

  await query(
    `
      INSERT INTO merchants (merchant_id, owner, active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (merchant_id) DO UPDATE SET
        owner = EXCLUDED.owner,
        active = EXCLUDED.active,
        updated_at = EXCLUDED.updated_at
    `,
    [
      merchant.merchantId,
      merchant.owner,
      merchant.active,
      merchant.createdAt,
      nowTs(),
    ],
  );

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
      merchant.merchantId,
      "merchant_synced",
      "merchant",
      String(merchant.merchantId),
      JSON.stringify(merchant),
      nowTs(),
    ],
  );

  return merchantId;
}
