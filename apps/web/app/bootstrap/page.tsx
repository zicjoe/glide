"use client";

import { useEffect, useMemo, useState } from "react";
import {
  callPublic,
  connectWallet,
  disconnectWallet,
  getStacksAddress,
  isUserSignedIn,
  cv,
} from "@/lib/stacks/auth";

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STACKS_DEPLOYER_ADDRESS || "";

export default function BootstrapPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setAddress(getStacksAddress());
    setConnected(isUserSignedIn());
  }, []);

  const contracts = useMemo(
    () => ({
      core: "glide-core",
      treasury: "glide-treasury",
    }),
    [],
  );

  async function handleConnect() {
    await connectWallet();
    setAddress(getStacksAddress());
    setConnected(isUserSignedIn());
  }

  async function handleDisconnect() {
    await disconnectWallet();
    setAddress(null);
    setConnected(false);
  }

  async function registerMerchant() {
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.core,
      functionName: "register-merchant",
      functionArgs: [],
    });
  }

  async function setPolicy() {
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "set-policy",
      functionArgs: [cv.uint(1), cv.uint(0), cv.bool(true), cv.bool(true), cv.uint(5000)],
    });
  }

  async function addOperatingDestination() {
    if (!address) return;
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-destination",
      functionArgs: [
        cv.uint(1),
        cv.ascii("Operating Wallet"),
        cv.uint(0),
        cv.principal(address),
        cv.uint(0),
      ],
    });
  }

  async function addReserveDestination() {
    if (!address) return;
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-destination",
      functionArgs: [
        cv.uint(1),
        cv.ascii("Reserve Wallet"),
        cv.uint(0),
        cv.principal(address),
        cv.uint(1),
      ],
    });
  }

  async function addYieldDestination() {
    if (!address) return;
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-destination",
      functionArgs: [
        cv.uint(1),
        cv.ascii("Yield Pool"),
        cv.uint(0),
        cv.principal(address),
        cv.uint(2),
      ],
    });
  }

  async function addOperatingBucket() {
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-bucket",
      functionArgs: [cv.uint(1), cv.ascii("Operating"), cv.uint(6000), cv.uint(1), cv.uint(0)],
    });
  }

  async function addReserveBucket() {
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-bucket",
      functionArgs: [cv.uint(1), cv.ascii("Reserves"), cv.uint(3000), cv.uint(2), cv.uint(0)],
    });
  }

  async function addYieldBucket() {
    await callPublic({
      contractAddress: CONTRACT_ADDRESS,
      contractName: contracts.treasury,
      functionName: "add-bucket",
      functionArgs: [cv.uint(1), cv.ascii("Yield Pool"), cv.uint(1000), cv.uint(3), cv.uint(1)],
    });
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Glide Bootstrap</h1>
        <p className="text-sm text-gray-600 mt-2">
          Initialize Glide merchant state on testnet.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="text-sm text-gray-700">
          Signed in: {connected ? "Yes" : "No"}
        </div>
        <div className="text-sm text-gray-700 break-all">
          Address: {address || "Not connected"}
        </div>

        <div className="flex gap-3">
          {!connected ? (
            <button onClick={handleConnect}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>

    <div className="grid gap-3">
      <button onClick={registerMerchant} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        1 Register Merchant
      </button>
      <button onClick={setPolicy} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        2 Set Policy
      </button>
      <button onClick={addOperatingDestination} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        3 Add Operating Destination
      </button>
      <button onClick={addReserveDestination} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        4 Add Reserve Destination
      </button>
      <button onClick={addYieldDestination} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        5 Add Yield Destination
      </button>
      <button onClick={addOperatingBucket} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        6 Add Operating Bucket
      </button>
      <button onClick={addReserveBucket} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        7 Add Reserve Bucket
      </button>
      <button onClick={addYieldBucket} className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-left">
        8 Add Yield Bucket
      </button>
    </div>
  </div>
);
}