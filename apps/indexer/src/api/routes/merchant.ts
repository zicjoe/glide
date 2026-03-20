import { Router } from "express";
import { query } from "../../db.js";
import { syncMerchantByOwner } from "../../sync/merchants.js";

export const merchantRouter = Router();

merchantRouter.get("/:owner", async (req, res) => {
  try {
    const owner = req.params.owner;

    await syncMerchantByOwner(owner);

    const result = await query(
      `SELECT * FROM merchants WHERE owner = $1 LIMIT 1`,
      [owner],
    );

    res.json({ merchant: result.rows[0] ?? null });
  } catch (error) {
    console.error("merchant route error", error);
    res.status(500).json({ error: "Failed to load merchant" });
  }
});