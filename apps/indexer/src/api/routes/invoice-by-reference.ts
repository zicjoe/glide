import { Router } from "express";
import { query } from "../../db.js";

export const invoiceByReferenceRouter = Router();

invoiceByReferenceRouter.get("/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;

    const invoiceResult = await query(
      `
        SELECT *
        FROM invoices
        WHERE reference = $1
        LIMIT 1
      `,
      [reference],
    );

    const invoice = invoiceResult.rows[0] ?? null;

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const merchantId = Number(invoice.merchant_id);
    const invoiceId = Number(invoice.invoice_id);

    const policyResult = await query(
      `
        SELECT *
        FROM treasury_policies
        WHERE merchant_id = $1
        LIMIT 1
      `,
      [merchantId],
    );

    const destinationResult = await query(
      `
        SELECT *
        FROM payout_destinations
        WHERE merchant_id = $1
          AND asset = $2
          AND enabled = true
        ORDER BY destination_id ASC
        LIMIT 1
      `,
      [merchantId, Number(invoice.asset)],
    );

    const paymentStatusResult = await query(
      `
        SELECT *
        FROM invoice_payment_status
        WHERE invoice_id = $1
        LIMIT 1
      `,
      [invoiceId],
    );

    res.json({
      invoice,
      policy: policyResult.rows[0] ?? null,
      paymentDestination: destinationResult.rows[0] ?? null,
      paymentStatus: paymentStatusResult.rows[0] ?? null,
    });
  } catch (error) {
    console.error("invoice by reference route error", error);
    res.status(500).json({ error: "Failed to load invoice checkout" });
  }
});
