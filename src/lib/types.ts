export type AssetType = 'CC' | 'USDCx';

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'SETTLEMENT_PENDING'
  | 'SETTLED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'DISPUTED';

export type UserRole = 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER';

export type CantonSyncStatus = 'PENDING' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'FINALIZED' | 'FAILED';

export interface Invoice {
  id: string;
  title: string;
  customerName: string;
  payerPartyId: string;
  observerPartyId: string;
  amount: number;
  asset: AssetType;
  settlementDestination: string;
  dueDate: string;
  description: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  businessId: string;
  cantonReference?: string;
  cantonWorkflowId?: string;
  cantonSyncStatus?: CantonSyncStatus;
  cantonLastError?: string;
}

export interface SettlementInstruction {
  id: string;
  invoiceId: string;
  amount: number;
  asset: AssetType;
  destination: string;
  status: 'PENDING' | 'ROUTED' | 'SETTLED' | 'FAILED';
  createdAt: string;
  settledAt?: string;
}

export interface AuditEvent {
  id: string;
  invoiceId: string;
  action: string;
  actorRole: UserRole;
  timestamp: string;
  previousStatus?: InvoiceStatus;
  newStatus: InvoiceStatus;
  asset: AssetType;
  amount: number;
  referenceId: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardMetrics {
  totalInvoices: number;
  awaitingPayment: number;
  paymentConfirmed: number;
  settlementPending: number;
  settled: number;
  fulfilled: number;
  disputed: number;
  totalValueCC: number;
  totalValueUSDCx: number;
}

export interface SystemStatus {
  api: 'online' | 'offline' | 'degraded';
  canton: 'online' | 'offline' | 'degraded';
  environment: 'DevNet' | 'TestNet' | 'MainNet';
  supportedAssets: AssetType[];
  lastChecked: string;
}

export interface CreateInvoicePayload {
  title: string;
  customerName: string;
  payerPartyId: string;
  observerPartyId: string;
  amount: number;
  asset: AssetType;
  settlementDestination: string;
  dueDate: string;
  description: string;
}
