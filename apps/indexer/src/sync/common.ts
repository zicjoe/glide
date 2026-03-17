import { config } from "../config.js";

type ReadOnlyPayload = {
  sender: string;
  arguments: string[];
};

export async function callReadOnly(
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: string[],
) {
  const url = `${config.stacksApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: contractAddress,
      arguments: args,
    } satisfies ReadOnlyPayload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Read-only failed: ${response.status} ${text}`);
  }

  return response.json();
}