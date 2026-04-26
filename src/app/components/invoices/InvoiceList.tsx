import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Invoice, AssetType, InvoiceStatus } from '../../../lib/types';
import { getInvoices } from '../../../lib/api';
import { formatCurrency, formatDate, getStatusColor, formatStatusLabel } from '../../../lib/format';

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [assetFilter, setAssetFilter] = useState<AssetType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getInvoices().then(setInvoices);
  }, []);

  useEffect(() => {
    let filtered = [...invoices];

    if (assetFilter !== 'ALL') {
      filtered = filtered.filter((inv) => inv.asset === assetFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.id.toLowerCase().includes(query) ||
          inv.title.toLowerCase().includes(query) ||
          inv.customerName.toLowerCase().includes(query)
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, assetFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Invoices</h1>
        <Link
          to="/app/invoices/create"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Create Invoice
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

          <div className="flex items-center text-muted-foreground">
            {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No invoices found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Invoice ID</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Title</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Payer</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Asset</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Created</th>
                  <th className="text-left px-6 py-3 text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-foreground">{invoice.id}</td>
                    <td className="px-6 py-4 text-foreground">{invoice.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{invoice.customerName}</td>
                    <td className="px-6 py-4 text-foreground">{formatCurrency(invoice.amount, invoice.asset)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-muted text-foreground text-sm">
                        {invoice.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(invoice.status)}`}>
                        {formatStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(invoice.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/app/invoices/${invoice.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </Link>
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
