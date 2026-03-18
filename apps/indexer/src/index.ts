import { config } from "./config.js";
import { startServer } from "./api/server.js";
import { initSchema } from "./schema.js";
import { syncMerchant } from "./sync/merchants.js";
import { syncTreasury } from "./sync/treasury.js";
import { syncInvoices } from "./sync/invoices.js";
import { syncSettlements } from "./sync/settlements.js";
import { syncInvoicePaymentStatuses } from "./sync/payment-status.js";
import { syncStrategies } from "./sync/strategies.js";
import { syncYield } from "./sync/yield.js";
import { syncVaultBalances } from "./sync/vault.js";

async function syncAll() {
  try {
    const merchantId = await syncMerchant();

    await syncStrategies();

    if (merchantId) {
      await syncTreasury(merchantId);
      await syncInvoices(merchantId);
      await syncSettlements(merchantId);
      await syncInvoicePaymentStatuses(merchantId);
      await syncYield(merchantId);
      await syncVaultBalances(merchantId);
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
