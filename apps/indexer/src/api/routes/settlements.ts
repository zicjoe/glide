import { Router } from "express";
import { query } from "../../db.js";

export const settlementsRouter = Router();

settlementsRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    const settlementsResult = await query(
      `
        SELECT *
        FROM settlements
        WHERE merchant_id = $1
        ORDER BY settlement_id DESC
      `,
      [merchantId],
    );

    const allocationsResult = await query(
      `
        SELECT sa.*
        FROM settlement_allocations sa
        JOIN settlements s ON s.settlement_id = sa.settlement_id
        WHERE s.merchant_id = $1
        ORDER BY sa.settlement_id DESC, sa.bucket_id ASC
      `,
      [merchantId],
    );

    res.json({
      settlements: settlementsResult.rows,
      allocations: allocationsResult.rows,
    });
  } catch (error) {
    console.error("settlements route error", error);
    res.status(500).json({ error: "Failed to load settlements" });
  }
});