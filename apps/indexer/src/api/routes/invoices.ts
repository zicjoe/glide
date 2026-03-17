import { Router } from "express";
import { query } from "../../db.js";

export const invoicesRouter = Router();

invoicesRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    const result = await query(
      `
        SELECT *
        FROM invoices
        WHERE merchant_id = $1
        ORDER BY invoice_id DESC
      `,
      [merchantId],
    );

    res.json({
      invoices: result.rows,
    });
  } catch (error) {
    console.error("invoices route error", error);
    res.status(500).json({ error: "Failed to load invoices" });
  }
});