import { Router } from "express";
import { query } from "../../db.js";

export const merchantRailsRouter = Router();

merchantRailsRouter.get("/:owner", async (req, res) => {
  try {
    const owner = req.params.owner;

    const result = await query(
      `
        SELECT *
        FROM merchant_receive_rails
        WHERE owner = $1
        LIMIT 1
      `,
      [owner],
    );

    res.json({
      rails: result.rows[0] ?? null,
    });
  } catch (error) {
    console.error("merchant rails get route error", error);
    res.status(500).json({ error: "Failed to load merchant rails" });
  }
});

merchantRailsRouter.post("/", async (req, res) => {
  try {
    const {
      owner,
      stacksAddress,
      btcAddress,
      usdcAddress,
      usdcxAddress,
    } = req.body ?? {};

    if (!owner) {
      return res.status(400).json({ error: "owner is required" });
    }

    await query(
      `
        INSERT INTO merchant_receive_rails (
          owner,
          stacks_address,
          btc_address,
          usdc_address,
          usdcx_address,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (owner) DO UPDATE SET
          stacks_address = EXCLUDED.stacks_address,
          btc_address = EXCLUDED.btc_address,
          usdc_address = EXCLUDED.usdc_address,
          usdcx_address = EXCLUDED.usdcx_address,
          updated_at = EXCLUDED.updated_at
      `,
      [
        owner,
        stacksAddress ?? null,
        btcAddress ?? null,
        usdcAddress ?? null,
        usdcxAddress ?? null,
        Math.floor(Date.now() / 1000),
      ],
    );

    const result = await query(
      `
        SELECT *
        FROM merchant_receive_rails
        WHERE owner = $1
        LIMIT 1
      `,
      [owner],
    );

    res.json({
      rails: result.rows[0] ?? null,
    });
  } catch (error) {
    console.error("merchant rails post route error", error);
    res.status(500).json({ error: "Failed to save merchant rails" });
  }
});
