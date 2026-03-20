import { Router } from "express";
import { query } from "../../db.js";
import { config } from "../../config.js";

export const conversionsRouter = Router();

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function assetDecimals(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "BTC":
    case "SBTC":
      return 8;
    case "STX":
      return 6;
    case "USDC":
    case "USDCX":
      return 6;
    default:
      return 0;
  }
}

function fromBaseUnits(amount: number, symbol: string) {
  return amount / Math.pow(10, assetDecimals(symbol));
}

function toBaseUnits(amount: number, symbol: string) {
  return Math.round(amount * Math.pow(10, assetDecimals(symbol)));
}

function usdPrice(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "STX":
      return config.stxUsd;
    case "BTC":
      return config.btcUsd;
    case "SBTC":
      return config.btcUsd * config.sbtcBtc;
    case "USDC":
      return config.usdcUsd;
    case "USDCX":
      return config.usdcxUsd;
    default:
      return 0;
  }
}

conversionsRouter.post("/quote", async (req, res) => {
  try {
    const { fromAsset, toAsset, fromAmount } = req.body ?? {};

    if (!fromAsset || !toAsset || !fromAmount) {
      return res.status(400).json({ error: "fromAsset, toAsset and fromAmount are required" });
    }

    const fromSymbol = String(fromAsset).toUpperCase();
    const toSymbol = String(toAsset).toUpperCase();
    const fromAmountBase = Number(fromAmount);

    if (Number.isNaN(fromAmountBase) || fromAmountBase <= 0) {
      return res.status(400).json({ error: "fromAmount must be a positive integer in base units" });
    }

    const fromHuman = fromBaseUnits(fromAmountBase, fromSymbol);
    const fromUsd = fromHuman * usdPrice(fromSymbol);

    if (fromUsd <= 0) {
      return res.status(400).json({ error: "unsupported conversion pair" });
    }

    const toHuman = fromUsd / usdPrice(toSymbol);
    const toAmountBase = toBaseUnits(toHuman, toSymbol);
    const rate = toHuman / fromHuman;

    res.json({
      quote: {
        fromAsset: fromSymbol,
        toAsset: toSymbol,
        fromAmount: fromAmountBase,
        toAmount: toAmountBase,
        rate,
        quotedAt: nowTs(),
        mode: "static",
      },
    });
  } catch (error) {
    console.error("conversion quote route error", error);
    res.status(500).json({ error: "Failed to create conversion quote" });
  }
});

conversionsRouter.post("/", async (req, res) => {
  try {
    const {
      merchantId,
      fromAsset,
      toAsset,
      fromAmount,
      toAmount,
      quoteRate,
      sourceAddress,
      destinationAddress,
      txid,
      status,
      metadata,
    } = req.body ?? {};

    if (!merchantId || !fromAsset || !toAsset || !fromAmount || !toAmount || !quoteRate) {
      return res.status(400).json({
        error: "merchantId, fromAsset, toAsset, fromAmount, toAmount and quoteRate are required",
      });
    }

    const createdAt = nowTs();

    const result = await query(
      `
        INSERT INTO conversion_transactions (
          merchant_id,
          from_asset,
          to_asset,
          from_amount,
          to_amount,
          quote_rate,
          source_address,
          destination_address,
          txid,
          status,
          metadata_json,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13)
        RETURNING *
      `,
      [
        Number(merchantId),
        String(fromAsset).toUpperCase(),
        String(toAsset).toUpperCase(),
        Number(fromAmount),
        Number(toAmount),
        Number(quoteRate),
        sourceAddress ?? null,
        destinationAddress ?? null,
        txid ?? null,
        status ?? "requested",
        JSON.stringify(metadata ?? {}),
        createdAt,
        createdAt,
      ],
    );

    res.json({
      conversion: result.rows[0],
    });
  } catch (error) {
    console.error("conversion create route error", error);
    res.status(500).json({ error: "Failed to record conversion" });
  }
});

conversionsRouter.patch("/:conversionId/status", async (req, res) => {
  try {
    const conversionId = Number(req.params.conversionId);
    const { status, txid, metadata } = req.body ?? {};

    if (!conversionId || Number.isNaN(conversionId)) {
      return res.status(400).json({ error: "valid conversionId is required" });
    }

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const existing = await query(
      `
        SELECT *
        FROM conversion_transactions
        WHERE conversion_id = $1
        LIMIT 1
      `,
      [conversionId],
    );

    const row = existing.rows[0];
    if (!row) {
      return res.status(404).json({ error: "conversion not found" });
    }

    const mergedMetadata = {
      ...(row.metadata_json ?? {}),
      ...(metadata ?? {}),
    };

    const result = await query(
      `
        UPDATE conversion_transactions
        SET
          status = $2,
          txid = COALESCE($3, txid),
          metadata_json = $4::jsonb,
          updated_at = $5
        WHERE conversion_id = $1
        RETURNING *
      `,
      [
        conversionId,
        status,
        txid ?? null,
        JSON.stringify(mergedMetadata),
        nowTs(),
      ],
    );

    res.json({
      conversion: result.rows[0],
    });
  } catch (error) {
    console.error("conversion status route error", error);
    res.status(500).json({ error: "Failed to update conversion" });
  }
});

conversionsRouter.get("/", async (req, res) => {
  try {
    const merchantId = Number(req.query.merchantId);

    if (!merchantId || Number.isNaN(merchantId)) {
      return res.status(400).json({ error: "merchantId is required" });
    }

    const result = await query(
      `
        SELECT *
        FROM conversion_transactions
        WHERE merchant_id = $1
        ORDER BY conversion_id DESC
        LIMIT 50
      `,
      [merchantId],
    );

    res.json({
      conversions: result.rows,
    });
  } catch (error) {
    console.error("conversion list route error", error);
    res.status(500).json({ error: "Failed to load conversions" });
  }
});