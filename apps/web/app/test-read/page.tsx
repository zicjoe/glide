"use client";

import { useEffect, useState } from "react";
import { principalCV, cvToHex } from "@stacks/transactions";

const OWNER = "ST2NAF5CDZYMV3N2QAZP2ZFWXF4E9N4YB1KEKE6CF";
const CONTRACT_ADDRESS = "ST2NAF5CDZYMV3N2QAZP2ZFWXF4E9N4YB1KEKE6CF";
const CONTRACT_NAME = "glide-core";

export default function TestReadPage() {
  const [result, setResult] = useState("loading...");

  useEffect(() => {
    async function run() {
      try {
        const arg = cvToHex(principalCV(OWNER));

        const payload = {
          sender: CONTRACT_ADDRESS,
          arguments: [arg],
        };

        const response = await fetch(
          `https://api.testnet.hiro.so/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-merchant-id-by-owner`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const text = await response.text();

        setResult(
          JSON.stringify(
            {
              owner: OWNER,
              payload,
              status: response.status,
              body: text,
            },
            null,
            2
          )
        );
      } catch (err) {
        setResult(err instanceof Error ? err.message : String(err));
      }
    }

    void run();
  }, []);

  return <pre className="p-6 whitespace-pre-wrap text-sm">{result}</pre>;
}