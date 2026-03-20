import { Router } from "express";
import { query } from "../../db.js";

export const provisionalInvoicesRouter = Router();

provisionalInvoicesRouter.post("/", async (req, res) => {
  try {
    const {
      reference,
      merchantId,
      asset,
      amount,
      description,
      expiryAt,
      destinationId,
      paymentDestination,
      status,
    } = req.body ?? {};

    if (!reference || !merchantId || asset == null || amount == null || !description || !expiryAt || !paymentDestination) {
      return res.status(400).json({ error: "missing required provisional invoice fields" });
    }

    await query(
      `
        INSERT INTO provisional_invoices (
          reference,
          merchant_id,
          asset,
          amount,
          description,
          expiry_at,
          destination_id,
          payment_destination,
          status,
          created_at,
          paid_at,
          settlement_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (reference) DO UPDATE SET
          merchant_id = EXCLUDED.merchant_id,
          asset = EXCLUDED.asset,
          amount = EXCLUDED.amount,
          description = EXCLUDED.description,
          expiry_at = EXCLUDED.expiry_at,
          destination_id = EXCLUDED.destination_id,
          payment_destination = EXCLUDED.payment_destination,
          status = EXCLUDED.status
      `,
      [
        String(reference),
        Number(merchantId),
        Number(asset),
        Number(amount),
        String(description),
        Number(expiryAt),
        destinationId == null ? null : Number(destinationId),
        String(paymentDestination),
        Number(status ?? 0),
        Math.floor(Date.now() / 1000),
        0,
        null,
      ],
    );

    const result = await query(
      `
        SELECT *
        FROM provisional_invoices
        WHERE reference = $1
        LIMIT 1
      `,
      [String(reference)],
    );

    res.json({
      invoice: result.rows[0] ?? null,
    });
  } catch (error) {
    console.error("provisional invoice post route error", error);
    res.status(500).json({ error: "failed to save provisional invoice" });
  }
});