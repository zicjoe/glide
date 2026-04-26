import type {
  SystemStatus,
  DashboardMetrics,
  Invoice,
  CreateInvoicePayload,
  AuditEvent,
  InvoiceStatus,
} from './types';
import {
  mockInvoices,
  mockDashboardMetrics,
  mockSystemStatus,
  mockAuditEvents,
} from './mockData';

const API_DELAY = 300;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let invoicesStore = [...mockInvoices];
let auditEventsStore = { ...mockAuditEvents };

export async function getSystemStatus(): Promise<SystemStatus> {
  await delay(API_DELAY);
  return {
    ...mockSystemStatus,
    lastChecked: new Date().toISOString(),
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(API_DELAY);

  const awaitingPayment = invoicesStore.filter(
    inv => inv.status === 'ISSUED' || inv.status === 'PAYMENT_PENDING'
  ).length;
  const paymentConfirmed = invoicesStore.filter(inv => inv.status === 'PAYMENT_CONFIRMED').length;
  const settlementPending = invoicesStore.filter(inv => inv.status === 'SETTLEMENT_PENDING').length;
  const settled = invoicesStore.filter(inv => inv.status === 'SETTLED').length;
  const fulfilled = invoicesStore.filter(inv => inv.status === 'FULFILLED').length;
  const disputed = invoicesStore.filter(inv => inv.status === 'DISPUTED').length;

  const totalValueCC = invoicesStore
    .filter(inv => inv.asset === 'CC')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalValueUSDCx = invoicesStore
    .filter(inv => inv.asset === 'USDCx')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return {
    totalInvoices: invoicesStore.length,
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
  return [...invoicesStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  await delay(API_DELAY);
  return invoicesStore.find(inv => inv.id === id) || null;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  await delay(API_DELAY);

  const newInvoice: Invoice = {
    id: `INV-${String(invoicesStore.length + 1).padStart(3, '0')}`,
    ...payload,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    businessId: 'BIZ-001',
    cantonReference: `CANTON-REF-${String(invoicesStore.length + 1).padStart(3, '0')}`,
  };

  invoicesStore.push(newInvoice);

  const auditEvent: AuditEvent = {
    id: `AUD-${newInvoice.id}-1`,
    invoiceId: newInvoice.id,
    action: 'Invoice Created',
    actorRole: 'BUSINESS',
    timestamp: new Date().toISOString(),
    newStatus: 'DRAFT',
    asset: payload.asset,
    amount: payload.amount,
    referenceId: newInvoice.cantonReference || '',
  };

  auditEventsStore[newInvoice.id] = [auditEvent];

  return newInvoice;
}

async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
  action: string,
  actorRole: 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER'
): Promise<Invoice | null> {
  await delay(API_DELAY);

  const invoice = invoicesStore.find(inv => inv.id === invoiceId);
  if (!invoice) return null;

  const previousStatus = invoice.status;
  invoice.status = newStatus;
  invoice.updatedAt = new Date().toISOString();

  const auditEvent: AuditEvent = {
    id: `AUD-${invoiceId}-${(auditEventsStore[invoiceId]?.length || 0) + 1}`,
    invoiceId,
    action,
    actorRole,
    timestamp: new Date().toISOString(),
    previousStatus,
    newStatus,
    asset: invoice.asset,
    amount: invoice.amount,
    referenceId: invoice.cantonReference || '',
  };

  if (!auditEventsStore[invoiceId]) {
    auditEventsStore[invoiceId] = [];
  }
  auditEventsStore[invoiceId].push(auditEvent);

  return invoice;
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
  return auditEventsStore[invoiceId] || [];
}
