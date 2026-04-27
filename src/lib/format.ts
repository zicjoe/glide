import type { InvoiceStatus, AssetType, CantonSyncStatus } from './types';

export function formatCurrency(amount: number, asset: AssetType): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${asset}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: InvoiceStatus): string {
  const statusColors: Record<InvoiceStatus, string> = {
    DRAFT: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    ISSUED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    PAYMENT_PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    PAYMENT_CONFIRMED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    SETTLEMENT_PENDING: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    SETTLED: 'bg-green-500/20 text-green-300 border-green-500/30',
    FULFILLED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    DISPUTED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return statusColors[status];
}

export function formatStatusLabel(status: InvoiceStatus): string {
  return status.replace(/_/g, ' ');
}

export function getSystemStatusColor(status: 'online' | 'offline' | 'degraded'): string {
  const colors = {
    online: 'bg-green-500/20 text-green-300 border-green-500/30',
    offline: 'bg-red-500/20 text-red-300 border-red-500/30',
    degraded: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  return colors[status];
}

export function getCantonSyncStatusColor(status?: CantonSyncStatus): string {
  const colors: Record<CantonSyncStatus, string> = {
    PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    READY: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    SUBMITTED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    ACCEPTED: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    FINALIZED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    FAILED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return colors[status || 'PENDING'];
}

export function formatCantonSyncStatus(status?: CantonSyncStatus): string {
  return (status || 'PENDING').replace(/_/g, ' ');
}
