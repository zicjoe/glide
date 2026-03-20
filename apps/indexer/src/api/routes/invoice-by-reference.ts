import { Router } from "express";
import { query } from "../../db.js";
import { syncInvoices } from "../../sync/invoices.js";
import { config } from "../../config.js";

export const invoiceByReferenceRouter = Router();

function railDecimals(label: string) {
  switch (label.toUpperCase()) {
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

function fromBaseUnits(amount: number, decimals: number) {
  return amount / Math.pow(10, decimals);
}

function toBaseUnits(amount: number, decimals: number) {
  return Math.round(amount * Math.pow(10, decimals));
}

function settlementAssetLabel(asset: number) {
  return asset === 0 ? "sBTC" : "USDCx";
}

function settlementUsdPrice(asset: number) {
  return asset === 0 ? config.btcUsd * config.sbtcBtc : config.usdcxUsd;
}

function railUsdPrice(label: string) {
  switch (label.toUpperCase()) {
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

function quoteSettlementToRail(settlementAsset: number, settlementAmountBase: number, railLabel: string) {
  const settlementDecimals = settlementAsset === 0 ? 8 : 6;
  const settlementHuman = fromBaseUnits(settlementAmountBase, settlementDecimals);
  const usdValue = settlementHuman * settlementUsdPrice(settlementAsset);
  const railHuman = usdValue / railUsdPrice(railLabel);
  return toBaseUnits(railHuman, railDecimals(railLabel));
}

function buildRailOptions(invoice: any, merchantRails: any) {
  const settlementAsset = Number(invoice.asset);
  const settlementAmount = Number(invoice.amount);

  const stacksAddress =
    merchantRails?.stacks_address || invoice.payment_destination || null;
  const btcAddress = merchantRails?.btc_address || null;
  const usdcAddress = merchantRails?.usdc_address || null;
  const usdcxAddress =
    merchantRails?.usdcx_address || merchantRails?.stacks_address || invoice.payment_destination || null;

  if (settlementAsset === 0) {
    return [
      {
        rail: "sbtc",
        label: "Pay with sBTC",
        assetLabel: "sBTC",
        amount: settlementAmount,
        normalizedAsset: 0,
        normalizedAmount: settlementAmount,
        customerStatusLabel: "Native",
        cashbackEligible: true,
        cashbackBps: 0,
        cashbackAmount: 0,
        routeType: "direct",
        visibleMessage: "Pay directly in sBTC to the native settlement address.",
        address: stacksAddress,
        addressLabel: "Stacks address",
      },
      {
        rail: "stx",
        label: "Pay with STX",
        assetLabel: "STX",
        amount: quoteSettlementToRail(0, settlementAmount, "STX"),
        normalizedAsset: 0,
        normalizedAmount: settlementAmount,
        customerStatusLabel: "Alternative",
        cashbackEligible: false,
        cashbackBps: 0,
        cashbackAmount: 0,
        routeType: "stx_to_sbtc",
        visibleMessage: "Pay with STX. Glide records this as an STX conversion path into sBTC settlement.",
        address: stacksAddress,
        addressLabel: "Stacks address",
      },
      {
        rail: "btc",
        label: "Pay with BTC",
        assetLabel: "BTC",
        amount: quoteSettlementToRail(0, settlementAmount, "BTC"),
        normalizedAsset: 0,
        normalizedAmount: settlementAmount,
        customerStatusLabel: "Alternative",
        cashbackEligible: false,
        cashbackBps: 0,
        cashbackAmount: 0,
        routeType: "btc_to_sbtc",
        visibleMessage: "Pay with BTC. Glide keeps merchant settlement normalized to sBTC.",
        address: btcAddress,
        addressLabel: "Bitcoin address",
      },
      {
        rail: "usdcx",
        label: "Pay with USDCx",
        assetLabel: "USDCx",
        amount: quoteSettlementToRail(0, settlementAmount, "USDCx"),
        normalizedAsset: 0,
        normalizedAmount: settlementAmount,
        customerStatusLabel: "Alternative",
        cashbackEligible: false,
        cashbackBps: 0,
        cashbackAmount: 0,
        routeType: "usdcx_to_sbtc",
        visibleMessage: "Pay with USDCx. Glide keeps merchant settlement normalized to sBTC.",
        address: usdcxAddress,
        addressLabel: "Stacks address",
      },
      {
        rail: "usdc",
        label: "Pay with USDC",
        assetLabel: "USDC",
        amount: quoteSettlementToRail(0, settlementAmount, "USDC"),
        normalizedAsset: 0,
        normalizedAmount: settlementAmount,
        customerStatusLabel: "Alternative",
        cashbackEligible: false,
        cashbackBps: 0,
        cashbackAmount: 0,
        routeType: "usdc_to_sbtc",
        visibleMessage: "Pay with USDC. Glide keeps merchant settlement normalized to sBTC.",
        address: usdcAddress,
        addressLabel: "USDC address",
      },
    ];
  }

  return [
    {
      rail: "usdcx",
      label: "Pay with USDCx",
      assetLabel: "USDCx",
      amount: settlementAmount,
      normalizedAsset: 1,
      normalizedAmount: settlementAmount,
      customerStatusLabel: "Native",
      cashbackEligible: true,
      cashbackBps: 0,
      cashbackAmount: 0,
      routeType: "direct",
      visibleMessage: "Pay directly in USDCx to the native settlement address.",
      address: usdcxAddress,
      addressLabel: "Stacks address",
    },
    {
      rail: "stx",
      label: "Pay with STX",
      assetLabel: "STX",
      amount: quoteSettlementToRail(1, settlementAmount, "STX"),
      normalizedAsset: 1,
      normalizedAmount: settlementAmount,
      customerStatusLabel: "Alternative",
      cashbackEligible: false,
      cashbackBps: 0,
      cashbackAmount: 0,
      routeType: "stx_to_usdcx",
      visibleMessage: "Pay with STX. Glide records this as an STX conversion path into USDCx settlement.",
      address: stacksAddress,
      addressLabel: "Stacks address",
    },
    {
      rail: "usdc",
      label: "Pay with USDC",
      assetLabel: "USDC",
      amount: quoteSettlementToRail(1, settlementAmount, "USDC"),
      normalizedAsset: 1,
      normalizedAmount: settlementAmount,
      customerStatusLabel: "Alternative",
      cashbackEligible: false,
      cashbackBps: 0,
      cashbackAmount: 0,
      routeType: "usdc_to_usdcx",
      visibleMessage: "Pay with USDC. Glide keeps merchant settlement normalized to USDCx.",
      address: usdcAddress,
      addressLabel: "USDC address",
    },
    {
      rail: "sbtc",
      label: "Pay with sBTC",
      assetLabel: "sBTC",
      amount: quoteSettlementToRail(1, settlementAmount, "sBTC"),
      normalizedAsset: 1,
      normalizedAmount: settlementAmount,
      customerStatusLabel: "Alternative",
      cashbackEligible: false,
      cashbackBps: 0,
      cashbackAmount: 0,
      routeType: "sbtc_to_usdcx",
      visibleMessage: "Pay with sBTC. Glide keeps merchant settlement normalized to USDCx.",
      address: stacksAddress,
      addressLabel: "Stacks address",
    },
    {
      rail: "btc",
      label: "Pay with BTC",
      assetLabel: "BTC",
      amount: quoteSettlementToRail(1, settlementAmount, "BTC"),
      normalizedAsset: 1,
      normalizedAmount: settlementAmount,
      customerStatusLabel: "Alternative",
      cashbackEligible: false,
      cashbackBps: 0,
      cashbackAmount: 0,
      routeType: "btc_to_usdcx",
      visibleMessage: "Pay with BTC. Glide keeps merchant settlement normalized to USDCx.",
      address: btcAddress,
      addressLabel: "Bitcoin address",
    },
  ];
}

async function snapshotInvoiceRails(invoiceId: number, rails: any[]) {
  await query(`DELETE FROM invoice_payment_rails WHERE invoice_id = $1`, [invoiceId]);

  for (const rail of rails) {
    await query(
      `
        INSERT INTO invoice_payment_rails (
          invoice_id,
          rail,
          label,
          asset_label,
          amount,
          normalized_asset,
          normalized_amount,
          customer_status_label,
          cashback_eligible,
          cashback_bps,
          cashback_amount,
          route_type,
          visible_message,
          address,
          address_label,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      `,
      [
        invoiceId,
        rail.rail,
        rail.label,
        rail.assetLabel,
        rail.amount,
        rail.normalizedAsset,
        rail.normalizedAmount,
        rail.customerStatusLabel,
        rail.cashbackEligible,
        rail.cashbackBps,
        rail.cashbackAmount,
        rail.routeType,
        rail.visibleMessage,
        rail.address,
        rail.addressLabel,
        Math.floor(Date.now() / 1000),
      ],
    );
  }
}

invoiceByReferenceRouter.get("/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;

    let invoiceResult = await query(
      `
        SELECT *
        FROM invoices
        WHERE reference = $1
        LIMIT 1
      `,
      [reference],
    );

    let invoice = invoiceResult.rows[0] ?? null;

    if (!invoice) {
      const merchantsResult = await query(
        `
          SELECT merchant_id
          FROM merchants
          ORDER BY merchant_id ASC
        `,
      );

      for (const row of merchantsResult.rows) {
        const merchantId = Number(row.merchant_id);

        try {
          await syncInvoices(merchantId);
        } catch (syncError) {
          console.error(
            `invoice by reference sync failed for merchant ${merchantId}`,
            syncError,
          );
        }
      }

      invoiceResult = await query(
        `
          SELECT *
          FROM invoices
          WHERE reference = $1
          LIMIT 1
        `,
        [reference],
      );

      invoice = invoiceResult.rows[0] ?? null;
    }

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const merchantId = Number(invoice.merchant_id);
    const invoiceId = Number(invoice.invoice_id);
    const destinationId =
      invoice.destination_id == null ? null : Number(invoice.destination_id);

    const policyResult = await query(
      `
        SELECT *
        FROM treasury_policies
        WHERE merchant_id = $1
        LIMIT 1
      `,
      [merchantId],
    );

    const merchantResult = await query(
      `
        SELECT *
        FROM merchants
        WHERE merchant_id = $1
        LIMIT 1
      `,
      [merchantId],
    );

    const merchantOwner = merchantResult.rows[0]?.owner ?? null;

    let merchantRails = null;

    if (merchantOwner) {
      const merchantRailsResult = await query(
        `
          SELECT *
          FROM merchant_receive_rails
          WHERE owner = $1
          LIMIT 1
        `,
        [merchantOwner],
      );

      merchantRails = merchantRailsResult.rows[0] ?? null;
    }

    let paymentDestination = null;

    if (destinationId != null) {
      const destinationResult = await query(
        `
          SELECT *
          FROM payout_destinations
          WHERE merchant_id = $1
            AND destination_id = $2
          LIMIT 1
        `,
        [merchantId, destinationId],
      );

      paymentDestination = destinationResult.rows[0] ?? null;
    }

    if (!paymentDestination && invoice.payment_destination) {
      paymentDestination = {
        merchant_id: merchantId,
        destination_id: destinationId,
        label: "Invoice Payment Address",
        asset: Number(invoice.asset),
        destination: invoice.payment_destination,
        destination_type: null,
        enabled: true,
        created_at: Number(invoice.created_at),
      };
    }

    const paymentStatusResult = await query(
      `
        SELECT *
        FROM invoice_payment_status
        WHERE invoice_id = $1
        LIMIT 1
      `,
      [invoiceId],
    );

    let railsResult = await query(
      `
        SELECT *
        FROM invoice_payment_rails
        WHERE invoice_id = $1
        ORDER BY rail ASC
      `,
      [invoiceId],
    );

    if (railsResult.rows.length === 0) {
      const generatedRails = buildRailOptions(invoice, merchantRails);
      await snapshotInvoiceRails(invoiceId, generatedRails);

      railsResult = await query(
        `
          SELECT *
          FROM invoice_payment_rails
          WHERE invoice_id = $1
          ORDER BY rail ASC
        `,
        [invoiceId],
      );
    }

    const rails = railsResult.rows.map((row) => ({
      rail: row.rail,
      label: row.label,
      assetLabel: row.asset_label,
      amount: Number(row.amount),
      normalizedAsset: Number(row.normalized_asset),
      normalizedAmount: Number(row.normalized_amount),
      customerStatusLabel: row.customer_status_label,
      cashbackEligible: Boolean(row.cashback_eligible),
      cashbackBps: Number(row.cashback_bps),
      cashbackAmount: Number(row.cashback_amount),
      routeType: row.route_type,
      visibleMessage: row.visible_message,
      address: row.address,
      addressLabel: row.address_label,
    }));

    const settlementAsset = Number(invoice.asset);
    const defaultRail =
      settlementAsset === 0
        ? rails.find((item) => item.rail === "sbtc")?.rail ?? rails[0]?.rail ?? null
        : rails.find((item) => item.rail === "usdcx")?.rail ?? rails[0]?.rail ?? null;

    res.json({
      invoice,
      policy: policyResult.rows[0] ?? null,
      paymentDestination,
      paymentStatus: paymentStatusResult.rows[0] ?? null,
      checkout: {
        settlementAsset,
        settlementAssetLabel: settlementAssetLabel(settlementAsset),
        settlementAmount: Number(invoice.amount),
        quoteSource: {
          btcUsd: config.btcUsd,
          usdcUsd: config.usdcUsd,
          usdcxUsd: config.usdcxUsd,
          sbtcBtc: config.sbtcBtc,
          mode: "static",
        },
        defaultRail,
        rails,
      },
    });
  } catch (error) {
    console.error("invoice by reference route error", error);
    res.status(500).json({ error: "Failed to load invoice checkout" });
  }
});