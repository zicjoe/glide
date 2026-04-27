// Canton ledger adapter boundary.
// This file intentionally does not submit to Canton yet.
// It gives the backend one place to map Glide app records into the Daml contract shape.

const assetMap = {
  CC: 'CC',
  USDCx: 'USDCx',
};

export function buildInvoiceWorkflowPayload(invoice) {
  const asset = assetMap[invoice.asset];

  if (!asset) {
    throw new Error(`Unsupported Canton asset: ${invoice.asset}`);
  }

  return {
    templateId: 'Glide.Workflow.InvoiceWorkflow:InvoiceWorkflow',
    payload: {
      invoiceId: invoice.id,
      business: invoice.businessParty || 'Business::GlideDemo',
      payer: invoice.payerPartyId,
      settlementOperator: invoice.settlementOperatorPartyId || 'SettlementOperator::GlideDemo',
      auditObserver: invoice.observerPartyId,
      title: invoice.title,
      customerName: invoice.customerName,
      amount: String(invoice.amount),
      asset,
      settlementDestination: invoice.settlementDestination,
      dueDate: new Date(invoice.dueDate).toISOString(),
      description: invoice.description || '',
      status: 'Draft',
      auditTrail: [],
    },
  };
}

export function resolveChoiceForStatusAction(actionPath) {
  const choices = {
    'confirm-payment': 'ConfirmPayment',
    'route-settlement': 'RouteSettlement',
    'mark-settled': 'MarkSettled',
    'mark-fulfilled': 'MarkFulfilled',
    cancel: 'CancelInvoice',
    dispute: 'DisputeInvoice',
  };

  return choices[actionPath] || null;
}
