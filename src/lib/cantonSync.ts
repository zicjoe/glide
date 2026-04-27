import { supabase, requireSupabaseConfig } from './supabaseClient';
import { createMockCantonWorkflowId, getCantonReadiness } from './canton';
import type { AuditEvent, CantonSyncStatus, Invoice } from './types';
import type { Database } from './database.types';

type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
type AuditInsert = Database['public']['Tables']['audit_events']['Insert'];

export interface CantonSyncResult {
  invoice: Invoice;
  status: CantonSyncStatus;
  workflowId: string;
  mode: 'mock' | 'ledger-api';
  message: string;
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

function throwSupabaseError(error: { message?: string; details?: string | null; hint?: string | null; code?: string | null }): never {
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

async function fetchInvoice(invoiceId: string): Promise<Invoice> {
  const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();
  if (error) throwSupabaseError(error);
  if (!data) throw new Error(`Invoice ${invoiceId} not found`);
  return toInvoice(data);
}

async function getAuditCount(invoiceId: string): Promise<number> {
  const { count, error } = await supabase
    .from('audit_events')
    .select('id', { count: 'exact', head: true })
    .eq('invoice_id', invoiceId);

  if (error) throwSupabaseError(error);
  return count || 0;
}

async function recordCantonAuditEvent(invoice: Invoice, workflowId: string, status: CantonSyncStatus): Promise<AuditEvent | null> {
  const sequence = (await getAuditCount(invoice.id)) + 1;
  const now = new Date().toISOString();
  const auditRow: AuditInsert = {
    id: `AUD-${invoice.id}-${String(sequence).padStart(3, '0')}`,
    invoice_id: invoice.id,
    action: status === 'FINALIZED' ? 'Canton Workflow Finalized' : 'Canton Workflow Submitted',
    actor_role: 'SETTLEMENT_OPERATOR',
    event_timestamp: now,
    previous_status: invoice.status,
    new_status: invoice.status,
    asset: invoice.asset,
    amount: invoice.amount,
    reference_id: workflowId,
    metadata: {
      cantonSyncStatus: status,
      cantonWorkflowId: workflowId,
      cantonReference: invoice.cantonReference,
    },
  };

  const { error } = await supabase.from('audit_events').insert(auditRow);
  if (error) throwSupabaseError(error);
  return null;
}

async function updateCantonSyncFields(invoiceId: string, params: {
  workflowId: string;
  syncStatus: CantonSyncStatus;
  lastError?: string | null;
}): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      canton_workflow_id: params.workflowId,
      canton_sync_status: params.syncStatus,
      canton_last_error: params.lastError || null,
    })
    .eq('id', invoiceId)
    .select('*')
    .single();

  if (error) throwSupabaseError(error);
  if (!data) throw new Error(`Invoice ${invoiceId} was not updated`);
  return toInvoice(data);
}

async function markCantonSyncFailed(invoice: Invoice, message: string): Promise<Invoice> {
  return updateCantonSyncFields(invoice.id, {
    workflowId: invoice.cantonWorkflowId || '',
    syncStatus: 'FAILED',
    lastError: message,
  });
}

export async function syncInvoiceWorkflowToCanton(invoiceId: string): Promise<CantonSyncResult> {
  requireSupabaseConfig();

  const readiness = getCantonReadiness();
  const invoice = await fetchInvoice(invoiceId);

  if (invoice.cantonSyncStatus === 'FINALIZED' && invoice.cantonWorkflowId) {
    return {
      invoice,
      status: 'FINALIZED',
      workflowId: invoice.cantonWorkflowId,
      mode: readiness.syncMode === 'ledger-api' ? 'ledger-api' : 'mock',
      message: 'Invoice workflow is already finalized in the Canton sync read model.',
    };
  }

  if (readiness.syncMode === 'disabled') {
    const message = 'Canton sync is disabled. Set VITE_CANTON_SYNC_MODE=mock for DevNet demo sync or ledger-api for live adapter work.';
    await markCantonSyncFailed(invoice, message);
    throw new Error(message);
  }

  if (readiness.syncMode === 'ledger-api' && !readiness.configured) {
    const message = 'Canton ledger API mode is selected, but VITE_CANTON_LEDGER_API_URL or VITE_CANTON_PARTICIPANT_ID is missing.';
    await markCantonSyncFailed(invoice, message);
    throw new Error(message);
  }

  if (readiness.syncMode === 'ledger-api') {
    const message = 'Live Canton ledger submission is intentionally routed through the backend adapter. Use the server adapter before sending real ledger transactions.';
    await markCantonSyncFailed(invoice, message);
    throw new Error(message);
  }

  const workflowId = invoice.cantonWorkflowId || createMockCantonWorkflowId(invoice.id, invoice.asset);

  await updateCantonSyncFields(invoice.id, {
    workflowId,
    syncStatus: 'SUBMITTED',
  });

  await updateCantonSyncFields(invoice.id, {
    workflowId,
    syncStatus: 'ACCEPTED',
  });

  const finalizedInvoice = await updateCantonSyncFields(invoice.id, {
    workflowId,
    syncStatus: 'FINALIZED',
  });

  await recordCantonAuditEvent(finalizedInvoice, workflowId, 'FINALIZED');

  return {
    invoice: finalizedInvoice,
    status: 'FINALIZED',
    workflowId,
    mode: 'mock',
    message: 'Mock DevNet Canton workflow finalized and indexed in Supabase. No live ledger transaction was sent.',
  };
}
