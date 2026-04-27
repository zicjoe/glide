import { randomUUID } from 'node:crypto';

const statusToDamlStatus = {
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  PAYMENT_PENDING: 'PaymentPending',
  PAYMENT_CONFIRMED: 'PaymentConfirmed',
  SETTLEMENT_PENDING: 'SettlementPending',
  SETTLED: 'Settled',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

export const cantonActionMap = {
  'confirm-payment': {
    choice: 'ConfirmPayment',
    newStatus: 'PAYMENT_CONFIRMED',
    action: 'Payment Confirmed',
    actorRole: 'PAYER',
    actAs: invoice => invoice.payer_party_id,
  },
  'route-settlement': {
    choice: 'RouteSettlement',
    newStatus: 'SETTLEMENT_PENDING',
    action: 'Settlement Routed',
    actorRole: 'SETTLEMENT_OPERATOR',
    actAs: (_invoice, config) => config.settlementOperatorParty,
  },
  'mark-settled': {
    choice: 'MarkSettled',
    newStatus: 'SETTLED',
    action: 'Settlement Confirmed',
    actorRole: 'SETTLEMENT_OPERATOR',
    actAs: (_invoice, config) => config.settlementOperatorParty,
  },
  'mark-fulfilled': {
    choice: 'MarkFulfilled',
    newStatus: 'FULFILLED',
    action: 'Fulfillment Confirmed',
    actorRole: 'BUSINESS',
    actAs: (_invoice, config) => config.businessParty,
  },
  cancel: {
    choice: 'CancelInvoice',
    newStatus: 'CANCELLED',
    action: 'Invoice Cancelled',
    actorRole: 'BUSINESS',
    actAs: (_invoice, config) => config.businessParty,
  },
  dispute: {
    choice: 'DisputeInvoice',
    newStatus: 'DISPUTED',
    action: 'Invoice Disputed',
    actorRole: 'PAYER',
    actAs: invoice => invoice.payer_party_id,
  },
};

export function buildCreateInvoiceCommand(invoice, config) {
  const commandId = buildCommandId(invoice.id, 'create');
  const workflowId = `glide-${invoice.id}`;

  return {
    commandId,
    workflowId,
    body: withOptionalUserId({
      userId: config.userId,
      actAs: [config.businessParty],
      readAs: readAsParties(invoice, config),
      commandId,
      workflowId,
      commands: [
        {
          CreateCommand: {
            templateId: config.templateId,
            createArguments: {
              invoiceId: invoice.id,
              business: config.businessParty,
              payer: invoice.payer_party_id,
              settlementOperator: config.settlementOperatorParty,
              auditObserver: invoice.observer_party_id,
              title: invoice.title,
              customerName: invoice.customer_name,
              amount: decimal(invoice.amount),
              asset: invoice.asset,
              settlementDestination: invoice.settlement_destination,
              dueDate: toDamlTime(invoice.due_date),
              description: invoice.description || '',
              status: statusToDamlStatus[invoice.status] || 'PaymentPending',
              auditTrail: [],
            },
          },
        },
      ],
    }),
  };
}

export function buildExerciseInvoiceCommand(invoice, config, actionKey) {
  const action = cantonActionMap[actionKey];

  if (!action) {
    const error = new Error(`Unsupported Canton workflow action: ${actionKey}`);
    error.statusCode = 400;
    throw error;
  }

  if (!invoice.canton_contract_id) {
    const error = new Error(`Invoice ${invoice.id} has no Canton contract id yet. Submit it to Canton first.`);
    error.statusCode = 400;
    throw error;
  }

  const actAs = action.actAs(invoice, config);
  const commandId = buildCommandId(invoice.id, actionKey);
  const workflowId = invoice.canton_workflow_id || `glide-${invoice.id}`;

  return {
    commandId,
    workflowId,
    choice: action.choice,
    newStatus: action.newStatus,
    action: action.action,
    actorRole: action.actorRole,
    body: withOptionalUserId({
      userId: config.userId,
      actAs: [actAs],
      readAs: readAsParties(invoice, config),
      commandId,
      workflowId,
      commands: [
        {
          ExerciseCommand: {
            templateId: invoice.canton_template_id || config.templateId,
            contractId: invoice.canton_contract_id,
            choice: action.choice,
            choiceArgument: {},
          },
        },
      ],
    }),
  };
}

function readAsParties(invoice, config) {
  return uniqueNonEmpty([
    config.businessParty,
    invoice.payer_party_id,
    config.settlementOperatorParty,
    invoice.observer_party_id,
  ]);
}

function buildCommandId(invoiceId, action) {
  return `glide-${invoiceId}-${action}-${randomUUID()}`.replace(/[^A-Za-z0-9._:-]/g, '-');
}

function decimal(value) {
  return Number(value).toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
}

function toDamlTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function uniqueNonEmpty(values) {
  return [...new Set(values.filter(Boolean))];
}

function withOptionalUserId(body) {
  if (!body.userId) {
    const { userId, ...rest } = body;
    return rest;
  }
  return body;
}
