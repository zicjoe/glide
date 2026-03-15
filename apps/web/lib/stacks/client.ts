import { getStacksNetwork } from "./network";
import type { GlideReadClient } from "@/lib/contracts/readers";

type ReadOnlyPayload = {
  sender?: string;
  arguments?: unknown[];
};

function normalizeArg(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (typeof arg === "number" || typeof arg === "bigint" || typeof arg === "boolean") {
    return String(arg);
  }

  return JSON.stringify(arg);
}

async function callReadOnlyImpl(args: {
  contractId: string;
  functionName: string;
  functionArgs?: unknown[];
}): Promise<unknown> {
  const { apiUrl } = getStacksNetwork();
  const [contractAddress, contractName] = args.contractId.split(".");

  if (!contractAddress || !contractName) {
    throw new Error(`Invalid contract id: ${args.contractId}`);
  }

  const url = `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${args.functionName}`;

  const payload: ReadOnlyPayload = {
    sender: contractAddress,
    arguments: (args.functionArgs || []).map(normalizeArg),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Read-only call failed: ${response.status} ${response.statusText} ${text}`,
    );
  }

  const data = (await response.json()) as unknown;
  return data;
}

export function createGlideReadClient(): GlideReadClient {
  return {
    callReadOnly: callReadOnlyImpl,
  };
}

export const glideReadClient = createGlideReadClient();