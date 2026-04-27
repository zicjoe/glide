import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const error = new Error('Supabase server client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your backend environment.');
    error.statusCode = 400;
    throw error;
  }

  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}

export async function fetchInvoiceForBackend(invoiceId) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();

  if (error) throw toSupabaseError(error);
  if (!data) {
    const notFound = new Error(`Invoice ${invoiceId} not found`);
    notFound.statusCode = 404;
    throw notFound;
  }

  return data;
}

export async function updateInvoiceFromCanton(invoiceId, patch) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', invoiceId)
    .select('*')
    .single();

  if (error) throw toSupabaseError(error);
  return data;
}

export async function insertCantonAuditEvent(invoice, params) {
  const supabase = getSupabaseAdmin();
  const sequence = await getAuditCount(invoice.id) + 1;

  const { error } = await supabase.from('audit_events').insert({
    id: `AUD-${invoice.id}-${String(sequence).padStart(3, '0')}`,
    invoice_id: invoice.id,
    action: params.action,
    actor_role: params.actorRole,
    event_timestamp: new Date().toISOString(),
    previous_status: params.previousStatus || null,
    new_status: params.newStatus,
    asset: invoice.asset,
    amount: invoice.amount,
    reference_id: params.referenceId || invoice.canton_reference || '',
    metadata: params.metadata || {},
  });

  if (error) throw toSupabaseError(error);
}

export async function markCantonFailure(invoiceId, message) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('invoices')
    .update({ canton_sync_status: 'FAILED', canton_last_error: message, updated_at: new Date().toISOString() })
    .eq('id', invoiceId);
}

async function getAuditCount(invoiceId) {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from('audit_events')
    .select('id', { count: 'exact', head: true })
    .eq('invoice_id', invoiceId);

  if (error) throw toSupabaseError(error);
  return count || 0;
}

function toSupabaseError(error) {
  const parts = [
    error.message,
    error.details ? `Details: ${error.details}` : null,
    error.hint ? `Hint: ${error.hint}` : null,
    error.code ? `Code: ${error.code}` : null,
  ].filter(Boolean);

  const wrapped = new Error(parts.join(' | ') || 'Supabase backend error');
  wrapped.statusCode = 500;
  return wrapped;
}
