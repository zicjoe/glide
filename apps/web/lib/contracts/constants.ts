export const ASSET = {
    SBTC: 0,
    USDCX: 1,
  } as const;
  
  export type AssetId = (typeof ASSET)[keyof typeof ASSET];
  
  export const DESTINATION_TYPE = {
    HOT_WALLET: 0,
    MULTI_SIG: 1,
    DEFI_CONTRACT: 2,
  } as const;
  
  export type DestinationTypeId =
    (typeof DESTINATION_TYPE)[keyof typeof DESTINATION_TYPE];
  
  export const IDLE_MODE = {
    HOLD: 0,
    EARN: 1,
  } as const;
  
  export type IdleModeId = (typeof IDLE_MODE)[keyof typeof IDLE_MODE];
  
  export const INVOICE_STATUS = {
    OPEN: 0,
    PAID: 1,
    EXPIRED: 2,
    CANCELLED: 3,
  } as const;
  
  export type InvoiceStatusId =
    (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];
  
  export const SETTLEMENT_STATUS = {
    PENDING: 0,
    PROCESSING: 1,
    COMPLETED: 2,
    FAILED: 3,
  } as const;
  
  export type SettlementStatusId =
    (typeof SETTLEMENT_STATUS)[keyof typeof SETTLEMENT_STATUS];
  
  export const YIELD_STATUS = {
    QUEUED: 0,
    DEPLOYED: 1,
    WITHDRAWN: 2,
    PAUSED: 3,
    FAILED: 4,
  } as const;
  
  export type YieldStatusId =
    (typeof YIELD_STATUS)[keyof typeof YIELD_STATUS];
  
  export const RISK_LEVEL = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
  } as const;
  
  export type RiskLevelId = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];
  
  export const BPS_TOTAL = 10_000;
  
  export function assetLabel(asset: number): string {
    switch (asset) {
      case ASSET.SBTC:
        return "sBTC";
      case ASSET.USDCX:
        return "USDCx";
      default:
        return `Unknown (${asset})`;
    }
  }
  
  export function invoiceStatusLabel(status: number): string {
    switch (status) {
      case INVOICE_STATUS.OPEN:
        return "Open";
      case INVOICE_STATUS.PAID:
        return "Paid";
      case INVOICE_STATUS.EXPIRED:
        return "Expired";
      case INVOICE_STATUS.CANCELLED:
        return "Cancelled";
      default:
        return `Unknown (${status})`;
    }
  }
  
  export function settlementStatusLabel(status: number): string {
    switch (status) {
      case SETTLEMENT_STATUS.PENDING:
        return "Pending";
      case SETTLEMENT_STATUS.PROCESSING:
        return "Processing";
      case SETTLEMENT_STATUS.COMPLETED:
        return "Completed";
      case SETTLEMENT_STATUS.FAILED:
        return "Failed";
      default:
        return `Unknown (${status})`;
    }
  }
  
  export function yieldStatusLabel(status: number): string {
    switch (status) {
      case YIELD_STATUS.QUEUED:
        return "Queued";
      case YIELD_STATUS.DEPLOYED:
        return "Deployed";
      case YIELD_STATUS.WITHDRAWN:
        return "Withdrawn";
      case YIELD_STATUS.PAUSED:
        return "Paused";
      case YIELD_STATUS.FAILED:
        return "Failed";
      default:
        return `Unknown (${status})`;
    }
  }
  
  export function idleModeLabel(mode: number): string {
    switch (mode) {
      case IDLE_MODE.HOLD:
        return "HOLD";
      case IDLE_MODE.EARN:
        return "EARN";
      default:
        return `Unknown (${mode})`;
    }
  }
  
  export function riskLevelLabel(level: number): string {
    switch (level) {
      case RISK_LEVEL.LOW:
        return "Low";
      case RISK_LEVEL.MEDIUM:
        return "Medium";
      case RISK_LEVEL.HIGH:
        return "High";
      default:
        return `Unknown (${level})`;
    }
  }