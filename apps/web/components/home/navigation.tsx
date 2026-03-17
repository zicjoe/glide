"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  connectWallet,
  disconnectWallet,
  getStacksAddress,
  isUserSignedIn,
} from "@/lib/stacks/auth";
import { useEffect, useState } from "react";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function HomeNavigation() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setConnected(isUserSignedIn());
    setAddress(getStacksAddress());
  }, []);

  async function handleConnect() {
    try {
      setConnecting(true);
      await connectWallet();
      setConnected(isUserSignedIn());
      setAddress(getStacksAddress());
    } catch (error) {
      console.error("wallet connect failed", error);
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectWallet();
      setConnected(false);
      setAddress(null);
    } catch (error) {
      console.error("wallet disconnect failed", error);
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/glide-logo.png"
              alt="Glide - Treasury Automation"
              width={160}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <a
            href="#features"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="View features"
          >
            Features
          </a>
          <a
            href="#product"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="View product overview"
          >
            Product
          </a>
          <a
            href="#docs"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="Read documentation"
          >
            Documentation
          </a>

          {connected && address ? (
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                {shortAddress(address)}
              </div>

              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleDisconnect}
                aria-label="Disconnect wallet"
              >
                Disconnect
              </Button>

              <Button
                className="bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                aria-label="Open dashboard"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <Button
              className="bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
              aria-label="Connect wallet"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}