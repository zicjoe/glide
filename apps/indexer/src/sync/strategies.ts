import { cvToHex, uintCV } from "@stacks/transactions";
import { query } from "../db.js";
import { contracts } from "../config.js";
import { callReadOnly } from "./common.js";
import { decodeReadOnlyResult } from "./decode.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

type DecodedStrategy = {
  strategyId: number;
  name: string;
  asset: number;
  riskLevel: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
};

function decodeStrategyResult(
  strategyId: number,
  result: string,
): DecodedStrategy | null {
  const decoded = decodeReadOnlyResult(result);
  if (!decoded || typeof decoded !== "object") return null;

  const row = decoded as Record<string, unknown>;
  const name = String(row["name"] ?? "");

  if (!name) return null;

  return {
    strategyId,
    name,
    asset: Number(row["asset"] ?? 0),
    riskLevel: Number(row["risk-level"] ?? 0),
    active: Boolean(row["active"]),
    createdAt: Number(row["created-at"] ?? 0),
    updatedAt: Number(row["updated-at"] ?? 0),
  };
}

async function upsertStrategy(strategy: DecodedStrategy) {
  await query(
    `
      INSERT INTO strategies (
        strategy_id,
        name,
        asset,
        risk_level,
        active,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (strategy_id) DO UPDATE SET
        name = EXCLUDED.name,
        asset = EXCLUDED.asset,
        risk_level = EXCLUDED.risk_level,
        active = EXCLUDED.active,
        created_at = EXCLUDED.created_at,
        updated_at = EXCLUDED.updated_at
    `,
    [
      strategy.strategyId,
      strategy.name,
      strategy.asset,
      strategy.riskLevel,
      strategy.active,
      strategy.createdAt || nowTs(),
      strategy.updatedAt || nowTs(),
    ],
  );
}

export async function syncStrategies() {
  const [contractAddress, contractName] = contracts.glideStrategyRegistry.split(".");

  for (let strategyId = 1; strategyId <= 50; strategyId++) {
    try {
      const response = await callReadOnly(
        contractAddress,
        contractName,
        "get-strategy",
        [cvToHex(uintCV(strategyId))],
      );

      if (!response?.result) continue;

      const decoded = decodeStrategyResult(strategyId, response.result);
      if (!decoded) continue;

      await upsertStrategy(decoded);
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
      null,
      "strategies_synced",
      "strategy",
      "registry",
      JSON.stringify({ synced: true }),
      nowTs(),
    ],
  );
}
