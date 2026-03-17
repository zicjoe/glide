import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT || 4010),
  stacksApiUrl: required("STACKS_API_URL"),
  deployerAddress: required("GLIDE_DEPLOYER_ADDRESS"),
  merchantOwner: required("GLIDE_MERCHANT_OWNER"),
  syncIntervalMs: Number(process.env.SYNC_INTERVAL_MS || 15000),
  databaseUrl: required("DATABASE_URL"),
};

export const contracts = {
  glideCore: `${config.deployerAddress}.glide-core`,
  glideTreasury: `${config.deployerAddress}.glide-treasury`,
  glideInvoices: `${config.deployerAddress}.glide-invoices`,
  glideSettlements: `${config.deployerAddress}.glide-settlements`,
  glideVault: `${config.deployerAddress}.glide-vault`,
  glideYield: `${config.deployerAddress}.glide-yield`,
  glideStrategyRegistry: `${config.deployerAddress}.glide-strategy-registry`,
};