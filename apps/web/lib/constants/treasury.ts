export const SETTLEMENT_ASSETS = ["sBTC", "USDCx"] as const;

export const DESTINATION_TYPES = [
  "WALLET",
  "OPS",
  "RESERVE",
  "TREASURY",
  "SUPPLIER",
] as const;

export const IDLE_MODES = ["HOLD", "EARN"] as const;

export const TREASURY_STORAGE_KEY = "glide:treasury-settings";