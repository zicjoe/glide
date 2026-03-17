import { Router } from "express";
import { query } from "../../db.js";

export const treasuryRouter = Router();

treasuryRouter.get("/:merchantId", async (req, res) => {
  try {
    const merchantId = Number(req.params.merchantId);

    const policyResult = await query(
      `SELECT * FROM treasury_policies WHERE merchant_id = $1 LIMIT 1`,
      [merchantId],
    );

    const destinationsResult = await query(
      `SELECT * FROM payout_destinations WHERE merchant_id = $1 ORDER BY destination_id ASC`,
      [merchantId],
    );

    const bucketsResult = await query(
      `SELECT * FROM treasury_buckets WHERE merchant_id = $1 ORDER BY bucket_id ASC`,
      [merchantId],
    );

    res.json({
      policy: policyResult.rows[0] ?? null,
      destinations: destinationsResult.rows,
      buckets: bucketsResult.rows,
    });
  } catch (error) {
    console.error("treasury route error", error);
    res.status(500).json({ error: "Failed to load treasury" });
  }
});