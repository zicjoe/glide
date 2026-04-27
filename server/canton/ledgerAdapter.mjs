import { buildInvoiceWorkflowPayload, resolveChoiceForStatusAction } from './contractPayloads.mjs';

const DEFAULT_ENVIRONMENT = 'DevNet';
const DEFAULT_SYNC_MODE = 'mock';

export function getCantonAdapterStatus() {
  const syncMode = process.env.GLIDE_CANTON_SYNC_MODE || DEFAULT_SYNC_MODE;
  const ledgerApiUrl = process.env.GLIDE_CANTON_LEDGER_API_URL || '';
  const participantId = process.env.GLIDE_CANTON_PARTICIPANT_ID || '';
  const workflowPackage = process.env.GLIDE_CANTON_WORKFLOW_PACKAGE || 'glide-workflow';

  const configured = Boolean(ledgerApiUrl && participantId && workflowPackage);
  const online = syncMode === 'mock' || (syncMode === 'ledger-api' && configured);

  return {
    status: online ? 'online' : 'degraded',
    environment: process.env.GLIDE_CANTON_ENVIRONMENT || DEFAULT_ENVIRONMENT,
    syncMode,
    configured,
    ledgerApiUrl: ledgerApiUrl || 'Not configured',
    participantId: participantId || 'Not configured',
    workflowPackage,
    supportedAssets: ['CC', 'USDCx'],
    message: syncMode === 'mock'
      ? 'Canton adapter is running in mock DevNet mode. No live ledger transaction will be sent.'
      : configured
        ? 'Canton adapter has ledger configuration. Wire submit/exercise calls before live use.'
        : 'Canton ledger API configuration is missing.',
  };
}

export async function submitInvoiceWorkflow(invoice) {
  const status = getCantonAdapterStatus();
  const payload = buildInvoiceWorkflowPayload(invoice);

  if (status.syncMode === 'disabled') {
    throw new Error('Canton adapter is disabled. Set GLIDE_CANTON_SYNC_MODE=mock for demo mode.');
  }

  if (status.syncMode === 'ledger-api') {
    throw new Error('Live Canton ledger submission is not enabled yet. Keep ledger keys on the backend and wire this adapter to your Canton JSON/Ledger API before production use.');
  }

  return {
    mode: 'mock',
    cantonWorkflowId: createMockContractId(invoice),
    cantonSyncStatus: 'FINALIZED',
    payload,
    submittedAt: new Date().toISOString(),
    message: 'Mock Canton workflow finalized. This proves the app boundary without sending a live ledger transaction.',
  };
}

export async function exerciseInvoiceWorkflowChoice(invoice, actionPath) {
  const choice = resolveChoiceForStatusAction(actionPath);

  if (!choice) {
    throw new Error(`No Canton choice is mapped for action: ${actionPath}`);
  }

  const status = getCantonAdapterStatus();

  if (status.syncMode !== 'mock') {
    throw new Error('Live choice exercise is not enabled yet. Wire this through the backend ledger adapter before production use.');
  }

  return {
    mode: 'mock',
    choice,
    cantonWorkflowId: invoice.cantonWorkflowId || createMockContractId(invoice),
    exercisedAt: new Date().toISOString(),
  };
}

function createMockContractId(invoice) {
  const safeId = String(invoice.id).replace(/[^a-zA-Z0-9-]/g, '');
  const suffix = String(Date.now()).slice(-10);
  return `mock-cid-${safeId}-${invoice.asset}-${suffix}`;
}
