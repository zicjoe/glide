import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Invoice, AuditEvent, UserRole } from '../../../lib/types';
import {
  getInvoiceById,
  getAuditEvents,
  confirmPayment,
  routeSettlement,
  markSettled,
  markFulfilled,
  cancelInvoice,
  disputeInvoice,
} from '../../../lib/api';
import {
  formatCurrency,
  formatDateTime,
  getStatusColor,
  formatStatusLabel,
  getCantonSyncStatusColor,
  formatCantonSyncStatus,
} from '../../../lib/format';
import { useDemoRole } from '../../../lib/useDemoRole';
import { syncInvoiceWorkflowToCanton } from '../../../lib/cantonSync';
import { getCantonReadiness } from '../../../lib/canton';
import {
  getAvailableWorkflowActions,
  getBlockedWorkflowActions,
  getRoleDescription,
  type WorkflowActionDefinition,
  type WorkflowActionKey,
} from '../../../lib/workflowRules';

type WorkflowActionRunner = (id: string, actorRole?: UserRole) => Promise<Invoice | null>;

const actionRunners: Record<WorkflowActionKey, WorkflowActionRunner> = {
  confirmPayment,
  routeSettlement,
  markSettled,
  markFulfilled,
  cancelInvoice,
  disputeInvoice,
};

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useDemoRole();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncingCanton, setIsSyncingCanton] = useState(false);

  const loadData = async () => {
    if (!id) return;

    setLoadError(null);

    try {
      const [invoiceData, auditData] = await Promise.all([
        getInvoiceById(id),
        getAuditEvents(id),
      ]);

      setInvoice(invoiceData);
      setAuditEvents(auditData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load invoice workflow';
      setLoadError(message);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAction = async (action: WorkflowActionDefinition) => {
    if (action.confirmMessage && !window.confirm(action.confirmMessage)) return;
    if (!id) return;

    setIsProcessing(true);
    setActionError(null);

    try {
      await actionRunners[action.key](id, currentRole);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed. Please try again.';
      setActionError(message);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleCantonSync = async () => {
    if (!invoice) return;

    setIsSyncingCanton(true);
    setActionError(null);
    setSyncMessage(null);

    try {
      const result = await syncInvoiceWorkflowToCanton(invoice.id);
      setInvoice(result.invoice);
      setSyncMessage(result.message);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Canton sync failed. Please try again.';
      setActionError(message);
    } finally {
      setIsSyncingCanton(false);
    }
  };

  if (loadError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="text-2xl text-foreground mb-2">Invoice failed to load</h1>
        <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
        <button
          type="button"
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading invoice...</div>
      </div>
    );
  }

  const availableActions = getAvailableWorkflowActions(invoice, currentRole);
  const blockedActions = getBlockedWorkflowActions(invoice, currentRole);
  const cantonReadiness = getCantonReadiness();
  const cantonSyncIsFinalized = invoice.cantonSyncStatus === 'FINALIZED';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/app/invoices')}
            className="text-primary hover:underline mb-2 text-sm"
          >
            ← Back to Invoices
          </button>
          <h1 className="text-3xl text-foreground">{invoice.title}</h1>
          <p className="text-muted-foreground">{invoice.id}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(invoice.status)}`}>
          {formatStatusLabel(invoice.status)}
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <div className="text-sm text-foreground">Action failed</div>
          <p className="text-sm text-muted-foreground mt-1">{actionError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Customer" value={invoice.customerName} />
              <DetailRow label="Amount" value={formatCurrency(invoice.amount, invoice.asset)} />
              <DetailRow label="Asset" value={invoice.asset} />
              <DetailRow label="Due Date" value={formatDateTime(invoice.dueDate)} />
              <DetailRow label="Payer Party ID" value={invoice.payerPartyId} />
              <DetailRow label="Observer Party ID" value={invoice.observerPartyId} />
              <div className="col-span-2">
                <DetailRow label="Settlement Destination" value={invoice.settlementDestination} mono />
              </div>
              {invoice.cantonReference && (
                <div className="col-span-2">
                  <DetailRow label="Canton Reference" value={invoice.cantonReference} />
                </div>
              )}
              {invoice.cantonWorkflowId && (
                <div className="col-span-2">
                  <DetailRow label="Canton Workflow ID" value={invoice.cantonWorkflowId} mono />
                </div>
              )}
              {invoice.cantonSyncStatus && (
                <DetailRow label="Canton Sync" value={invoice.cantonSyncStatus} />
              )}
              {invoice.cantonLastError && (
                <div className="col-span-2">
                  <DetailRow label="Canton Last Error" value={invoice.cantonLastError} />
                </div>
              )}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div className="text-foreground">{invoice.description}</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Workflow Timeline</h2>
            <div className="space-y-3">
              {auditEvents.map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${idx === auditEvents.length - 1 ? 'bg-primary' : 'bg-muted'}`} />
                    {idx < auditEvents.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground">{event.action}</span>
                      <span className={`px-2 py-0.5 rounded border text-xs ${getStatusColor(event.newStatus)}`}>
                        {formatStatusLabel(event.newStatus)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.actorRole} • {formatDateTime(event.timestamp)}
                    </div>
                    {event.previousStatus && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatStatusLabel(event.previousStatus)} → {formatStatusLabel(event.newStatus)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {auditEvents.length === 0 && (
                <div className="text-sm text-muted-foreground">No audit events recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-2 text-foreground">Role View</h2>
            <div className="px-3 py-2 rounded-lg bg-muted text-foreground mb-3">
              {currentRole.replace(/_/g, ' ')}
            </div>
            <p className="text-sm text-muted-foreground">
              {getRoleDescription(currentRole)}
            </p>
          </div>



          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Canton Sync</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Sync status</span>
                <span className={`px-3 py-1 rounded-lg border text-xs ${getCantonSyncStatusColor(invoice.cantonSyncStatus)}`}>
                  {formatCantonSyncStatus(invoice.cantonSyncStatus)}
                </span>
              </div>
              <MetadataRow label="Bridge mode" value={cantonReadiness.syncMode} />
              <MetadataRow label="Environment" value={cantonReadiness.environment} />
              {invoice.cantonWorkflowId && (
                <MetadataRow label="Workflow ID" value={invoice.cantonWorkflowId} />
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mock mode records DevNet-style Canton finality in Supabase for the hackathon demo. Live ledger submission should stay behind the backend adapter.
              </p>
              {syncMessage && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
                  {syncMessage}
                </div>
              )}
              <button
                type="button"
                onClick={handleCantonSync}
                disabled={isSyncingCanton || cantonSyncIsFinalized}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {cantonSyncIsFinalized ? 'Canton Workflow Finalized' : isSyncingCanton ? 'Syncing...' : 'Sync Canton Workflow'}
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Actions</h2>
            <div className="space-y-3">
              {availableActions.map((action) => (
                <ActionButton
                  key={action.key}
                  onClick={() => handleAction(action)}
                  disabled={isProcessing}
                  label={isProcessing ? 'Processing...' : action.label}
                  variant={action.destructive ? 'danger' : 'primary'}
                />
              ))}

              {availableActions.length === 0 && (
                <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                  No action is available for this role at the current invoice status.
                </div>
              )}

              {blockedActions.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Actions controlled by other roles</div>
                  <div className="space-y-2">
                    {blockedActions.map((action) => (
                      <div key={action.key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
                        <span className="text-muted-foreground">{action.label}</span>
                        <span className="text-foreground">{action.actorRole.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Metadata</h2>
            <div className="space-y-3">
              <MetadataRow label="Created" value={formatDateTime(invoice.createdAt)} />
              <MetadataRow label="Updated" value={formatDateTime(invoice.updatedAt)} />
              <MetadataRow label="Business ID" value={invoice.businessId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className={`text-foreground ${mono ? 'font-mono text-sm' : ''}`}>{value}</div>
    </div>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  label,
  variant = 'primary',
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'border border-border text-foreground hover:bg-muted',
    danger: 'bg-destructive text-destructive-foreground hover:opacity-90',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
