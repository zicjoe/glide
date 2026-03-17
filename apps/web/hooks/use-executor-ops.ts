"use client";

import { useState } from "react";
import { writeCreateSettlement } from "@/lib/contracts/writers";

type SettleArgs = {
  merchantId: number;
  invoiceId: number;
  grossAmount: number;
  feeAmount: number;
};

export function useExecutorOps() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createSettlement(args: SettleArgs) {
    try {
      setSubmitting(true);
      setMessage("Submitting settlement transaction...");

      await writeCreateSettlement({
        merchantId: args.merchantId,
        invoiceId: args.invoiceId,
        grossAmount: args.grossAmount,
        feeAmount: args.feeAmount,
      });

      setMessage("Settlement submitted successfully.");
      return true;
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to create settlement",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  function clearMessage() {
    setMessage(null);
  }

  return {
    submitting,
    message,
    createSettlement,
    clearMessage,
  };
}