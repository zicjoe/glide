"use client";

import { useEffect, useState } from "react";
import {
  connectWallet,
  disconnectWallet,
  getStacksAddress,
  isUserSignedIn,
} from "@/lib/stacks/auth";

type UseWalletResult = {
  connected: boolean;
  address: string | null;
  loading: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refresh: () => void;
};

export function useWallet(): UseWalletResult {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  function refresh() {
    setConnected(isUserSignedIn());
    setAddress(getStacksAddress());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function connect() {
    try {
      setConnecting(true);
      await connectWallet();
      refresh();
    } finally {
      setConnecting(false);
    }
  }

  async function disconnect() {
    await disconnectWallet();
    refresh();
  }

  return {
    connected,
    address,
    loading,
    connecting,
    connect,
    disconnect,
    refresh,
  };
}