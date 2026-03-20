"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  connectWallet,
  disconnectWallet,
  getAllWalletAddresses,
  getBtcAddress,
  getStacksAddress,
  isUserSignedIn,
} from "@/lib/stacks/auth";

import { writeRegisterMerchant } from "@/lib/contracts/writers";
import { getIndexedMerchant, saveMerchantRails } from "@/lib/api/indexer";

type MerchantRow = {
  merchant_id: number;
  owner: string;
  active: boolean;
  created_at: number | string;
  updated_at?: number | string;
};

type MerchantRails = {
  stacksAddress: string | null;
  btcAddress: string | null;
  allAddresses: Array<{
    symbol?: string;
    address?: string;
    publicKey?: string;
  }>;
};

type UseMerchantSessionResult = {
  connected: boolean;
  address: string | null;
  merchant: MerchantRow | null;
  merchantId: number | null;
  rails: MerchantRails;
  loading: boolean;
  connecting: boolean;
  creatingMerchant: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createMerchant: () => Promise<void>;
  refreshMerchant: () => Promise<void>;
};

function normalizeMerchant(row: any): MerchantRow | null {
  if (!row) return null;

  return {
    merchant_id: Number(row.merchant_id),
    owner: String(row.owner),
    active: Boolean(row.active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useMerchantSession(): UseMerchantSessionResult {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [allAddresses, setAllAddresses] = useState<
    Array<{ symbol?: string; address?: string; publicKey?: string }>
  >([]);
  const [merchant, setMerchant] = useState<MerchantRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [creatingMerchant, setCreatingMerchant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const merchantId = useMemo(
    () => (merchant ? Number(merchant.merchant_id) : null),
    [merchant],
  );

  const rails = useMemo(
    () => ({
      stacksAddress: address,
      btcAddress,
      allAddresses,
    }),
    [address, btcAddress, allAddresses],
  );

  const refreshMerchant = useCallback(async () => {
    const currentAddress = getStacksAddress();
    const currentBtcAddress = getBtcAddress();
    const currentAllAddresses = getAllWalletAddresses();

    setBtcAddress(currentBtcAddress);
    setAllAddresses(currentAllAddresses);

    if (!currentAddress) {
      setMerchant(null);
      setAddress(null);
      setConnected(false);
      return;
    }

    try {
      setError(null);
      const result = await getIndexedMerchant(currentAddress);
      setMerchant(normalizeMerchant(result.merchant));
      setAddress(currentAddress);
      setConnected(true);
    } catch (err) {
      setMerchant(null);
      setAddress(currentAddress);
      setConnected(true);
      setError(err instanceof Error ? err.message : "Failed to load merchant");
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);

      const result = await connectWallet();

      const currentAddress = result?.stacksAddress || getStacksAddress();
      const currentBtcAddress = result?.btcAddress || getBtcAddress();
      const currentAllAddresses = Array.isArray(result?.addresses)
        ? result.addresses
        : getAllWalletAddresses();

      setAddress(currentAddress);
      setBtcAddress(currentBtcAddress);
      setAllAddresses(currentAllAddresses);
      setConnected(Boolean(currentAddress));


      if (currentAddress) {
        await saveMerchantRails({
          owner: currentAddress,
          stacksAddress: currentAddress,
          btcAddress: currentBtcAddress ?? null,
          usdcxAddress: currentAddress,
          usdcAddress: null,
        });
      }
      

      await refreshMerchant();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }, [refreshMerchant]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet();
    } finally {
      setConnected(false);
      setAddress(null);
      setBtcAddress(null);
      setAllAddresses([]);
      setMerchant(null);
      setError(null);
    }
  }, []);

  const createMerchant = useCallback(async () => {
    try {
      setCreatingMerchant(true);
      setError(null);

      await writeRegisterMerchant();

      await new Promise((resolve) => setTimeout(resolve, 2500));
      await refreshMerchant();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create merchant account",
      );
    } finally {
      setCreatingMerchant(false);
    }
  }, [refreshMerchant]);

  useEffect(() => {
    async function boot() {
      try {
        const signedIn = isUserSignedIn();
        const currentAddress = getStacksAddress();
        const currentBtcAddress = getBtcAddress();
        const currentAllAddresses = getAllWalletAddresses();

        setConnected(Boolean(signedIn && currentAddress));
        setAddress(currentAddress);
        setBtcAddress(currentBtcAddress);
        setAllAddresses(currentAllAddresses);
        if (currentAddress) {
            try {
              await saveMerchantRails({
                owner: currentAddress,
                stacksAddress: currentAddress,
                btcAddress: currentBtcAddress ?? null,
                usdcxAddress: currentAddress,
                usdcAddress: null,
              });
            } catch (error) {
              console.error("Failed to sync merchant rails on boot", error);
            }
          }
          
        if (signedIn && currentAddress) {
          await refreshMerchant();
        }
      } finally {
        setLoading(false);
      }
    }

    void boot();
  }, [refreshMerchant]);

  return {
    connected,
    address,
    merchant,
    merchantId,
    rails,
    loading,
    connecting,
    creatingMerchant,
    error,
    connect,
    disconnect,
    createMerchant,
    refreshMerchant,
  };
}