import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export const config = {
  port: Number(process.env.PORT || 4010),
  stacksApiUrl: required("STACKS_API_URL"),
  deployerAddress: required("GLIDE_DEPLOYER_ADDRESS"),
  merchantOwner: required("GLIDE_MERCHANT_OWNER"),
  syncIntervalMs: Number(process.env.SYNC_INTERVAL_MS || 15000),
  databaseUrl: required("DATABASE_URL"),

  btcUsd: numberEnv("QUOTE_BTC_USD", 80000),
  stxUsd: numberEnv("QUOTE_STX_USD", 1),
  usdcUsd: numberEnv("QUOTE_USDC_USD", 1),
  usdcxUsd: numberEnv("QUOTE_USDCX_USD", 1),
  sbtcBtc: numberEnv("QUOTE_SBTC_BTC", 1),
};

export const contracts = {
  glideCore: `${config.deployerAddress}.glide-core`,
  glideTreasury: `${config.deployerAddress}.glide-treasury`,
  glideInvoices: `${config.deployerAddress}.glide-invoices-v2`,
  glideSettlements: `${config.deployerAddress}.glide-settlements-v2`,
  glideVault: `${config.deployerAddress}.glide-vault`,
  glideYield: `${config.deployerAddress}.glide-yield`,
  glideStrategyRegistry: `${config.deployerAddress}.glide-strategy-registry`,
};