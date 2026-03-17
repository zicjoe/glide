import { Router } from "express";
import { query } from "../../db.js";

export const merchantRouter = Router();

merchantRouter.get("/:owner", async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM merchants WHERE owner = $1 LIMIT 1`,
      [req.params.owner],
    );

    res.json({ merchant: result.rows[0] ?? null });
  } catch (error) {
    console.error("merchant route error", error);
    res.status(500).json({ error: "Failed to load merchant" });
  }
});