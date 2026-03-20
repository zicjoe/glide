"use client";

import { connect, disconnect, isConnected, request } from "@stacks/connect";
import { Cl, cvToHex } from "@stacks/transactions";

const ADDRESS_KEY = "glide.stacks.address";
const BTC_ADDRESS_KEY = "glide.btc.address";
const ALL_ADDRESSES_KEY = "glide.wallet.addresses";

type WalletAddressEntry = {
  symbol?: string;
  address?: string;
  publicKey?: string;
};

function pickStacksAddress(entries: WalletAddressEntry[] = []) {
  return (
    entries.find((item) => item.symbol?.toLowerCase() === "stx")?.address ||
    entries.find((item) => item.symbol?.toLowerCase().includes("stacks"))?.address ||
    entries.find((item) => typeof item.address === "string" && item.address.startsWith("SP"))?.address ||
    entries.find((item) => typeof item.address === "string" && item.address.startsWith("ST"))?.address ||
    null
  );
}

function pickBtcAddress(entries: WalletAddressEntry[] = []) {
  return (
    entries.find((item) => item.symbol?.toLowerCase() === "btc")?.address ||
    entries.find((item) => item.symbol?.toLowerCase().includes("bitcoin"))?.address ||
    entries.find(
      (item) =>
        typeof item.address === "string" &&
        (item.address.startsWith("bc1") ||
          item.address.startsWith("tb1") ||
          item.address.startsWith("1") ||
          item.address.startsWith("3") ||
          item.address.startsWith("m") ||
          item.address.startsWith("n") ||
          item.address.startsWith("2")),
    )?.address ||
    null
  );
}

function persistWalletAddresses(
  stacksAddress: string | null,
  btcAddress: string | null,
  entries: WalletAddressEntry[] = [],
) {
  if (typeof window === "undefined") return;

  if (stacksAddress) {
    window.localStorage.setItem(ADDRESS_KEY, stacksAddress);
  } else {
    window.localStorage.removeItem(ADDRESS_KEY);
  }

  if (btcAddress) {
    window.localStorage.setItem(BTC_ADDRESS_KEY, btcAddress);
  } else {
    window.localStorage.removeItem(BTC_ADDRESS_KEY);
  }

  window.localStorage.setItem(ALL_ADDRESSES_KEY, JSON.stringify(entries));
}

export function isUserSignedIn() {
  return isConnected();
}

export function getStacksAddress(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADDRESS_KEY);
}

export function getBtcAddress(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BTC_ADDRESS_KEY);
}

export function getAllWalletAddresses(): WalletAddressEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ALL_ADDRESSES_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function connectWallet() {
  const result: any = await connect();

  const entries: WalletAddressEntry[] = Array.isArray(result?.addresses)
    ? result.addresses
    : [];

  const stacksAddress = pickStacksAddress(entries) || result?.address || null;
  const btcAddress = pickBtcAddress(entries);

  persistWalletAddresses(stacksAddress, btcAddress, entries);

  return {
    ...result,
    stacksAddress,
    btcAddress,
    addresses: entries,
  };
}

export async function disconnectWallet() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADDRESS_KEY);
    window.localStorage.removeItem(BTC_ADDRESS_KEY);
    window.localStorage.removeItem(ALL_ADDRESSES_KEY);
  }
  await disconnect();
}

type ContractCallArgs = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
};

export async function callPublic(args: ContractCallArgs) {
  const serializedArgs = (args.functionArgs ?? []).map((arg) =>
    typeof arg === "string" ? arg : cvToHex(arg),
  );

  return request("stx_callContract", {
    contract: `${args.contractAddress}.${args.contractName}`,
    functionName: args.functionName,
    functionArgs: serializedArgs,
    network: "testnet",
    sponsored: false,
  } as any);
}

export const cv = {
  uint: (value: number | string | bigint) => Cl.uint(value),
  ascii: (value: string) => Cl.stringAscii(value),
  utf8: (value: string) => Cl.stringUtf8(value),
  bool: (value: boolean) => (value ? Cl.bool(true) : Cl.bool(false)),
  principal: (value: string) => Cl.principal(value),
  none: () => Cl.none(),
  some: (value: any) => Cl.some(value),
};