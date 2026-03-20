import { callPublic, cv } from "@/lib/stacks/auth";
import { CONTRACTS, DEPLOYER_ADDRESS } from "./config";

function requireDeployerAddress(): string {
  if (!DEPLOYER_ADDRESS) {
    throw new Error("Missing NEXT_PUBLIC_STACKS_DEPLOYER_ADDRESS");
  }

  return DEPLOYER_ADDRESS;
}

function contractAddress() {
  return requireDeployerAddress();
}

export async function writeRegisterMerchant() {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideCore,
    functionName: "register-merchant",
    functionArgs: [],
  });
}

export async function writeSetTreasuryPolicy(args: {
  merchantId: number;
  settlementAsset: 0 | 1;
  autoSplit: boolean;
  idleYield: boolean;
  yieldThreshold: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "set-policy",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.settlementAsset),
      cv.bool(args.autoSplit),
      cv.bool(args.idleYield),
      cv.uint(args.yieldThreshold),
    ],
  });
}

export async function writeAddDestination(args: {
  merchantId: number;
  label: string;
  asset: 0 | 1;
  destination: string;
  destinationType: 0 | 1 | 2;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "add-destination",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.ascii(args.label),
      cv.uint(args.asset),
      cv.principal(args.destination),
      cv.uint(args.destinationType),
    ],
  });
}

export async function writeSetDestinationEnabled(args: {
  merchantId: number;
  destinationId: number;
  enabled: boolean;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "set-destination-enabled",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.destinationId),
      cv.bool(args.enabled),
    ],
  });
}

export async function writeAddBucket(args: {
  merchantId: number;
  name: string;
  allocationBps: number;
  destinationId: number;
  idleMode: 0 | 1;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "add-bucket",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.ascii(args.name),
      cv.uint(args.allocationBps),
      cv.uint(args.destinationId),
      cv.uint(args.idleMode),
    ],
  });
}

export async function writeUpdateBucket(args: {
  merchantId: number;
  bucketId: number;
  allocationBps: number;
  destinationId: number;
  idleMode: 0 | 1;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "update-bucket",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.uint(args.allocationBps),
      cv.uint(args.destinationId),
      cv.uint(args.idleMode),
    ],
  });
}

export async function writeSetBucketEnabled(args: {
  merchantId: number;
  bucketId: number;
  enabled: boolean;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideTreasury,
    functionName: "set-bucket-enabled",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.bool(args.enabled),
    ],
  });
}

export async function writeCreateInvoice(args: {
    merchantId: number;
    reference: string;
    asset: 0 | 1;
    amount: number;
    description: string;
    expiryAt: number;
    destinationId?: number | null;
    paymentDestination: string;
  }) {
    return callPublic({
      contractAddress: contractAddress(),
      contractName: CONTRACTS.glideInvoices,
      functionName: "create-invoice",
      functionArgs: [
        cv.uint(args.merchantId),
        cv.ascii(args.reference),
        cv.uint(args.asset),
        cv.uint(args.amount),
        cv.utf8(args.description),
        cv.uint(args.expiryAt),
        args.destinationId == null ? cv.none() : cv.some(cv.uint(args.destinationId)),
        cv.principal(args.paymentDestination),
      ],
    });
  }
  

export async function writeCancelInvoice(args: {
  merchantId: number;
  invoiceId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideInvoices,
    functionName: "cancel-invoice",
    functionArgs: [cv.uint(args.merchantId), cv.uint(args.invoiceId)],
  });
}

export async function writeCreateSettlement(args: {
  merchantId: number;
  invoiceId: number;
  grossAmount: number;
  feeAmount: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideSettlements,
    functionName: "create-settlement",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.invoiceId),
      cv.uint(args.grossAmount),
      cv.uint(args.feeAmount),
    ],
  });
}

export async function writeCompleteSettlement(args: {
  settlementId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideSettlements,
    functionName: "complete-settlement",
    functionArgs: [cv.uint(args.settlementId)],
  });
}

export async function writeFailSettlement(args: {
  settlementId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideSettlements,
    functionName: "fail-settlement",
    functionArgs: [cv.uint(args.settlementId)],
  });
}

export async function writeCreditSettlementAllocation(args: {
  merchantId: number;
  bucketId: number;
  asset: 0 | 1;
  amount: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideVault,
    functionName: "credit-settlement-allocation",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.uint(args.asset),
      cv.uint(args.amount),
    ],
  });
}

export async function writeQueueBalanceForYield(args: {
  merchantId: number;
  bucketId: number;
  asset: 0 | 1;
  amount: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideVault,
    functionName: "queue-balance-for-yield",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.uint(args.asset),
      cv.uint(args.amount),
    ],
  });
}

export async function writeMarkQueuedAsDeployed(args: {
  merchantId: number;
  bucketId: number;
  asset: 0 | 1;
  amount: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideVault,
    functionName: "mark-queued-as-deployed",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.uint(args.asset),
      cv.uint(args.amount),
    ],
  });
}

export async function writeAddStrategy(args: {
  name: string;
  asset: 0 | 1;
  riskLevel: 0 | 1 | 2;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideStrategyRegistry,
    functionName: "add-strategy",
    functionArgs: [
      cv.ascii(args.name),
      cv.uint(args.asset),
      cv.uint(args.riskLevel),
    ],
  });
}

export async function writeSetStrategyActive(args: {
  strategyId: number;
  active: boolean;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideStrategyRegistry,
    functionName: "set-strategy-active",
    functionArgs: [cv.uint(args.strategyId), cv.bool(args.active)],
  });
}

export async function writeQueueDeployment(args: {
  merchantId: number;
  bucketId: number;
  asset: 0 | 1;
  amount: number;
  strategyId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideYield,
    functionName: "queue-deployment",
    functionArgs: [
      cv.uint(args.merchantId),
      cv.uint(args.bucketId),
      cv.uint(args.asset),
      cv.uint(args.amount),
      cv.uint(args.strategyId),
    ],
  });
}

export async function writeMarkDeployed(args: {
  queueId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideYield,
    functionName: "mark-deployed",
    functionArgs: [cv.uint(args.queueId)],
  });
}

export async function writePausePosition(args: {
  positionId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideYield,
    functionName: "pause-position",
    functionArgs: [cv.uint(args.positionId)],
  });
}

export async function writeWithdrawPosition(args: {
  positionId: number;
}) {
  return callPublic({
    contractAddress: contractAddress(),
    contractName: CONTRACTS.glideYield,
    functionName: "withdraw-position",
    functionArgs: [cv.uint(args.positionId)],
  });
}

