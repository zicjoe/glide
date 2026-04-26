import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { DashboardMetrics, Invoice, SystemStatus } from '../../../lib/types';
import { getDashboardMetrics, getInvoices, getSystemStatus } from '../../../lib/api';
import { formatCurrency, formatDateTime, getStatusColor, formatStatusLabel } from '../../../lib/format';

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    Promise.all([
      getDashboardMetrics(),
      getInvoices(),
      getSystemStatus(),
    ]).then(([metricsData, invoicesData, statusData]) => {
      setMetrics(metricsData);
      setRecentInvoices(invoicesData.slice(0, 5));
      setSystemStatus(statusData);
    });
  }, []);

  if (!metrics || !systemStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Dashboard</h1>
        <Link
          to="/app/invoices/create"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Create Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Total Invoices" value={metrics.totalInvoices} />
        <MetricCard label="Awaiting Payment" value={metrics.awaitingPayment} color="amber" />
        <MetricCard label="Payment Confirmed" value={metrics.paymentConfirmed} color="blue" />
        <MetricCard label="Settlement Pending" value={metrics.settlementPending} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Settled" value={metrics.settled} color="green" />
        <MetricCard label="Fulfilled" value={metrics.fulfilled} color="emerald" />
        <MetricCard label="Disputed" value={metrics.disputed} color="red" />
        <MetricCard label="Total Value CC" value={formatCurrency(metrics.totalValueCC, 'CC')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl mb-4 text-foreground">Total Value by Asset</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">CC</span>
              <span className="text-foreground">{formatCurrency(metrics.totalValueCC, 'CC')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">USDCx</span>
              <span className="text-foreground">{formatCurrency(metrics.totalValueUSDCx, 'USDCx')}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl mb-4 text-foreground">System Status</h2>
          <div className="space-y-3">
            <StatusRow label="API Status" value={systemStatus.api} />
            <StatusRow label="Canton Status" value={systemStatus.canton} />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Environment</span>
              <span className="px-3 py-1 rounded-full bg-muted text-foreground text-sm">
                {systemStatus.environment}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Supported Assets</span>
              <span className="text-foreground text-sm">
                {systemStatus.supportedAssets.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-foreground">Recent Invoices</h2>
          <Link
            to="/app/invoices"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invoices yet. Create your first invoice to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/app/invoices/${invoice.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-foreground">{invoice.title}</span>
                    <span className={`px-2 py-0.5 rounded border text-xs ${getStatusColor(invoice.status)}`}>
                      {formatStatusLabel(invoice.status)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.customerName} • {invoice.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground">{formatCurrency(invoice.amount, invoice.asset)}</div>
                  <div className="text-sm text-muted-foreground">{formatDateTime(invoice.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: 'amber' | 'blue' | 'orange' | 'green' | 'emerald' | 'red';
}) {
  const colors = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`text-3xl ${color ? colors[color] : 'text-foreground'}`}>
        {value}
      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  const getColor = (status: string) => {
    if (status === 'online') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (status === 'offline') return 'bg-red-500/20 text-red-300 border-red-500/30';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={`px-3 py-1 rounded border text-xs ${getColor(value)}`}>
        {value}
      </span>
    </div>
  );
}
