import type { AssetType, CantonSyncStatus } from './types';

export interface CantonReadiness {
  environment: 'DevNet' | 'TestNet' | 'MainNet';
  configured: boolean;
  status: 'online' | 'offline' | 'degraded';
  ledgerApiUrl: string;
  participantId: string;
  workflowPackage: string;
  workflowModule: string;
  supportedAssets: AssetType[];
  message: string;
}

const DEFAULT_WORKFLOW_PACKAGE = 'glide-workflow';
const DEFAULT_WORKFLOW_MODULE = 'Glide.Workflow.InvoiceWorkflow';

function normalizeEnvironment(value?: string): CantonReadiness['environment'] {
  if (value === 'TestNet' || value === 'MainNet' || value === 'DevNet') return value;
  return 'DevNet';
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

  const configured = hasValue(ledgerApiUrl) && hasValue(participantId) && hasValue(workflowPackage);

  return {
    environment,
    configured,
    status: configured ? 'online' : 'degraded',
    ledgerApiUrl: ledgerApiUrl || 'Not configured',
    participantId: participantId || 'Not configured',
    workflowPackage,
    workflowModule,
    supportedAssets: ['CC', 'USDCx'],
    message: configured
      ? 'Canton configuration is present. Frontend can now be wired to a ledger API adapter.'
      : 'Canton contract package is included, but no live ledger API is configured yet. Supabase remains the app read model.',
  };
}

export function createCantonReference(invoiceId: string, asset: AssetType) {
  const suffix = String(Date.now()).slice(-8);
  return `GLIDE-CN-${invoiceId}-${asset}-${suffix}`;
}

export function initialCantonSyncStatus(): CantonSyncStatus {
  return getCantonReadiness().configured ? 'READY' : 'PENDING';
}
