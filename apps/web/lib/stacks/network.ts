import { STACKS_NETWORK } from "@/lib/contracts/config";

export type GlideStacksNetwork = {
  name: "testnet" | "mainnet";
  apiUrl: string;
};

const TESTNET_API_URL =
  process.env.NEXT_PUBLIC_STACKS_API_URL || "https://api.testnet.hiro.so";

const MAINNET_API_URL =
  process.env.NEXT_PUBLIC_STACKS_API_URL || "https://api.hiro.so";

export function getStacksNetwork(): GlideStacksNetwork {
  if (STACKS_NETWORK.name === "mainnet") {
    return {
      name: "mainnet",
      apiUrl: MAINNET_API_URL,
    };
  }

  return {
    name: "testnet",
    apiUrl: TESTNET_API_URL,
  };
}