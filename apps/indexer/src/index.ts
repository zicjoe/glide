import { config } from "./config.js";
import { startServer } from "./api/server.js";
import { initSchema } from "./schema.js";
import { syncMerchant } from "./sync/merchants.js";
import { syncTreasury } from "./sync/treasury.js";

async function syncAll() {
  try {
    const merchantId = await syncMerchant();
    if (merchantId) {
      await syncTreasury(merchantId);
    }
    console.log("sync complete");
  } catch (error) {
    console.error("sync failed", error);
  }
}

async function main() {
  await initSchema();
  startServer();

  await syncAll();
  setInterval(syncAll, config.syncIntervalMs);
}

void main();