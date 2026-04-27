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
import {
  getSupabaseSystemStatus,
  getSupabaseDashboardMetrics,
  getSupabaseInvoices,
  getSupabaseInvoiceById,
  createSupabaseInvoice,
  updateSupabaseInvoiceStatus,
  getSupabaseAuditEvents,
  resetSupabaseDemoData,
} from './supabaseApi';
import {
  assertRoleCanPerformAction,
  assertValidTransition as assertWorkflowTransition,
  workflowActions,
  type WorkflowActionKey,
} from './workflowRules';
import { createCantonReference, getCantonReadiness, initialCantonSyncStatus } from './canton';

const API_DELAY = 300;
const STORAGE_KEY = 'glide.workflow.state.v1';
const API_MODE = import.meta.env.VITE_GLIDE_API_MODE || 'local';
const API_BASE_URL = (import.meta.env.VITE_GLIDE_API_BASE_URL || 'http://localhost:8787').replace(/\/$/, '');

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

function useHttpApi() {
  return API_MODE === 'http';
}

function useSupabaseApi() {
  return API_MODE === 'supabase';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Unknown API error' }));
    throw new Error(errorBody.message || `Glide API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

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

function assertValidTransition(invoice: Invoice, newStatus: InvoiceStatus) {
  assertWorkflowTransition(invoice.status, newStatus, invoice.id);
}

function resolveActorRole(actionKey: WorkflowActionKey, actorRole?: UserRole): UserRole {
  const resolvedRole = actorRole || workflowActions[actionKey].actorRole;
  assertRoleCanPerformAction(actionKey, resolvedRole);
  return resolvedRole;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  if (useSupabaseApi()) return getSupabaseSystemStatus();
  if (useHttpApi()) return request<SystemStatus>('/api/system/status');

  await delay(API_DELAY);
  const cantonReadiness = getCantonReadiness();

  return {
    ...mockSystemStatus,
    canton: cantonReadiness.status,
    environment: cantonReadiness.environment,
    supportedAssets: cantonReadiness.supportedAssets,
    lastChecked: new Date().toISOString(),
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (useSupabaseApi()) return getSupabaseDashboardMetrics();
  if (useHttpApi()) return request<DashboardMetrics>('/api/dashboard/metrics');

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
  if (useSupabaseApi()) return getSupabaseInvoices();
  if (useHttpApi()) return request<Invoice[]>('/api/invoices');

  await delay(API_DELAY);
  const state = readState();

  return [...state.invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  if (useSupabaseApi()) return getSupabaseInvoiceById(id);
  if (useHttpApi()) {
    try {
      return await request<Invoice>(`/api/invoices/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) return null;
      throw error;
    }
  }

  await delay(API_DELAY);
  const state = readState();
  return state.invoices.find(inv => inv.id === id) || null;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  if (useSupabaseApi()) return createSupabaseInvoice(payload);
  if (useHttpApi()) {
    return request<Invoice>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

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
    cantonReference: createCantonReference(nextInvoiceId, payload.asset),
    cantonSyncStatus: initialCantonSyncStatus(),
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

async function postInvoiceAction(invoiceId: string, actionPath: string, actorRole?: UserRole): Promise<Invoice | null> {
  return request<Invoice>(`/api/invoices/${invoiceId}/${actionPath}`, {
    method: 'POST',
    body: JSON.stringify({ actorRole }),
  });
}

export async function confirmPayment(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('confirmPayment', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.confirmPayment.nextStatus, workflowActions.confirmPayment.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'confirm-payment', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.confirmPayment.nextStatus, workflowActions.confirmPayment.actionLabel, resolvedRole);
}

export async function routeSettlement(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('routeSettlement', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.routeSettlement.nextStatus, workflowActions.routeSettlement.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'route-settlement', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.routeSettlement.nextStatus, workflowActions.routeSettlement.actionLabel, resolvedRole);
}

export async function markSettled(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('markSettled', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.markSettled.nextStatus, workflowActions.markSettled.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'mark-settled', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.markSettled.nextStatus, workflowActions.markSettled.actionLabel, resolvedRole);
}

export async function markFulfilled(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('markFulfilled', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.markFulfilled.nextStatus, workflowActions.markFulfilled.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'mark-fulfilled', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.markFulfilled.nextStatus, workflowActions.markFulfilled.actionLabel, resolvedRole);
}

export async function cancelInvoice(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('cancelInvoice', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.cancelInvoice.nextStatus, workflowActions.cancelInvoice.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'cancel', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.cancelInvoice.nextStatus, workflowActions.cancelInvoice.actionLabel, resolvedRole);
}

export async function disputeInvoice(invoiceId: string, actorRole?: UserRole): Promise<Invoice | null> {
  const resolvedRole = resolveActorRole('disputeInvoice', actorRole);
  if (useSupabaseApi()) return updateSupabaseInvoiceStatus(invoiceId, workflowActions.disputeInvoice.nextStatus, workflowActions.disputeInvoice.actionLabel, resolvedRole);
  if (useHttpApi()) return postInvoiceAction(invoiceId, 'dispute', resolvedRole);
  return updateInvoiceStatus(invoiceId, workflowActions.disputeInvoice.nextStatus, workflowActions.disputeInvoice.actionLabel, resolvedRole);
}

export async function getAuditEvents(invoiceId: string): Promise<AuditEvent[]> {
  if (useSupabaseApi()) return getSupabaseAuditEvents(invoiceId);
  if (useHttpApi()) return request<AuditEvent[]>(`/api/invoices/${invoiceId}/audit`);

  await delay(API_DELAY);
  const state = readState();
  return [...(state.auditEvents[invoiceId] || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export async function resetDemoData(): Promise<void> {
  if (useSupabaseApi()) return resetSupabaseDemoData();
  if (useHttpApi()) {
    await request<{ ok: boolean }>('/api/demo/reset', { method: 'POST' });
    return;
  }

  await delay(API_DELAY);
  writeState(createInitialState());
}
