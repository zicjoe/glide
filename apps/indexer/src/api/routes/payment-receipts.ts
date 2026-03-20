import { Router } from "express";
import { query } from "../../db.js";

export const paymentReceiptsRouter = Router();

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

paymentReceiptsRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    if (!merchantId || Number.isNaN(merchantId)) {
      return res.status(400).json({ error: "merchantId is required" });
    }

    const result = await query(
      `
        SELECT *
        FROM payment_receipts
        WHERE merchant_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `,
      [merchantId],
    );

    res.json({
      receipts: result.rows,
    });
  } catch (error) {
    console.error("payment receipts get route error", error);
    res.status(500).json({ error: "Failed to load payment receipts" });
  }
});

paymentReceiptsRouter.post("/", async (req, res) => {
  try {
    const {
      merchantId,
      reference,
      assetLabel,
      amount,
      receiveAddress,
      txid,
      status,
      invoiceReference,
    } = req.body ?? {};

    if (
      !merchantId ||
      !assetLabel ||
      amount == null ||
      !receiveAddress ||
      !txid
    ) {
      return res.status(400).json({ error: "missing required receipt fields" });
    }

    const timestamp = nowTs();

    const result = await query(
      `
        INSERT INTO payment_receipts (
          merchant_id,
          reference,
          asset_label,
          amount,
          receive_address,
          txid,
          status,
          invoice_reference,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (txid) DO UPDATE SET
          status = EXCLUDED.status,
          invoice_reference = EXCLUDED.invoice_reference,
          updated_at = EXCLUDED.updated_at
        RETURNING *
      `,
      [
        Number(merchantId),
        reference ? String(reference) : null,
        String(assetLabel),
        Number(amount),
        String(receiveAddress),
        String(txid),
        String(status ?? "received"),
        invoiceReference ? String(invoiceReference) : null,
        timestamp,
        timestamp,
      ],
    );

    res.json({
      receipt: result.rows[0] ?? null,
    });
  } catch (error) {
    console.error("payment receipts post route error", error);
    res.status(500).json({ error: "Failed to save payment receipt" });
  }
});