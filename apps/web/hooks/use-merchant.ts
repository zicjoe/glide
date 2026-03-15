"use client";

import { useEffect, useState } from "react";
import { glideReadClient } from "@/lib/stacks/client";
import { readMerchant, readMerchantIdByOwner } from "@/lib/contracts/readers";
import type { Merchant } from "@/lib/contracts/types";

type UseMerchantOptions = {
  merchantId?: number | null;
  owner?: string | null;
  enabled?: boolean;
};

type UseMerchantResult = {
  merchant: Merchant | null;
  merchantId: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useMerchant(options: UseMerchantOptions = {}): UseMerchantResult {
  const { merchantId: merchantIdInput, owner, enabled = true } = options;

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [merchantId, setMerchantId] = useState<number | null>(
    merchantIdInput ?? null,
  );
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let resolvedMerchantId = merchantIdInput ?? null;

      if (resolvedMerchantId == null && owner) {
        resolvedMerchantId = await readMerchantIdByOwner(glideReadClient, owner);
      }

      if (resolvedMerchantId == null) {
        setMerchant(null);
        setMerchantId(null);
        return;
      }

      const merchantData = await readMerchant(glideReadClient, resolvedMerchantId);
      setMerchant(merchantData);
      setMerchantId(resolvedMerchantId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load merchant";
      setError(message);
      setMerchant(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantIdInput, owner, enabled]);

  return {
    merchant,
    merchantId,
    loading,
    error,
    refetch: load,
  };
}