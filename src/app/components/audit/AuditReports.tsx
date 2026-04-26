import { useState, useEffect } from 'react';
import type { Invoice, AuditEvent, AssetType, InvoiceStatus, UserRole } from '../../../lib/types';
import { getInvoices, getAuditEvents } from '../../../lib/api';
import { formatCurrency, formatDateTime, getStatusColor, formatStatusLabel } from '../../../lib/format';

export function AuditReports() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [allAuditEvents, setAllAuditEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);

  const [invoiceIdFilter, setInvoiceIdFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState<AssetType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  useEffect(() => {
    const loadData = async () => {
      const invoicesData = await getInvoices();
      setInvoices(invoicesData);

      const allEvents: AuditEvent[] = [];
      for (const invoice of invoicesData) {
        const events = await getAuditEvents(invoice.id);
        allEvents.push(...events);
      }

      allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAllAuditEvents(allEvents);
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...allAuditEvents];

    if (invoiceIdFilter) {
      filtered = filtered.filter((event) =>
        event.invoiceId.toLowerCase().includes(invoiceIdFilter.toLowerCase())
      );
    }

    if (assetFilter !== 'ALL') {
      filtered = filtered.filter((event) => event.asset === assetFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((event) => event.newStatus === statusFilter);
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((event) => event.actorRole === roleFilter);
    }

    setFilteredEvents(filtered);
  }, [allAuditEvents, invoiceIdFilter, assetFilter, statusFilter, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Audit Reports</h1>
          <p className="text-muted-foreground mt-2">
            Complete audit trail for all invoice workflow state changes
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
          Export Report
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Invoice ID..."
            value={invoiceIdFilter}
            onChange={(e) => setInvoiceIdFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
          />

          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value as AssetType | 'ALL')}
            className="px-4 py-2 rounded-lg bg-input-background border border-input text-foreground"
          >
            <option value="ALL">All Assets</option>
            <option value="CC">CC</option>
            <option value="USDCx">USDCx</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'ALL')}
            className="px-4 py-2 rounded-lg bg-input-background border border-input text-foreground"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ISSUED">Issued</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
            <option value="SETTLEMENT_PENDING">Settlement Pending</option>
            <option value="SETTLED">Settled</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="DISPUTED">Disputed</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
            className="px-4 py-2 rounded-lg bg-input-background border border-input text-foreground"
          >
            <option value="ALL">All Roles</option>
            <option value="BUSINESS">Business</option>
            <option value="PAYER">Payer</option>
            <option value="SETTLEMENT_OPERATOR">Settlement Operator</option>
            <option value="OBSERVER">Observer</option>
          </select>

          <div className="flex items-center text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No audit events found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Timestamp</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Invoice ID</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Action</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Actor Role</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Previous Status</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">New Status</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Asset</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Reference ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDateTime(event.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-foreground">{event.invoiceId}</td>
                    <td className="px-6 py-4 text-foreground">{event.action}</td>
                    <td className="px-6 py-4 text-muted-foreground">{event.actorRole}</td>
                    <td className="px-6 py-4">
                      {event.previousStatus ? (
                        <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(event.previousStatus)}`}>
                          {formatStatusLabel(event.previousStatus)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(event.newStatus)}`}>
                        {formatStatusLabel(event.newStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-muted text-foreground text-xs">
                        {event.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">{formatCurrency(event.amount, event.asset)}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {event.referenceId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
