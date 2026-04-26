import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Invoice, AuditEvent } from '../../../lib/types';
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
import { formatCurrency, formatDateTime, getStatusColor, formatStatusLabel } from '../../../lib/format';

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    if (!id) return;
    const [invoiceData, auditData] = await Promise.all([
      getInvoiceById(id),
      getAuditEvents(id),
    ]);
    setInvoice(invoiceData);
    setAuditEvents(auditData);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAction = async (
    action: (id: string) => Promise<Invoice | null>,
    confirmMessage?: string
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    if (!id) return;

    setIsProcessing(true);
    try {
      await action(id);
      await loadData();
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading invoice...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl mb-4 text-foreground">Actions</h2>
            <div className="space-y-3">
              {invoice.status === 'ISSUED' || invoice.status === 'PAYMENT_PENDING' ? (
                <ActionButton
                  onClick={() => handleAction(confirmPayment)}
                  disabled={isProcessing}
                  label="Confirm Payment"
                  variant="primary"
                />
              ) : null}

              {invoice.status === 'PAYMENT_CONFIRMED' ? (
                <ActionButton
                  onClick={() => handleAction(routeSettlement)}
                  disabled={isProcessing}
                  label="Route Settlement"
                  variant="primary"
                />
              ) : null}

              {invoice.status === 'SETTLEMENT_PENDING' ? (
                <ActionButton
                  onClick={() => handleAction(markSettled)}
                  disabled={isProcessing}
                  label="Mark Settled"
                  variant="primary"
                />
              ) : null}

              {invoice.status === 'SETTLED' ? (
                <ActionButton
                  onClick={() => handleAction(markFulfilled)}
                  disabled={isProcessing}
                  label="Mark Fulfilled"
                  variant="primary"
                />
              ) : null}

              {invoice.status !== 'CANCELLED' &&
                invoice.status !== 'FULFILLED' &&
                invoice.status !== 'DISPUTED' ? (
                <>
                  <ActionButton
                    onClick={() =>
                      handleAction(cancelInvoice, 'Are you sure you want to cancel this invoice?')
                    }
                    disabled={isProcessing}
                    label="Cancel Invoice"
                    variant="secondary"
                  />
                  <ActionButton
                    onClick={() =>
                      handleAction(disputeInvoice, 'Are you sure you want to dispute this invoice?')
                    }
                    disabled={isProcessing}
                    label="Dispute Invoice"
                    variant="danger"
                  />
                </>
              ) : null}
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
