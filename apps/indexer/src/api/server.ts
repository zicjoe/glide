import express from "express";
import cors from "cors";
import { config } from "../config.js";
import { healthRouter } from "./routes/health.js";
import { merchantRouter } from "./routes/merchant.js";
import { treasuryRouter } from "./routes/treasury.js";
import { invoicesRouter } from "./routes/invoices.js";
import { settlementsRouter } from "./routes/settlements.js";
import { invoiceByReferenceRouter } from "./routes/invoice-by-reference.js";
import { activityRouter } from "./routes/activity.js";
import { yieldRouter } from "./routes/yield.js";
import { refundsRouter } from "./routes/refund.js";
import { merchantRailsRouter } from "./routes/merchant-rails.js";
import { conversionsRouter } from "./routes/conversions.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/merchant", merchantRouter);
  app.use("/api/treasury", treasuryRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/settlements", settlementsRouter);
  app.use("/api/invoice-by-reference", invoiceByReferenceRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/yield", yieldRouter);
  app.use("/api/refunds", refundsRouter);
  app.use("/api/merchant-rails", merchantRailsRouter);
  app.use("/api/conversions", conversionsRouter);

  return app;
}

export function startServer() {
  const app = createServer();

  app.listen(config.port, () => {
    console.log(`Glide indexer listening on http://localhost:${config.port}`);
  });
}