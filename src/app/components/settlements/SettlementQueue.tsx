import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Invoice } from '../../../lib/types';
import { getInvoices, routeSettlement, markSettled } from '../../../lib/api';
import { formatCurrency, formatDate, getStatusColor, formatStatusLabel } from '../../../lib/format';
import { useDemoRole } from '../../../lib/useDemoRole';

export function SettlementQueue() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentRole } = useDemoRole();
  const canOperateSettlement = currentRole === 'SETTLEMENT_OPERATOR';

  const loadInvoices = async () => {
    setError(null);

    try {
      const allInvoices = await getInvoices();
      const settlementQueue = allInvoices.filter(
        (inv) => inv.status === 'PAYMENT_CONFIRMED' || inv.status === 'SETTLEMENT_PENDING'
      );
      setInvoices(settlementQueue);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Failed to load settlement queue';
      setError(message);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleRouteSettlement = async (invoiceId: string) => {
    setIsProcessing(invoiceId);
    setError(null);

    try {
      await routeSettlement(invoiceId, currentRole);
      await loadInvoices();
    } catch (routeError) {
      const message = routeError instanceof Error ? routeError.message : 'Failed to route settlement';
      setError(message);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleMarkSettled = async (invoiceId: string) => {
    setIsProcessing(invoiceId);
    setError(null);

    try {
      await markSettled(invoiceId, currentRole);
      await loadInvoices();
    } catch (settledError) {
      const message = settledError instanceof Error ? settledError.message : 'Failed to mark settlement complete';
      setError(message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-foreground">Settlement Queue</h1>
          <p className="text-muted-foreground mt-2">
            Invoices awaiting settlement routing or confirmation
          </p>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} in queue
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Current role: {currentRole.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {!canOperateSettlement && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="text-sm text-foreground">Settlement actions require SETTLEMENT OPERATOR.</div>
          <p className="text-sm text-muted-foreground mt-1">
            Switch the role selector in the top bar to route settlement or mark settlement complete.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <div className="text-sm text-foreground">Settlement queue error</div>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="text-muted-foreground mb-4">Settlement queue is empty</div>
          <p className="text-sm text-muted-foreground">
            Invoices will appear here once payment is confirmed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-foreground">{invoice.title}</h3>
                    <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(invoice.status)}`}>
                      {formatStatusLabel(invoice.status)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.id} • {invoice.customerName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-foreground mb-1">
                    {formatCurrency(invoice.amount, invoice.asset)}
                  </div>
                  <div className="text-sm text-muted-foreground">{invoice.asset}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InfoItem label="Business" value={invoice.businessId} />
                <InfoItem label="Payer Party ID" value={invoice.payerPartyId} />
                <InfoItem label="Due Date" value={formatDate(invoice.dueDate)} />
              </div>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Settlement Destination</div>
                <div className="text-foreground font-mono text-sm">{invoice.settlementDestination}</div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                {invoice.status === 'PAYMENT_CONFIRMED' && (
                  <button
                    onClick={() => handleRouteSettlement(invoice.id)}
                    disabled={isProcessing === invoice.id || !canOperateSettlement}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isProcessing === invoice.id ? 'Processing...' : 'Route Settlement'}
                  </button>
                )}

                {invoice.status === 'SETTLEMENT_PENDING' && (
                  <button
                    onClick={() => handleMarkSettled(invoice.id)}
                    disabled={isProcessing === invoice.id || !canOperateSettlement}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isProcessing === invoice.id ? 'Processing...' : 'Mark Settled'}
                  </button>
                )}

                <Link
                  to={`/app/invoices/${invoice.id}`}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-foreground">{value}</div>
    </div>
  );
}
