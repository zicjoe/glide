import { Router } from "express";
import { query } from "../../db.js";

export const refundsRouter = Router();

refundsRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    const result = await query(
      `
        SELECT *
        FROM refunds
        WHERE merchant_id = $1
        ORDER BY created_at DESC
      `,
      [merchantId],
    );

    res.json({
      refunds: result.rows,
    });
  } catch (error) {
    console.error("refunds route error", error);
    res.status(500).json({ error: "Failed to load refunds" });
  }
});