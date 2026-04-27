import { assertCantonConfigured, getCantonStatus } from './config.mjs';

export function getLedgerStatus() {
  return getCantonStatus();
}

export async function submitCommand(commandBody) {
  const config = assertCantonConfigured();
  const url = `${config.jsonApiUrl}/v2/commands/submit-and-wait-for-transaction`;

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(commandBody),
  });

  const rawText = await response.text();
  const parsed = parseMaybeJson(rawText);

  if (!response.ok) {
    const error = new Error(formatLedgerError(response.status, parsed, rawText));
    error.statusCode = 502;
    error.ledgerResponse = parsed || rawText;
    throw error;
  }

  return normalizeLedgerResult(parsed, rawText);
}

function buildHeaders(config) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (config.authToken) headers.Authorization = `Bearer ${config.authToken}`;
  if (config.apiKey) headers['x-api-key'] = config.apiKey;

  return headers;
}

function parseMaybeJson(rawText) {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}

function formatLedgerError(status, parsed, rawText) {
  if (parsed?.cause) return `Canton JSON API rejected command (${status}): ${parsed.cause}`;
  if (parsed?.message) return `Canton JSON API rejected command (${status}): ${parsed.message}`;
  if (rawText) return `Canton JSON API rejected command (${status}): ${rawText.slice(0, 500)}`;
  return `Canton JSON API rejected command with HTTP ${status}`;
}

function normalizeLedgerResult(parsed, rawText) {
  const updateId = findFirstKey(parsed, 'updateId');
  const completionOffset = findFirstKey(parsed, 'completionOffset');
  const contractId = findCreatedContractId(parsed);

  return {
    raw: parsed || rawText,
    updateId,
    completionOffset: completionOffset === undefined || completionOffset === null ? null : String(completionOffset),
    contractId,
  };
}

function findFirstKey(value, key) {
  if (!value || typeof value !== 'object') return null;
  if (Object.prototype.hasOwnProperty.call(value, key)) return value[key];

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstKey(item, key);
      if (found !== null && found !== undefined) return found;
    }
    return null;
  }

  for (const item of Object.values(value)) {
    const found = findFirstKey(item, key);
    if (found !== null && found !== undefined) return found;
  }

  return null;
}

function findCreatedContractId(value) {
  const createdEvents = [];
  collectCreatedEvents(value, createdEvents);
  const createdEvent = createdEvents.find(event => event.contractId) || null;
  return createdEvent?.contractId || findFirstKey(value, 'contractId');
}

function collectCreatedEvents(value, createdEvents) {
  if (!value || typeof value !== 'object') return;

  if (value.createdEvent && typeof value.createdEvent === 'object') {
    createdEvents.push(value.createdEvent);
  }

  if (Array.isArray(value)) {
    for (const item of value) collectCreatedEvents(item, createdEvents);
    return;
  }

  for (const item of Object.values(value)) collectCreatedEvents(item, createdEvents);
}
