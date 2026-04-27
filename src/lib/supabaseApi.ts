import { supabase, requireSupabaseConfig } from './supabaseClient';
import { mockInvoices } from './mockData';
import type {
  AuditEvent,
  CreateInvoicePayload,
  DashboardMetrics,
  Invoice,
  InvoiceStatus,
  SystemStatus,
  UserRole,
} from './types';
import { assertValidTransition as assertWorkflowTransition } from './workflowRules';
import { createCantonReference, getCantonReadiness, initialCantonSyncStatus } from './canton';
import type { Database } from './database.types';

type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type AuditRow = Database['public']['Tables']['audit_events']['Row'];
type AuditInsert = Database['public']['Tables']['audit_events']['Insert'];

const DEFAULT_BUSINESS_ID = 'BIZ-001';
const DEFAULT_BUSINESS_NAME = 'Glide Demo Business';

function assertValidTransition(invoice: Invoice, newStatus: InvoiceStatus) {
  assertWorkflowTransition(invoice.status, newStatus, invoice.id);
}

function supabaseErrorMessage(error: { message?: string; details?: string | null; hint?: string | null; code?: string | null }) {
  const parts = [
    error.message,
    error.details ? `Details: ${error.details}` : null,
    error.hint ? `Hint: ${error.hint}` : null,
    error.code ? `Code: ${error.code}` : null,
  ].filter(Boolean);

  return parts.join(' | ') || 'Unknown Supabase error';
}

function throwSupabaseError(error: { message?: string; details?: string | null; hint?: string | null; code?: string | null }) {
  throw new Error(supabaseErrorMessage(error));
}

function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    title: row.title,
    customerName: row.customer_name,
    payerPartyId: row.payer_party_id,
    observerPartyId: row.observer_party_id,
    amount: Number(row.amount),
    asset: row.asset,
    settlementDestination: row.settlement_destination,
    dueDate: row.due_date,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    businessId: row.business_id,
    cantonReference: row.canton_reference || undefined,
    cantonWorkflowId: row.canton_workflow_id || undefined,
    cantonSyncStatus: row.canton_sync_status || undefined,
    cantonLastError: row.canton_last_error || undefined,
  };
}

function toInvoiceInsert(invoice: Invoice): InvoiceInsert {
  return {
    id: invoice.id,
    title: invoice.title,
    customer_name: invoice.customerName,
    payer_party_id: invoice.payerPartyId,
    observer_party_id: invoice.observerPartyId,
    amount: invoice.amount,
    asset: invoice.asset,
    settlement_destination: invoice.settlementDestination,
    due_date: invoice.dueDate,
    description: invoice.description,
    status: invoice.status,
    created_at: invoice.createdAt,
    updated_at: invoice.updatedAt,
    business_id: invoice.businessId,
    canton_reference: invoice.cantonReference || null,
    canton_workflow_id: invoice.cantonWorkflowId || null,
    canton_sync_status: invoice.cantonSyncStatus || 'PENDING',
    canton_last_error: invoice.cantonLastError || null,
  };
}

function toAuditEvent(row: AuditRow): AuditEvent {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    action: row.action,
    actorRole: row.actor_role,
    timestamp: row.event_timestamp,
    previousStatus: row.previous_status || undefined,
    newStatus: row.new_status,
    asset: row.asset,
    amount: Number(row.amount),
    referenceId: row.reference_id,
    metadata: typeof row.metadata === 'object' && row.metadata !== null ? row.metadata as Record<string, unknown> : {},
  };
}

function buildAuditInsert(params: {
  invoice: Invoice;
  action: string;
  actorRole: UserRole;
  newStatus: InvoiceStatus;
  previousStatus?: InvoiceStatus;
  sequence: number;
  timestamp?: string;
}): AuditInsert {
  return {
    id: `AUD-${params.invoice.id}-${String(params.sequence).padStart(3, '0')}`,
    invoice_id: params.invoice.id,
    action: params.action,
    actor_role: params.actorRole,
    event_timestamp: params.timestamp || new Date().toISOString(),
    previous_status: params.previousStatus || null,
    new_status: params.newStatus,
    asset: params.invoice.asset,
    amount: params.invoice.amount,
    reference_id: params.invoice.cantonReference || '',
    metadata: {},
  };
}

function timestampFrom(baseIso: string, minutesToAdd: number) {
  const date = new Date(baseIso);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toISOString();
}

function seedAuditEventsForInvoice(invoice: Invoice): AuditInsert[] {
  const steps: Array<{
    action: string;
    actorRole: UserRole;
    previousStatus?: InvoiceStatus;
    newStatus: InvoiceStatus;
  }> = [
    { action: 'Invoice Created', actorRole: 'BUSINESS', newStatus: 'DRAFT' },
    { action: 'Invoice Issued', actorRole: 'BUSINESS', previousStatus: 'DRAFT', newStatus: 'ISSUED' },
  ];

  const progressSteps: InvoiceStatus[] = [
    'PAYMENT_PENDING',
    'PAYMENT_CONFIRMED',
    'SETTLEMENT_PENDING',
    'SETTLED',
    'FULFILLED',
  ];

  const stepMap: Record<InvoiceStatus, { action: string; actorRole: UserRole; previousStatus?: InvoiceStatus; newStatus: InvoiceStatus }> = {
    DRAFT: { action: 'Invoice Created', actorRole: 'BUSINESS', newStatus: 'DRAFT' },
    ISSUED: { action: 'Invoice Issued', actorRole: 'BUSINESS', previousStatus: 'DRAFT', newStatus: 'ISSUED' },
    PAYMENT_PENDING: { action: 'Payment Request Generated', actorRole: 'BUSINESS', previousStatus: 'ISSUED', newStatus: 'PAYMENT_PENDING' },
    PAYMENT_CONFIRMED: { action: 'Payment Confirmed', actorRole: 'PAYER', previousStatus: 'PAYMENT_PENDING', newStatus: 'PAYMENT_CONFIRMED' },
    SETTLEMENT_PENDING: { action: 'Settlement Routed', actorRole: 'SETTLEMENT_OPERATOR', previousStatus: 'PAYMENT_CONFIRMED', newStatus: 'SETTLEMENT_PENDING' },
    SETTLED: { action: 'Settlement Confirmed', actorRole: 'SETTLEMENT_OPERATOR', previousStatus: 'SETTLEMENT_PENDING', newStatus: 'SETTLED' },
    FULFILLED: { action: 'Fulfillment Confirmed', actorRole: 'BUSINESS', previousStatus: 'SETTLED', newStatus: 'FULFILLED' },
    CANCELLED: { action: 'Invoice Cancelled', actorRole: 'BUSINESS', previousStatus: 'PAYMENT_PENDING', newStatus: 'CANCELLED' },
    DISPUTED: { action: 'Invoice Disputed', actorRole: 'PAYER', previousStatus: 'PAYMENT_PENDING', newStatus: 'DISPUTED' },
  };

  if (invoice.status === 'DRAFT') {
    return [buildAuditInsert({ invoice, ...steps[0], sequence: 1, timestamp: invoice.createdAt })];
  }

  const finalIndex = progressSteps.indexOf(invoice.status);
  const statusesToAdd = finalIndex >= 0 ? progressSteps.slice(0, finalIndex + 1) : [];

  if (invoice.status === 'CANCELLED' || invoice.status === 'DISPUTED') {
    statusesToAdd.push(invoice.status);
  }

  const allSteps = [...steps, ...statusesToAdd.map(status => stepMap[status])];

  return allSteps.map((step, index) => buildAuditInsert({
    invoice,
    ...step,
    sequence: index + 1,
    timestamp: timestampFrom(invoice.createdAt, index * 5),
  }));
}

async function ensureDemoBusiness() {
  const { error } = await supabase
    .from('businesses')
    .upsert({ id: DEFAULT_BUSINESS_ID, name: DEFAULT_BUSINESS_NAME }, { onConflict: 'id' });

  if (error) throwSupabaseError(error);
}

async function getNextInvoiceId(): Promise<string> {
  const { data, error } = await supabase.from('invoices').select('id');
  if (error) throwSupabaseError(error);

  const highestId = (data || []).reduce((highest, row) => {
    const match = row.id.match(/INV-(\d+)/);
    if (!match) return highest;
    return Math.max(highest, Number(match[1]));
  }, 0);

  return `INV-${String(highestId + 1).padStart(3, '0')}`;
}

async function getAuditCount(invoiceId: string): Promise<number> {
  const { count, error } = await supabase
    .from('audit_events')
    .select('id', { count: 'exact', head: true })
    .eq('invoice_id', invoiceId);

  if (error) throwSupabaseError(error);
  return count || 0;
}

async function fetchInvoiceOrThrow(invoiceId: string): Promise<Invoice> {
  const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();

  if (error) throwSupabaseError(error);
  if (!data) throw new Error(`Invoice ${invoiceId} not found`);

  return toInvoice(data);
}

export async function getSupabaseSystemStatus(): Promise<SystemStatus> {
  requireSupabaseConfig();

  const { error } = await supabase.from('invoices').select('id').limit(1);

  const cantonReadiness = getCantonReadiness();

  return {
    api: error ? 'degraded' : 'online',
    canton: cantonReadiness.status,
    environment: cantonReadiness.environment,
    supportedAssets: cantonReadiness.supportedAssets,
    lastChecked: new Date().toISOString(),
  };
}

export async function getSupabaseInvoices(): Promise<Invoice[]> {
  requireSupabaseConfig();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throwSupabaseError(error);
  return (data || []).map(toInvoice);
}

export async function getSupabaseInvoiceById(invoiceId: string): Promise<Invoice | null> {
  requireSupabaseConfig();

  const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).maybeSingle();

  if (error) throwSupabaseError(error);
  return data ? toInvoice(data) : null;
}

export async function getSupabaseDashboardMetrics(): Promise<DashboardMetrics> {
  const invoices = await getSupabaseInvoices();

  return {
    totalInvoices: invoices.length,
    awaitingPayment: invoices.filter(inv => inv.status === 'ISSUED' || inv.status === 'PAYMENT_PENDING').length,
    paymentConfirmed: invoices.filter(inv => inv.status === 'PAYMENT_CONFIRMED').length,
    settlementPending: invoices.filter(inv => inv.status === 'SETTLEMENT_PENDING').length,
    settled: invoices.filter(inv => inv.status === 'SETTLED').length,
    fulfilled: invoices.filter(inv => inv.status === 'FULFILLED').length,
    disputed: invoices.filter(inv => inv.status === 'DISPUTED').length,
    totalValueCC: invoices.filter(inv => inv.asset === 'CC').reduce((sum, inv) => sum + inv.amount, 0),
    totalValueUSDCx: invoices.filter(inv => inv.asset === 'USDCx').reduce((sum, inv) => sum + inv.amount, 0),
  };
}

export async function createSupabaseInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  requireSupabaseConfig();
  await ensureDemoBusiness();

  const now = new Date().toISOString();
  const nextInvoiceId = await getNextInvoiceId();

  const invoice: Invoice = {
    id: nextInvoiceId,
    ...payload,
    status: 'PAYMENT_PENDING',
    createdAt: now,
    updatedAt: now,
    businessId: DEFAULT_BUSINESS_ID,
    cantonReference: createCantonReference(nextInvoiceId, payload.asset),
    cantonSyncStatus: initialCantonSyncStatus(),
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(toInvoiceInsert(invoice))
    .select('*')
    .single();

  if (error) throwSupabaseError(error);

  const auditEvents = [
    buildAuditInsert({ invoice, action: 'Invoice Created', actorRole: 'BUSINESS', newStatus: 'DRAFT', sequence: 1 }),
    buildAuditInsert({ invoice, action: 'Invoice Issued', actorRole: 'BUSINESS', previousStatus: 'DRAFT', newStatus: 'ISSUED', sequence: 2 }),
    buildAuditInsert({ invoice, action: 'Payment Request Generated', actorRole: 'BUSINESS', previousStatus: 'ISSUED', newStatus: 'PAYMENT_PENDING', sequence: 3 }),
  ];

  const { error: auditError } = await supabase.from('audit_events').insert(auditEvents);
  if (auditError) throwSupabaseError(auditError);

  return toInvoice(data);
}

export async function updateSupabaseInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
  action: string,
  actorRole: UserRole
): Promise<Invoice | null> {
  requireSupabaseConfig();

  const invoice = await fetchInvoiceOrThrow(invoiceId);
  assertValidTransition(invoice, newStatus);

  const previousStatus = invoice.status;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('invoices')
    .update({ status: newStatus, updated_at: now })
    .eq('id', invoiceId)
    .select('*')
    .single();

  if (error) throwSupabaseError(error);
  if (!data) return null;

  const updatedInvoice = toInvoice(data);
  const sequence = await getAuditCount(invoiceId) + 1;

  const { error: auditError } = await supabase.from('audit_events').insert(
    buildAuditInsert({
      invoice: updatedInvoice,
      action,
      actorRole,
      previousStatus,
      newStatus,
      sequence,
      timestamp: now,
    })
  );

  if (auditError) throwSupabaseError(auditError);

  return updatedInvoice;
}

export async function getSupabaseAuditEvents(invoiceId: string): Promise<AuditEvent[]> {
  requireSupabaseConfig();

  const { data, error } = await supabase
    .from('audit_events')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('event_timestamp', { ascending: true });

  if (error) throwSupabaseError(error);
  return (data || []).map(toAuditEvent);
}

export async function resetSupabaseDemoData(): Promise<void> {
  requireSupabaseConfig();
  await ensureDemoBusiness();

  const { error: auditDeleteError } = await supabase.from('audit_events').delete().neq('id', '');
  if (auditDeleteError) throwSupabaseError(auditDeleteError);

  const { error: invoiceDeleteError } = await supabase.from('invoices').delete().neq('id', '');
  if (invoiceDeleteError) throwSupabaseError(invoiceDeleteError);

  const invoiceRows = mockInvoices.map(toInvoiceInsert);
  const { error: invoiceInsertError } = await supabase.from('invoices').insert(invoiceRows);
  if (invoiceInsertError) throwSupabaseError(invoiceInsertError);

  const auditRows = mockInvoices.flatMap(seedAuditEventsForInvoice);
  const { error: auditInsertError } = await supabase.from('audit_events').insert(auditRows);
  if (auditInsertError) throwSupabaseError(auditInsertError);
}
