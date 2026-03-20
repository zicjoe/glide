import { Router } from "express";
import { query } from "../../db.js";
import { syncInvoices } from "../../sync/invoices.js";

export const checkoutConfirmPaymentRouter = Router();

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function railToObservedAsset(assetLabel: string) {
  switch (assetLabel.toUpperCase()) {
    case "SBTC":
      return 0;
    case "USDCX":
      return 1;
    default:
      return null;
  }
}

checkoutConfirmPaymentRouter.post("/", async (req, res) => {
  try {
    const {
      reference,
      merchantId,
      rail,
      assetLabel,
      amount,
      txid,
      receiveAddress,
    } = req.body ?? {};

    if (
      !reference ||
      !merchantId ||
      !rail ||
      !assetLabel ||
      amount == null ||
      !txid ||
      !receiveAddress
    ) {
      return res.status(400).json({ error: "missing required payment confirmation fields" });
    }

    const merchantIdNum = Number(merchantId);
    const paidAmount = Number(amount);
    const timestamp = nowTs();

    let invoiceResult = await query(
      `
        SELECT *
        FROM invoices
        WHERE reference = $1
          AND merchant_id = $2
        LIMIT 1
      `,
      [String(reference), merchantIdNum],
    );

    let invoice = invoiceResult.rows[0] ?? null;
    let provisional = false;

    if (!invoice) {
      const provisionalResult = await query(
        `
          SELECT *
          FROM provisional_invoices
          WHERE reference = $1
            AND merchant_id = $2
          LIMIT 1
        `,
        [String(reference), merchantIdNum],
      );

      invoice = provisionalResult.rows[0] ?? null;
      provisional = Boolean(invoice);
    }

    if (!invoice) {
      await syncInvoices(merchantIdNum);

      invoiceResult = await query(
        `
          SELECT *
          FROM invoices
          WHERE reference = $1
            AND merchant_id = $2
          LIMIT 1
        `,
        [String(reference), merchantIdNum],
      );

      invoice = invoiceResult.rows[0] ?? null;
      provisional = false;
    }

    if (!invoice) {
      return res.status(409).json({
        error: "invoice not found yet, try again in a few seconds",
      });
    }

    const invoiceId = provisional ? 0 : Number(invoice.invoice_id ?? 0);

    let selectedRail = null;

    if (!provisional && invoiceId > 0) {
      const railResult = await query(
        `
          SELECT *
          FROM invoice_payment_rails
          WHERE invoice_id = $1
            AND rail = $2
          LIMIT 1
        `,
        [invoiceId, String(rail)],
      );

      selectedRail = railResult.rows[0] ?? null;
    }

    if (!selectedRail) {
      const normalizedAsset = Number(invoice.asset);
      const normalizedAmount = Number(invoice.amount);

      selectedRail = {
        rail: String(rail),
        asset_label: String(assetLabel),
        amount: paidAmount,
        route_type: `${String(rail)}_manual_confirm`,
        cashback_eligible: false,
        cashback_bps: 0,
        cashback_amount: 0,
        normalized_asset: normalizedAsset,
        normalized_amount: normalizedAmount,
      };
    }

    const normalizedAsset = Number(selectedRail.normalized_asset);
    const normalizedAmount = Number(selectedRail.normalized_amount);

    const receiptResult = await query(
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
        merchantIdNum,
        String(reference),
        String(assetLabel),
        paidAmount,
        String(receiveAddress),
        String(txid),
        "confirmed",
        String(reference),
        timestamp,
        timestamp,
      ],
    );

    const observedAsset = railToObservedAsset(String(assetLabel));

    if (!provisional && invoiceId > 0) {
      await query(
        `
          INSERT INTO invoice_payment_status (
            invoice_id,
            merchant_id,
            payment_status,
            observed_amount,
            observed_asset,
            observed_txid,
            observed_at,
            confirmed_at,
            updated_at,
            selected_payment_rail,
            quoted_amount,
            quoted_asset,
            route_type,
            route_status,
            normalized_asset,
            normalized_amount,
            cashback_eligible,
            cashback_bps,
            cashback_amount
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
          ON CONFLICT (invoice_id) DO UPDATE SET
            payment_status = EXCLUDED.payment_status,
            observed_amount = EXCLUDED.observed_amount,
            observed_asset = EXCLUDED.observed_asset,
            observed_txid = EXCLUDED.observed_txid,
            observed_at = EXCLUDED.observed_at,
            confirmed_at = EXCLUDED.confirmed_at,
            updated_at = EXCLUDED.updated_at,
            selected_payment_rail = EXCLUDED.selected_payment_rail,
            quoted_amount = EXCLUDED.quoted_amount,
            quoted_asset = EXCLUDED.quoted_asset,
            route_type = EXCLUDED.route_type,
            route_status = EXCLUDED.route_status,
            normalized_asset = EXCLUDED.normalized_asset,
            normalized_amount = EXCLUDED.normalized_amount,
            cashback_eligible = EXCLUDED.cashback_eligible,
            cashback_bps = EXCLUDED.cashback_bps,
            cashback_amount = EXCLUDED.cashback_amount
        `,
        [
          invoiceId,
          merchantIdNum,
          "payment_confirmed",
          paidAmount,
          observedAsset,
          String(txid),
          timestamp,
          timestamp,
          timestamp,
          String(rail),
          Number(selectedRail.amount),
          String(assetLabel),
          String(selectedRail.route_type),
          "confirmed",
          normalizedAsset,
          normalizedAmount,
          Boolean(selectedRail.cashback_eligible),
          Number(selectedRail.cashback_bps),
          Number(selectedRail.cashback_amount),
        ],
      );
    }

    const settlementNonceResult = await query(
      `
        SELECT COALESCE(MAX(settlement_id), 0) + 1 AS next_id
        FROM settlements
      `,
    );

    const settlementId = Number(settlementNonceResult.rows[0]?.next_id ?? 1);
    const grossAmount = normalizedAmount;
    const feeAmount = 0;
    const netAmount = grossAmount - feeAmount;

    await query(
      `
        INSERT INTO settlements (
          settlement_id,
          merchant_id,
          invoice_id,
          asset,
          gross_amount,
          fee_amount,
          net_amount,
          status,
          created_at,
          completed_at,
          executor
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        settlementId,
        merchantIdNum,
        invoiceId,
        normalizedAsset,
        grossAmount,
        feeAmount,
        netAmount,
        2,
        timestamp,
        timestamp,
        "demo-manual-confirm",
      ],
    );

    const bucketsResult = await query(
      `
        SELECT *
        FROM treasury_buckets
        WHERE merchant_id = $1
          AND enabled = true
        ORDER BY bucket_id ASC
      `,
      [merchantIdNum],
    );

    const buckets = bucketsResult.rows;

    let allocations: Array<{
      bucketId: number;
      allocationBps: number;
      amount: number;
      destinationId: number;
    }> = [];

    if (buckets.length > 0) {
      let allocatedSoFar = 0;

      allocations = buckets.map((bucket, index) => {
        const allocationBps = Number(bucket.allocation_bps);
        const bucketAmount =
          index === buckets.length - 1
            ? netAmount - allocatedSoFar
            : Math.floor((netAmount * allocationBps) / 10000);

        allocatedSoFar += bucketAmount;

        return {
          bucketId: Number(bucket.bucket_id),
          allocationBps,
          amount: bucketAmount,
          destinationId: Number(bucket.destination_id),
        };
      });

      for (const allocation of allocations) {
        await query(
          `
            INSERT INTO settlement_allocations (
              settlement_id,
              bucket_id,
              allocation_bps,
              amount,
              destination_id
            )
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT (settlement_id, bucket_id) DO UPDATE SET
              allocation_bps = EXCLUDED.allocation_bps,
              amount = EXCLUDED.amount,
              destination_id = EXCLUDED.destination_id
          `,
          [
            settlementId,
            allocation.bucketId,
            allocation.allocationBps,
            allocation.amount,
            allocation.destinationId,
          ],
        );

        await query(
          `
            INSERT INTO vault_balances (
              merchant_id,
              bucket_id,
              asset,
              available,
              queued,
              deployed,
              updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (merchant_id, bucket_id, asset) DO UPDATE SET
              available = vault_balances.available + EXCLUDED.available,
              updated_at = EXCLUDED.updated_at
          `,
          [
            merchantIdNum,
            allocation.bucketId,
            normalizedAsset,
            allocation.amount,
            0,
            0,
            timestamp,
          ],
        );
      }
    }

    await query(
      `
        DELETE FROM provisional_invoices
        WHERE reference = $1
      `,
      [String(reference)],
    );

    res.json({
      ok: true,
      provisional,
      receipt: receiptResult.rows[0] ?? null,
      settlement: {
        settlementId,
        merchantId: merchantIdNum,
        invoiceId,
        asset: normalizedAsset,
        grossAmount,
        feeAmount,
        netAmount,
        status: 2,
      },
      allocations,
    });
  } catch (error) {
    console.error("checkout confirm payment route error", error);
    res.status(500).json({ error: "failed to confirm payment" });
  }
});