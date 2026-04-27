import type { Invoice, InvoiceStatus, UserRole } from './types';

export type WorkflowActionKey =
  | 'confirmPayment'
  | 'routeSettlement'
  | 'markSettled'
  | 'markFulfilled'
  | 'cancelInvoice'
  | 'disputeInvoice';

export interface WorkflowActionDefinition {
  key: WorkflowActionKey;
  label: string;
  actionLabel: string;
  nextStatus: InvoiceStatus;
  actorRole: UserRole;
  destructive?: boolean;
  confirmMessage?: string;
}

export const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
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

export const workflowActions: Record<WorkflowActionKey, WorkflowActionDefinition> = {
  confirmPayment: {
    key: 'confirmPayment',
    label: 'Confirm Payment',
    actionLabel: 'Payment Confirmed',
    nextStatus: 'PAYMENT_CONFIRMED',
    actorRole: 'PAYER',
  },
  routeSettlement: {
    key: 'routeSettlement',
    label: 'Route Settlement',
    actionLabel: 'Settlement Routed',
    nextStatus: 'SETTLEMENT_PENDING',
    actorRole: 'SETTLEMENT_OPERATOR',
  },
  markSettled: {
    key: 'markSettled',
    label: 'Mark Settled',
    actionLabel: 'Settlement Confirmed',
    nextStatus: 'SETTLED',
    actorRole: 'SETTLEMENT_OPERATOR',
  },
  markFulfilled: {
    key: 'markFulfilled',
    label: 'Mark Fulfilled',
    actionLabel: 'Fulfillment Confirmed',
    nextStatus: 'FULFILLED',
    actorRole: 'BUSINESS',
  },
  cancelInvoice: {
    key: 'cancelInvoice',
    label: 'Cancel Invoice',
    actionLabel: 'Invoice Cancelled',
    nextStatus: 'CANCELLED',
    actorRole: 'BUSINESS',
    destructive: true,
    confirmMessage: 'Are you sure you want to cancel this invoice?',
  },
  disputeInvoice: {
    key: 'disputeInvoice',
    label: 'Dispute Invoice',
    actionLabel: 'Invoice Disputed',
    nextStatus: 'DISPUTED',
    actorRole: 'PAYER',
    destructive: true,
    confirmMessage: 'Are you sure you want to dispute this invoice?',
  },
};

const terminalStatuses: InvoiceStatus[] = ['FULFILLED', 'CANCELLED', 'DISPUTED'];

export function getAllowedNextStatuses(status: InvoiceStatus): InvoiceStatus[] {
  return allowedTransitions[status] || [];
}

export function canTransition(currentStatus: InvoiceStatus, nextStatus: InvoiceStatus): boolean {
  return getAllowedNextStatuses(currentStatus).includes(nextStatus);
}

export function assertValidTransition(currentStatus: InvoiceStatus, nextStatus: InvoiceStatus, invoiceId?: string) {
  if (!canTransition(currentStatus, nextStatus)) {
    const target = invoiceId ? `invoice ${invoiceId}` : 'invoice';
    throw new Error(`Cannot move ${target} from ${currentStatus} to ${nextStatus}`);
  }
}

export function assertRoleCanPerformAction(actionKey: WorkflowActionKey, currentRole: UserRole) {
  const action = workflowActions[actionKey];

  if (action.actorRole !== currentRole) {
    throw new Error(`${currentRole.replace(/_/g, ' ')} cannot perform ${action.label}. Required role: ${action.actorRole.replace(/_/g, ' ')}.`);
  }
}

export function getWorkflowActionForStatus(status: InvoiceStatus): WorkflowActionDefinition | null {
  if (status === 'ISSUED' || status === 'PAYMENT_PENDING') return workflowActions.confirmPayment;
  if (status === 'PAYMENT_CONFIRMED') return workflowActions.routeSettlement;
  if (status === 'SETTLEMENT_PENDING') return workflowActions.markSettled;
  if (status === 'SETTLED') return workflowActions.markFulfilled;
  return null;
}

export function getAvailableWorkflowActions(invoice: Invoice, currentRole: UserRole): WorkflowActionDefinition[] {
  if (terminalStatuses.includes(invoice.status)) return [];

  const primaryAction = getWorkflowActionForStatus(invoice.status);
  const possibleActions = [primaryAction, workflowActions.cancelInvoice, workflowActions.disputeInvoice]
    .filter(Boolean) as WorkflowActionDefinition[];

  return possibleActions.filter((action) =>
    action.actorRole === currentRole && canTransition(invoice.status, action.nextStatus)
  );
}

export function getBlockedWorkflowActions(invoice: Invoice, currentRole: UserRole): WorkflowActionDefinition[] {
  if (terminalStatuses.includes(invoice.status)) return [];

  const primaryAction = getWorkflowActionForStatus(invoice.status);
  const possibleActions = [primaryAction, workflowActions.cancelInvoice, workflowActions.disputeInvoice]
    .filter(Boolean) as WorkflowActionDefinition[];

  return possibleActions.filter((action) =>
    action.actorRole !== currentRole && canTransition(invoice.status, action.nextStatus)
  );
}

export function getRoleDescription(role: UserRole) {
  const descriptions: Record<UserRole, string> = {
    BUSINESS: 'Creates invoices, cancels open invoices, and confirms fulfillment after settlement.',
    PAYER: 'Confirms payment and can raise a dispute before settlement is completed.',
    SETTLEMENT_OPERATOR: 'Routes payment-confirmed invoices and marks settlement complete.',
    OBSERVER: 'Can inspect invoice state and audit history but cannot change workflow state.',
  };

  return descriptions[role];
}
