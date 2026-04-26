import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), '.glide-data');
const STATE_FILE = path.join(DATA_DIR, 'workflow-state.json');

const seedInvoices = [
  {
    id: 'INV-001',
    title: 'Q1 Consulting Services',
    customerName: 'Acme Corp',
    payerPartyId: 'PARTY-ACME-001',
    observerPartyId: 'PARTY-OBS-001',
    amount: 50000,
    asset: 'USDCx',
    settlementDestination: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    dueDate: '2026-05-15',
    description: 'Professional consulting services for Q1 2026',
    status: 'PAYMENT_CONFIRMED',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-20T14:30:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-001',
  },
  {
    id: 'INV-002',
    title: 'Software License Annual Renewal',
    customerName: 'TechStart Inc',
    payerPartyId: 'PARTY-TECH-002',
    observerPartyId: 'PARTY-OBS-002',
    amount: 25000,
    asset: 'CC',
    settlementDestination: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    dueDate: '2026-05-01',
    description: 'Annual software license renewal for enterprise platform',
    status: 'SETTLEMENT_PENDING',
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-22T11:00:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-002',
  },
  {
    id: 'INV-003',
    title: 'Hardware Equipment Purchase',
    customerName: 'BuildRight LLC',
    payerPartyId: 'PARTY-BUILD-003',
    observerPartyId: 'PARTY-OBS-001',
    amount: 75000,
    asset: 'USDCx',
    settlementDestination: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    dueDate: '2026-04-30',
    description: 'Server hardware and networking equipment',
    status: 'PAYMENT_PENDING',
    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-04-23T10:00:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-003',
  },
  {
    id: 'INV-004',
    title: 'Marketing Services Package',
    customerName: 'GrowthHub Co',
    payerPartyId: 'PARTY-GROWTH-004',
    observerPartyId: 'PARTY-OBS-002',
    amount: 15000,
    asset: 'CC',
    settlementDestination: '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g',
    dueDate: '2026-06-01',
    description: 'Comprehensive digital marketing campaign',
    status: 'SETTLED',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-04-18T16:00:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-004',
  },
  {
    id: 'INV-005',
    title: 'Cloud Infrastructure Q2',
    customerName: 'DataFlow Systems',
    payerPartyId: 'PARTY-DATA-005',
    observerPartyId: 'PARTY-OBS-001',
    amount: 42000,
    asset: 'USDCx',
    settlementDestination: '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    dueDate: '2026-05-20',
    description: 'Cloud hosting and infrastructure services',
    status: 'FULFILLED',
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-04-25T09:00:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-005',
  },
  {
    id: 'INV-006',
    title: 'Training Workshop Series',
    customerName: 'SkillBoost Academy',
    payerPartyId: 'PARTY-SKILL-006',
    observerPartyId: 'PARTY-OBS-002',
    amount: 8500,
    asset: 'CC',
    settlementDestination: '0xf1e2d3c4b5a6978685746352413021908776655',
    dueDate: '2026-05-10',
    description: 'Employee training and development workshops',
    status: 'ISSUED',
    createdAt: '2026-04-18T13:00:00Z',
    updatedAt: '2026-04-18T13:00:00Z',
    businessId: 'BIZ-001',
    cantonReference: 'CANTON-REF-006',
  },
];

const seedAuditEvents = {
  'INV-001': [
    {
      id: 'AUD-001-1',
      invoiceId: 'INV-001',
      action: 'Invoice Created',
      actorRole: 'BUSINESS',
      timestamp: '2026-04-01T10:00:00Z',
      newStatus: 'DRAFT',
      asset: 'USDCx',
      amount: 50000,
      referenceId: 'CANTON-REF-001',
    },
    {
      id: 'AUD-001-2',
      invoiceId: 'INV-001',
      action: 'Invoice Issued',
      actorRole: 'BUSINESS',
      timestamp: '2026-04-02T11:00:00Z',
      previousStatus: 'DRAFT',
      newStatus: 'ISSUED',
      asset: 'USDCx',
      amount: 50000,
      referenceId: 'CANTON-REF-001',
    },
    {
      id: 'AUD-001-3',
      invoiceId: 'INV-001',
      action: 'Payment Pending',
      actorRole: 'PAYER',
      timestamp: '2026-04-15T09:30:00Z',
      previousStatus: 'ISSUED',
      newStatus: 'PAYMENT_PENDING',
      asset: 'USDCx',
      amount: 50000,
      referenceId: 'CANTON-REF-001',
    },
    {
      id: 'AUD-001-4',
      invoiceId: 'INV-001',
      action: 'Payment Confirmed',
      actorRole: 'PAYER',
      timestamp: '2026-04-20T14:30:00Z',
      previousStatus: 'PAYMENT_PENDING',
      newStatus: 'PAYMENT_CONFIRMED',
      asset: 'USDCx',
      amount: 50000,
      referenceId: 'CANTON-REF-001',
    },
  ],
};

const allowedTransitions = {
  DRAFT: ['ISSUED', 'CANCELLED', 'DISPUTED'],
  ISSUED: ['PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED'],
  PAYMENT_PENDING: ['PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED'],
  PAYMENT_CONFIRMED: ['SETTLEMENT_PENDING', 'CANCELLED', 'DISPUTED'],
  SETTLEMENT_PENDING: ['SETTLED', 'DISPUTED'],
  SETTLED: ['FULFILLED', 'DISPUTED'],
  FULFILLED: [],
  CANCELLED: [],
  DISPUTED: [],
};

const actionMap = {
  'confirm-payment': {
    newStatus: 'PAYMENT_CONFIRMED',
    action: 'Payment Confirmed',
    actorRole: 'PAYER',
  },
  'route-settlement': {
    newStatus: 'SETTLEMENT_PENDING',
    action: 'Settlement Routed',
    actorRole: 'SETTLEMENT_OPERATOR',
  },
  'mark-settled': {
    newStatus: 'SETTLED',
    action: 'Settlement Confirmed',
    actorRole: 'SETTLEMENT_OPERATOR',
  },
  'mark-fulfilled': {
    newStatus: 'FULFILLED',
    action: 'Fulfillment Confirmed',
    actorRole: 'BUSINESS',
  },
  cancel: {
    newStatus: 'CANCELLED',
    action: 'Invoice Cancelled',
    actorRole: 'BUSINESS',
  },
  dispute: {
    newStatus: 'DISPUTED',
    action: 'Invoice Disputed',
    actorRole: 'PAYER',
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialState() {
  return {
    invoices: clone(seedInvoices),
    auditEvents: clone(seedAuditEvents),
  };
}

function validateState(state) {
  return state && Array.isArray(state.invoices) && state.auditEvents && typeof state.auditEvents === 'object';
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readState() {
  await ensureDataDir();

  try {
    const raw = await readFile(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    if (!validateState(parsed)) {
      throw new Error('Invalid Glide workflow state file');
    }

    return parsed;
  } catch {
    const initialState = createInitialState();
    await writeState(initialState);
    return initialState;
  }
}

export async function writeState(state) {
  await ensureDataDir();
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function resetState() {
  const initialState = createInitialState();
  await writeState(initialState);
  return initialState;
}

export function getSystemStatus() {
  return {
    api: 'online',
    canton: 'online',
    environment: 'DevNet',
    supportedAssets: ['CC', 'USDCx'],
    lastChecked: new Date().toISOString(),
  };
}

export function getDashboardMetrics(state) {
  const awaitingPayment = state.invoices.filter(
    invoice => invoice.status === 'ISSUED' || invoice.status === 'PAYMENT_PENDING'
  ).length;

  return {
    totalInvoices: state.invoices.length,
    awaitingPayment,
    paymentConfirmed: state.invoices.filter(invoice => invoice.status === 'PAYMENT_CONFIRMED').length,
    settlementPending: state.invoices.filter(invoice => invoice.status === 'SETTLEMENT_PENDING').length,
    settled: state.invoices.filter(invoice => invoice.status === 'SETTLED').length,
    fulfilled: state.invoices.filter(invoice => invoice.status === 'FULFILLED').length,
    disputed: state.invoices.filter(invoice => invoice.status === 'DISPUTED').length,
    totalValueCC: state.invoices
      .filter(invoice => invoice.asset === 'CC')
      .reduce((total, invoice) => total + invoice.amount, 0),
    totalValueUSDCx: state.invoices
      .filter(invoice => invoice.asset === 'USDCx')
      .reduce((total, invoice) => total + invoice.amount, 0),
  };
}

export function listInvoices(state) {
  return [...state.invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInvoice(state, invoiceId) {
  return state.invoices.find(invoice => invoice.id === invoiceId) || null;
}

export function listAuditEvents(state, invoiceId) {
  return [...(state.auditEvents[invoiceId] || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function createInvoice(state, payload) {
  validateCreateInvoicePayload(payload);

  const now = new Date().toISOString();
  const nextInvoiceId = generateNextInvoiceId(state.invoices);
  const cantonReference = `CANTON-REF-${String(state.invoices.length + 1).padStart(3, '0')}`;

  const invoice = {
    id: nextInvoiceId,
    ...payload,
    amount: Number(payload.amount),
    status: 'PAYMENT_PENDING',
    createdAt: now,
    updatedAt: now,
    businessId: 'BIZ-001',
    cantonReference,
  };

  const auditEvents = [
    createAuditEvent({ invoice, action: 'Invoice Created', actorRole: 'BUSINESS', newStatus: 'DRAFT', sequence: 1 }),
    createAuditEvent({ invoice, action: 'Invoice Issued', actorRole: 'BUSINESS', previousStatus: 'DRAFT', newStatus: 'ISSUED', sequence: 2 }),
    createAuditEvent({ invoice, action: 'Payment Request Generated', actorRole: 'BUSINESS', previousStatus: 'ISSUED', newStatus: 'PAYMENT_PENDING', sequence: 3 }),
  ];

  state.invoices.push(invoice);
  state.auditEvents[invoice.id] = auditEvents;

  return invoice;
}

export function applyInvoiceAction(state, invoiceId, actionKey) {
  const action = actionMap[actionKey];

  if (!action) {
    const error = new Error(`Unknown invoice action: ${actionKey}`);
    error.statusCode = 404;
    throw error;
  }

  const invoiceIndex = state.invoices.findIndex(invoice => invoice.id === invoiceId);

  if (invoiceIndex === -1) {
    const error = new Error(`Invoice ${invoiceId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const invoice = state.invoices[invoiceIndex];
  assertValidTransition(invoice, action.newStatus);

  const updatedInvoice = {
    ...invoice,
    status: action.newStatus,
    updatedAt: new Date().toISOString(),
  };

  const existingAuditEvents = state.auditEvents[invoiceId] || [];
  const auditEvent = createAuditEvent({
    invoice: updatedInvoice,
    action: action.action,
    actorRole: action.actorRole,
    previousStatus: invoice.status,
    newStatus: action.newStatus,
    sequence: existingAuditEvents.length + 1,
  });

  state.invoices[invoiceIndex] = updatedInvoice;
  state.auditEvents[invoiceId] = [...existingAuditEvents, auditEvent];

  return updatedInvoice;
}

function validateCreateInvoicePayload(payload) {
  const requiredFields = [
    'title',
    'customerName',
    'payerPartyId',
    'observerPartyId',
    'amount',
    'asset',
    'settlementDestination',
    'dueDate',
    'description',
  ];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      const error = new Error(`Missing required field: ${field}`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (!['CC', 'USDCx'].includes(payload.asset)) {
    const error = new Error('Asset must be CC or USDCx');
    error.statusCode = 400;
    throw error;
  }

  const amount = Number(payload.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    const error = new Error('Amount must be a positive number');
    error.statusCode = 400;
    throw error;
  }
}

function assertValidTransition(invoice, newStatus) {
  const nextStatuses = allowedTransitions[invoice.status] || [];

  if (!nextStatuses.includes(newStatus)) {
    const error = new Error(`Cannot move invoice ${invoice.id} from ${invoice.status} to ${newStatus}`);
    error.statusCode = 409;
    throw error;
  }
}

function generateNextInvoiceId(invoices) {
  const highestId = invoices.reduce((highest, invoice) => {
    const match = invoice.id.match(/INV-(\d+)/);
    if (!match) return highest;
    return Math.max(highest, Number(match[1]));
  }, 0);

  return `INV-${String(highestId + 1).padStart(3, '0')}`;
}

function createAuditEvent({ invoice, action, actorRole, previousStatus, newStatus, sequence }) {
  return {
    id: `AUD-${invoice.id}-${sequence}`,
    invoiceId: invoice.id,
    action,
    actorRole,
    timestamp: new Date().toISOString(),
    previousStatus,
    newStatus,
    asset: invoice.asset,
    amount: invoice.amount,
    referenceId: invoice.cantonReference || '',
  };
}
