import { Router } from "express";
import { query } from "../../db.js";

export const activityRouter = Router();

activityRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);
    const limit = Math.min(Number(req.query.limit || 20), 100);

    const result = await query(
      `
        SELECT *
        FROM activity_events
        WHERE merchant_id = $1
        ORDER BY created_at DESC, id DESC
        LIMIT $2
      `,
      [merchantId, limit],
    );

    res.json({
      activities: result.rows,
    });
  } catch (error) {
    console.error("activity route error", error);
    res.status(500).json({ error: "Failed to load activity" });
  }
});
