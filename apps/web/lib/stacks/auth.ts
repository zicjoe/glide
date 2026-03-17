"use client";

import { connect, disconnect, isConnected, request } from "@stacks/connect";
import { Cl } from "@stacks/transactions";

const ADDRESS_KEY = "glide.stacks.address";

export function isUserSignedIn() {
  return isConnected();
}

export function getStacksAddress(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADDRESS_KEY);
}

export async function connectWallet() {
  const result: any = await connect();

  const address =
    result?.addresses?.[2]?.address ||
    result?.addresses?.[0]?.address ||
    result?.address ||
    null;

  if (address && typeof window !== "undefined") {
    window.localStorage.setItem(ADDRESS_KEY, address);
  }

  return result;
}

export async function disconnectWallet() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADDRESS_KEY);
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
  return request("stx_callContract", {
    contract: `${args.contractAddress}.${args.contractName}`,
    functionName: args.functionName,
    functionArgs: args.functionArgs,
    network: "testnet",
    sponsored: false,
  } as any);
}

export const cv = {
  uint: Cl.uint,
  ascii: Cl.stringAscii,
  utf8: Cl.stringUtf8,
  bool: (value: boolean) => (value ? Cl.bool(true) : Cl.bool(false)),
  principal: Cl.principal,
};