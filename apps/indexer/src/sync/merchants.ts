import { principalCV, cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function parseMerchantIdResult(result: string): number | null {
  if (!result || result === "0x0709") return null;

  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const merchantId = row["merchant-id"];

  if (typeof merchantId === "number") return merchantId;
  if (typeof merchantId === "string") {
    const parsed = Number(merchantId);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function parseMerchantResult(result: string, merchantId: number) {
  if (!result || result === "0x0709") return null;

  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;

  return {
    merchantId,
    owner: String(row["owner"] ?? ""),
    active: Boolean(row["active"]),
    createdAt: Number(row["created-at"] ?? 0),
  };
}

export async function syncMerchantByOwner(owner: string) {
  const [contractAddress, contractName] = contracts.glideCore.split(".");

  const merchantIdRes = await callReadOnly(
    contractAddress,
    contractName,
    "get-merchant-id-by-owner",
    [cvToHex(principalCV(owner))],
  );

  const merchantId = parseMerchantIdResult(merchantIdRes?.result);
  if (!merchantId) return null;

  const merchantRes = await callReadOnly(
    contractAddress,
    contractName,
    "get-merchant",
    [cvToHex(uintCV(merchantId))],
  );

  const merchant = parseMerchantResult(merchantRes?.result, merchantId);
  if (!merchant || !merchant.owner) return null;

  await query(
    `
      INSERT INTO merchants (
        merchant_id,
        owner,
        active,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (merchant_id) DO UPDATE SET
        owner = EXCLUDED.owner,
        active = EXCLUDED.active,
        created_at = EXCLUDED.created_at,
        updated_at = EXCLUDED.updated_at
    `,
    [
      merchant.merchantId,
      merchant.owner,
      merchant.active,
      merchant.createdAt || nowTs(),
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

  return merchant.merchantId;
}