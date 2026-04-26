import type {
  SystemStatus,
  DashboardMetrics,
  Invoice,
  CreateInvoicePayload,
  AuditEvent,
  InvoiceStatus,
  UserRole,
} from './types';
import {
  mockInvoices,
  mockSystemStatus,
  mockAuditEvents,
} from './mockData';

const API_DELAY = 300;
const STORAGE_KEY = 'glide.workflow.state.v1';

interface WorkflowState {
  invoices: Invoice[];
  auditEvents: Record<string, AuditEvent[]>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const createInitialState = (): WorkflowState => ({
  invoices: clone(mockInvoices),
  auditEvents: clone(mockAuditEvents),
});

let memoryState: WorkflowState | null = null;

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readState(): WorkflowState {
  if (!hasBrowserStorage()) {
    if (!memoryState) memoryState = createInitialState();
    return clone(memoryState);
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    const initialState = createInitialState();
    writeState(initialState);
    return initialState;
  }

  try {
    const parsed = JSON.parse(rawState) as WorkflowState;

    if (!Array.isArray(parsed.invoices) || !parsed.auditEvents) {
      throw new Error('Invalid workflow state shape');
    }

    return parsed;
  } catch (error) {
    console.warn('Resetting corrupted Glide workflow state:', error);
    const initialState = createInitialState();
    writeState(initialState);
    return initialState;
  }
}

function writeState(state: WorkflowState) {
  const safeState = clone(state);

  if (!hasBrowserStorage()) {
    memoryState = safeState;
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
}

function generateNextInvoiceId(invoices: Invoice[]) {
  const highestId = invoices.reduce((highest, invoice) => {
    const match = invoice.id.match(/INV-(\d+)/);
    if (!match) return highest;
    return Math.max(highest, Number(match[1]));
  }, 0);

  return `INV-${String(highestId + 1).padStart(3, '0')}`;
}

function createAuditEvent(params: {
  invoice: Invoice;
  action: string;
  actorRole: UserRole;
  previousStatus?: InvoiceStatus;
  newStatus: InvoiceStatus;
  sequence: number;
}): AuditEvent {
  return {
    id: `AUD-${params.invoice.id}-${params.sequence}`,
    invoiceId: params.invoice.id,
    action: params.action,
    actorRole: params.actorRole,
    timestamp: new Date().toISOString(),
    previousStatus: params.previousStatus,
    newStatus: params.newStatus,
    asset: params.invoice.asset,
    amount: params.invoice.amount,
    referenceId: params.invoice.cantonReference || '',
  };
}

const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ['ISSUED', 'CANCELLED', 'DISPUTED'],
  ISSUED: ['PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED'],
  PAYMENT_PENDING: ['PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED'],
  PAYMENT_CONFIRMED: ['SETTLEMENT_PENDING', 'CANCELLED', 'DISPUTED'],
  SETTLEMENT_PENDING: ['SETTLED', 'DISPUTED'],
  SETTLED: ['FULFILLED', 'DISPUTED'],
  FULFILLED: [],
  CANCELLED: [],
  DISPUTED: [],
};

function assertValidTransition(invoice: Invoice, newStatus: InvoiceStatus) {
  const allowedNextStatuses = allowedTransitions[invoice.status];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(`Cannot move invoice ${invoice.id} from ${invoice.status} to ${newStatus}`);
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  await delay(API_DELAY);
  return {
    ...mockSystemStatus,
    lastChecked: new Date().toISOString(),
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(API_DELAY);
  const state = readState();

  const awaitingPayment = state.invoices.filter(
    inv => inv.status === 'ISSUED' || inv.status === 'PAYMENT_PENDING'
  ).length;
  const paymentConfirmed = state.invoices.filter(inv => inv.status === 'PAYMENT_CONFIRMED').length;
  const settlementPending = state.invoices.filter(inv => inv.status === 'SETTLEMENT_PENDING').length;
  const settled = state.invoices.filter(inv => inv.status === 'SETTLED').length;
  const fulfilled = state.invoices.filter(inv => inv.status === 'FULFILLED').length;
  const disputed = state.invoices.filter(inv => inv.status === 'DISPUTED').length;

  const totalValueCC = state.invoices
    .filter(inv => inv.asset === 'CC')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalValueUSDCx = state.invoices
    .filter(inv => inv.asset === 'USDCx')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return {
    totalInvoices: state.invoices.length,
    awaitingPayment,
    paymentConfirmed,
    settlementPending,
    settled,
    fulfilled,
    disputed,
    totalValueCC,
    totalValueUSDCx,
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  await delay(API_DELAY);
  const state = readState();

  return [...state.invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  await delay(API_DELAY);
  const state = readState();
  return state.invoices.find(inv => inv.id === id) || null;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  await delay(API_DELAY);
  const state = readState();
  const now = new Date().toISOString();
  const nextInvoiceId = generateNextInvoiceId(state.invoices);

  const newInvoice: Invoice = {
    id: nextInvoiceId,
    ...payload,
    status: 'PAYMENT_PENDING',
    createdAt: now,
    updatedAt: now,
    businessId: 'BIZ-001',
    cantonReference: `CANTON-REF-${String(state.invoices.length + 1).padStart(3, '0')}`,
  };

  const auditEvents = [
    createAuditEvent({
      invoice: newInvoice,
      action: 'Invoice Created',
      actorRole: 'BUSINESS',
      newStatus: 'DRAFT',
      sequence: 1,
    }),
    createAuditEvent({
      invoice: newInvoice,
      action: 'Invoice Issued',
      actorRole: 'BUSINESS',
      previousStatus: 'DRAFT',
      newStatus: 'ISSUED',
      sequence: 2,
    }),
    createAuditEvent({
      invoice: newInvoice,
      action: 'Payment Request Generated',
      actorRole: 'BUSINESS',
      previousStatus: 'ISSUED',
      newStatus: 'PAYMENT_PENDING',
      sequence: 3,
    }),
  ];

  state.invoices.push(newInvoice);
  state.auditEvents[newInvoice.id] = auditEvents;
  writeState(state);

  return newInvoice;
}

async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
  action: string,
  actorRole: UserRole
): Promise<Invoice | null> {
  await delay(API_DELAY);
  const state = readState();
  const invoiceIndex = state.invoices.findIndex(inv => inv.id === invoiceId);

  if (invoiceIndex === -1) return null;

  const invoice = state.invoices[invoiceIndex];
  assertValidTransition(invoice, newStatus);

  const previousStatus = invoice.status;
  const updatedInvoice: Invoice = {
    ...invoice,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  const existingAuditEvents = state.auditEvents[invoiceId] || [];
  const auditEvent = createAuditEvent({
    invoice: updatedInvoice,
    action,
    actorRole,
    previousStatus,
    newStatus,
    sequence: existingAuditEvents.length + 1,
  });

  state.invoices[invoiceIndex] = updatedInvoice;
  state.auditEvents[invoiceId] = [...existingAuditEvents, auditEvent];
  writeState(state);

  return updatedInvoice;
}

export async function confirmPayment(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'PAYMENT_CONFIRMED', 'Payment Confirmed', 'PAYER');
}

export async function routeSettlement(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'SETTLEMENT_PENDING', 'Settlement Routed', 'SETTLEMENT_OPERATOR');
}

export async function markSettled(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'SETTLED', 'Settlement Confirmed', 'SETTLEMENT_OPERATOR');
}

export async function markFulfilled(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'FULFILLED', 'Fulfillment Confirmed', 'BUSINESS');
}

export async function cancelInvoice(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'CANCELLED', 'Invoice Cancelled', 'BUSINESS');
}

export async function disputeInvoice(invoiceId: string): Promise<Invoice | null> {
  return updateInvoiceStatus(invoiceId, 'DISPUTED', 'Invoice Disputed', 'PAYER');
}

export async function getAuditEvents(invoiceId: string): Promise<AuditEvent[]> {
  await delay(API_DELAY);
  const state = readState();
  return [...(state.auditEvents[invoiceId] || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export async function resetDemoData(): Promise<void> {
  await delay(API_DELAY);
  writeState(createInitialState());
}
