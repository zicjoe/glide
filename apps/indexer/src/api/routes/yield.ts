import { Router } from "express";
import { query } from "../../db.js";

export const yieldRouter = Router();

yieldRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    const strategiesResult = await query(
      `
        SELECT *
        FROM strategies
        ORDER BY strategy_id ASC
      `,
      [],
    );

    const queueResult = await query(
      `
        SELECT *
        FROM yield_queue_items
        WHERE merchant_id = $1
        ORDER BY queue_id DESC
      `,
      [merchantId],
    );

    const positionsResult = await query(
      `
        SELECT *
        FROM yield_positions
        WHERE merchant_id = $1
        ORDER BY position_id DESC
      `,
      [merchantId],
    );

    const balancesResult = await query(
      `
        SELECT *
        FROM vault_balances
        WHERE merchant_id = $1
        ORDER BY bucket_id ASC, asset ASC
      `,
      [merchantId],
    );

    res.json({
      strategies: strategiesResult.rows,
      queueItems: queueResult.rows,
      positions: positionsResult.rows,
      balances: balancesResult.rows,
    });
  } catch (error) {
    console.error("yield route error", error);
    res.status(500).json({ error: "Failed to load yield data" });
  }
});
