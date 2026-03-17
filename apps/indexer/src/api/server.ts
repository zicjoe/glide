import express from "express";
import cors from "cors";
import { config } from "../config.js";
import { healthRouter } from "./routes/health.js";
import { merchantRouter } from "./routes/merchant.js";
import { treasuryRouter } from "./routes/treasury.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/merchant", merchantRouter);
  app.use("/api/treasury", treasuryRouter);

  return app;
}

export function startServer() {
  const app = createServer();

  app.listen(config.port, () => {
    console.log(`Glide indexer listening on http://localhost:${config.port}`);
  });
}