import type { AssetType, CantonSyncStatus } from './types';

export type CantonBridgeMode = 'disabled' | 'mock' | 'ledger-api';

export interface CantonReadiness {
  environment: 'DevNet' | 'TestNet' | 'MainNet';
  configured: boolean;
  status: 'online' | 'offline' | 'degraded';
  ledgerApiUrl: string;
  participantId: string;
  workflowPackage: string;
  workflowModule: string;
  supportedAssets: AssetType[];
  syncMode: CantonBridgeMode;
  message: string;
}

const DEFAULT_WORKFLOW_PACKAGE = 'glide-workflow';
const DEFAULT_WORKFLOW_MODULE = 'Glide.Workflow.InvoiceWorkflow';

function normalizeEnvironment(value?: string): CantonReadiness['environment'] {
  if (value === 'TestNet' || value === 'MainNet' || value === 'DevNet') return value;
  return 'DevNet';
}

function normalizeBridgeMode(value?: string): CantonBridgeMode {
  if (value === 'disabled' || value === 'mock' || value === 'ledger-api') return value;
  return 'mock';
}

function hasValue(value?: string) {
  return Boolean(value && value.trim() && !value.includes('replace-with') && !value.includes('your-'));
}

export function getCantonReadiness(): CantonReadiness {
  const ledgerApiUrl = (import.meta.env.VITE_CANTON_LEDGER_API_URL || '').trim();
  const participantId = (import.meta.env.VITE_CANTON_PARTICIPANT_ID || '').trim();
  const workflowPackage = (import.meta.env.VITE_CANTON_WORKFLOW_PACKAGE || DEFAULT_WORKFLOW_PACKAGE).trim();
  const workflowModule = (import.meta.env.VITE_CANTON_WORKFLOW_MODULE || DEFAULT_WORKFLOW_MODULE).trim();
  const environment = normalizeEnvironment(import.meta.env.VITE_CANTON_ENVIRONMENT || 'DevNet');
  const syncMode = normalizeBridgeMode(import.meta.env.VITE_CANTON_SYNC_MODE || 'mock');

  const configured = hasValue(ledgerApiUrl) && hasValue(participantId) && hasValue(workflowPackage);
  const hasRunnableBridge = syncMode === 'mock' || (syncMode === 'ledger-api' && configured);

  return {
    environment,
    configured,
    status: hasRunnableBridge ? 'online' : 'degraded',
    ledgerApiUrl: ledgerApiUrl || 'Not configured',
    participantId: participantId || 'Not configured',
    workflowPackage,
    workflowModule,
    supportedAssets: ['CC', 'USDCx'],
    syncMode,
    message: hasRunnableBridge
      ? syncMode === 'mock'
        ? 'Canton bridge is running in mock DevNet mode. It records contract references and finality states without sending live ledger transactions.'
        : 'Canton ledger API configuration is present. The backend adapter can be wired for live ledger submission.'
      : 'Canton contract package is included, but no live ledger API is configured yet. Supabase remains the app read model.',
  };
}

export function createCantonReference(invoiceId: string, asset: AssetType) {
  const suffix = String(Date.now()).slice(-8);
  return `GLIDE-CN-${invoiceId}-${asset}-${suffix}`;
}

export function createMockCantonWorkflowId(invoiceId: string, asset: AssetType) {
  const safeInvoiceId = invoiceId.replace(/[^a-zA-Z0-9-]/g, '');
  const suffix = String(Date.now()).slice(-10);
  return `mock-cid-${safeInvoiceId}-${asset}-${suffix}`;
}

export function initialCantonSyncStatus(): CantonSyncStatus {
  const readiness = getCantonReadiness();
  if (readiness.syncMode === 'disabled') return 'PENDING';
  return readiness.status === 'online' ? 'READY' : 'PENDING';
}
