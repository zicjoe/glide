const DEFAULT_TEMPLATE_ID = 'glide-workflow:Glide.Workflow.InvoiceWorkflow:InvoiceWorkflow';

export function getCantonConfig() {
  return {
    jsonApiUrl: cleanUrl(process.env.CANTON_JSON_API_URL || process.env.CANTON_LEDGER_API_URL || ''),
    authToken: (process.env.CANTON_AUTH_TOKEN || '').trim(),
    apiKey: (process.env.CANTON_API_KEY || '').trim(),
    userId: (process.env.CANTON_USER_ID || 'glide-backend').trim(),
    businessParty: (process.env.CANTON_BUSINESS_PARTY || '').trim(),
    settlementOperatorParty: (process.env.CANTON_SETTLEMENT_OPERATOR_PARTY || '').trim(),
    templateId: (process.env.CANTON_INVOICE_TEMPLATE_ID || DEFAULT_TEMPLATE_ID).trim(),
  };
}

export function getCantonStatus() {
  const config = getCantonConfig();
  const missing = [];

  if (!config.jsonApiUrl) missing.push('CANTON_JSON_API_URL');
  if (!config.businessParty) missing.push('CANTON_BUSINESS_PARTY');
  if (!config.settlementOperatorParty) missing.push('CANTON_SETTLEMENT_OPERATOR_PARTY');

  return {
    configured: missing.length === 0,
    missing,
    jsonApiUrl: config.jsonApiUrl || null,
    templateId: config.templateId,
    userId: config.userId,
    message: missing.length === 0
      ? 'Canton backend configuration is present. Commands will be submitted to the configured JSON Ledger API.'
      : `Canton backend is not configured. Missing: ${missing.join(', ')}`,
  };
}

export function assertCantonConfigured() {
  const status = getCantonStatus();

  if (!status.configured) {
    const error = new Error(status.message);
    error.statusCode = 400;
    throw error;
  }

  return getCantonConfig();
}

function cleanUrl(value) {
  return value.trim().replace(/\/$/, '');
}
