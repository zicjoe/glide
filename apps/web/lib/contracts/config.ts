export const CONTRACTS = {
    glideCore: "glide-core",
    glideTreasury: "glide-treasury",
    glideInvoices: "glide-invoices-v2",
    glideSettlements: "glide-settlements-v2",
    glideVault: "glide-vault",
    glideStrategyRegistry: "glide-strategy-registry",
    glideYield: "glide-yield",
  } as const;
  
  export type ContractName = keyof typeof CONTRACTS;
  
  export const STACKS_NETWORK = {
    name: "testnet",
  };
  
  export const DEPLOYER_ADDRESS =
    process.env.NEXT_PUBLIC_STACKS_DEPLOYER_ADDRESS || "";
  
  export function getContractId(contractName: keyof typeof CONTRACTS): string {
    if (!DEPLOYER_ADDRESS) {
      throw new Error("Missing NEXT_PUBLIC_STACKS_DEPLOYER_ADDRESS");
    }
  
    return `${DEPLOYER_ADDRESS}.${CONTRACTS[contractName]}`;
  }
  
  export const CONTRACT_IDS = {
    glideCore: () => getContractId("glideCore"),
    glideTreasury: () => getContractId("glideTreasury"),
    glideInvoices: () => getContractId("glideInvoices"),
    glideSettlements: () => getContractId("glideSettlements"),
    glideVault: () => getContractId("glideVault"),
    glideStrategyRegistry: () => getContractId("glideStrategyRegistry"),
    glideYield: () => getContractId("glideYield"),
  } as const;