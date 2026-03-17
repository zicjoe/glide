import {
  cvToHex,
  falseCV,
  intCV,
  noneCV,
  principalCV,
  stringAsciiCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { getStacksNetwork } from "./network";
import type { GlideReadClient } from "@/lib/contracts/readers";

function toClarityValue(arg: unknown): any {
  if (arg === null || arg === undefined) {
    return noneCV();
  }

  if (typeof arg === "boolean") {
    return arg ? trueCV() : falseCV();
  }

  if (typeof arg === "number") {
    return arg < 0 ? intCV(arg) : uintCV(arg);
  }

  if (typeof arg === "string") {
    if (
      arg.startsWith("SP") ||
      arg.startsWith("ST") ||
      arg.startsWith("SM") ||
      arg.startsWith("SN")
    ) {
      return principalCV(arg);
    }

    return stringAsciiCV(arg);
  }

  return arg as any;
}

const callReadOnlyImpl = async (args: {
  contractId: string;
  functionName: string;
  functionArgs?: unknown[];
}): Promise<any> => {
  const { apiUrl } = getStacksNetwork();
  const [contractAddress, contractName] = args.contractId.split(".");

  if (!contractAddress || !contractName) {
    throw new Error(`Invalid contract id: ${args.contractId}`);
  }

  const url = `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${args.functionName}`;

  const payload = {
    sender: contractAddress,
    arguments: (args.functionArgs ?? []).map((arg) =>
      cvToHex(toClarityValue(arg))
    ),
  };

  console.log("read-only url", url);
  console.log("read-only payload", payload);

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

  return await response.json();
};

export const glideReadClient = {
  callReadOnly: callReadOnlyImpl,
} as GlideReadClient;

export function createGlideReadClient(): GlideReadClient {
  return glideReadClient;
}