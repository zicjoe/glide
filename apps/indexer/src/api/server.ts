import express from "express";
import cors from "cors";
import { config } from "../config.js";
import { healthRouter } from "./routes/health.js";
import { merchantRouter } from "./routes/merchant.js";
import { treasuryRouter } from "./routes/treasury.js";
import { invoicesRouter } from "./routes/invoices.js";
import { settlementsRouter } from "./routes/settlements.js";
import { invoiceByReferenceRouter } from "./routes/invoice-by-reference.js";

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

  return app;
}

export function startServer() {
  const app = createServer();

  app.listen(config.port, () => {
    console.log(`Glide indexer listening on http://localhost:${config.port}`);
  });
}