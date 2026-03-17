"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { getIndexedMerchant } from "@/lib/api/indexer";
import { writeRegisterMerchant } from "@/lib/contracts/writers";
import type { Merchant } from "@/lib/contracts/types";

type MerchantSessionResult = {
  connected: boolean;
  address: string | null;
  merchant: Merchant | null;
  merchantId: number | null;
  loading: boolean;
  connecting: boolean;
  creatingMerchant: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createMerchant: () => Promise<void>;
  refetch: () => Promise<void>;
};

function mapMerchant(row: any): Merchant {
  return {
    merchantId: Number(row.merchant_id),
    owner: String(row.owner),
    active: Boolean(row.active),
    createdAt: Number(row.created_at),
  };
}

export function useMerchantSession(): MerchantSessionResult {
  const wallet = useWallet();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [creatingMerchant, setCreatingMerchant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMerchant() {
    if (!wallet.address) {
      setMerchant(null);
      setMerchantId(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedMerchant(wallet.address);

      if (!result.merchant) {
        setMerchant(null);
        setMerchantId(null);
        return;
      }

      const mapped = mapMerchant(result.merchant);
      setMerchant(mapped);
      setMerchantId(mapped.merchantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load merchant session");
      setMerchant(null);
      setMerchantId(null);
    } finally {
      setLoading(false);
    }
  }

  async function createMerchant() {
    try {
      setCreatingMerchant(true);
      setError(null);

      await writeRegisterMerchant();

      await new Promise((resolve) => setTimeout(resolve, 4000));
      await loadMerchant();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create merchant");
    } finally {
      setCreatingMerchant(false);
    }
  }

  useEffect(() => {
    if (wallet.loading) return;
    void loadMerchant();
  }, [wallet.address, wallet.loading]);

  return {
    connected: wallet.connected,
    address: wallet.address,
    merchant,
    merchantId,
    loading: wallet.loading || loading,
    connecting: wallet.connecting,
    creatingMerchant,
    error,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    createMerchant,
    refetch: loadMerchant,
  };
}