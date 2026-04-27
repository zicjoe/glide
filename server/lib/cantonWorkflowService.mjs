import { assertCantonConfigured, getCantonStatus } from '../canton/config.mjs';
import { buildCreateInvoiceCommand, buildExerciseInvoiceCommand, cantonActionMap } from '../canton/commands.mjs';
import { submitCommand } from '../canton/ledgerClient.mjs';
import {
  fetchInvoiceForBackend,
  insertCantonAuditEvent,
  markCantonFailure,
  updateInvoiceFromCanton,
} from './supabaseServer.mjs';

export function getRealCantonStatus() {
  return getCantonStatus();
}

export async function submitInvoiceWorkflow(invoiceId) {
  const config = assertCantonConfigured();
  const invoice = await fetchInvoiceForBackend(invoiceId);

  if (invoice.canton_contract_id) {
    const error = new Error(`Invoice ${invoiceId} already has Canton contract id ${invoice.canton_contract_id}`);
    error.statusCode = 409;
    throw error;
  }

  try {
    const command = buildCreateInvoiceCommand(invoice, config);
    await updateInvoiceFromCanton(invoiceId, {
      canton_sync_status: 'SUBMITTED',
      canton_command_id: command.commandId,
      canton_workflow_id: command.workflowId,
      canton_template_id: config.templateId,
      canton_submitted_at: new Date().toISOString(),
      canton_last_error: null,
    });

    const ledgerResult = await submitCommand(command.body);

    if (!ledgerResult.contractId) {
      throw new Error('Canton command succeeded but no created contract id was found in the transaction response. Inspect raw ledger response.');
    }

    const updated = await updateInvoiceFromCanton(invoiceId, {
      canton_sync_status: 'CONFIRMED',
      canton_contract_id: ledgerResult.contractId,
      canton_update_id: ledgerResult.updateId,
      canton_completion_offset: ledgerResult.completionOffset,
      canton_confirmed_at: new Date().toISOString(),
      canton_last_error: null,
    });

    await insertCantonAuditEvent(updated, {
      action: 'Canton Workflow Created',
      actorRole: 'BUSINESS',
      previousStatus: invoice.status,
      newStatus: invoice.status,
      referenceId: ledgerResult.updateId || ledgerResult.contractId,
      metadata: {
        cantonContractId: ledgerResult.contractId,
        cantonCommandId: command.commandId,
        cantonUpdateId: ledgerResult.updateId,
        cantonCompletionOffset: ledgerResult.completionOffset,
        templateId: config.templateId,
      },
    });

    return updated;
  } catch (error) {
    await markCantonFailure(invoiceId, error.message || 'Canton workflow submission failed');
    throw error;
  }
}

export async function exerciseInvoiceWorkflow(invoiceId, actionKey) {
  const config = assertCantonConfigured();
  const invoice = await fetchInvoiceForBackend(invoiceId);
  const action = cantonActionMap[actionKey];

  if (!action) {
    const error = new Error(`Unsupported Canton workflow action: ${actionKey}`);
    error.statusCode = 400;
    throw error;
  }

  try {
    const command = buildExerciseInvoiceCommand(invoice, config, actionKey);
    await updateInvoiceFromCanton(invoiceId, {
      canton_sync_status: 'SUBMITTED',
      canton_command_id: command.commandId,
      canton_submitted_at: new Date().toISOString(),
      canton_last_error: null,
    });

    const ledgerResult = await submitCommand(command.body);

    if (!ledgerResult.contractId) {
      throw new Error('Canton choice exercise succeeded but no replacement contract id was found in the transaction response. Inspect raw ledger response.');
    }

    const updated = await updateInvoiceFromCanton(invoiceId, {
      status: action.newStatus,
      canton_sync_status: 'CONFIRMED',
      canton_contract_id: ledgerResult.contractId,
      canton_update_id: ledgerResult.updateId,
      canton_completion_offset: ledgerResult.completionOffset,
      canton_confirmed_at: new Date().toISOString(),
      canton_last_error: null,
    });

    await insertCantonAuditEvent(updated, {
      action: action.action,
      actorRole: action.actorRole,
      previousStatus: invoice.status,
      newStatus: action.newStatus,
      referenceId: ledgerResult.updateId || ledgerResult.contractId,
      metadata: {
        cantonChoice: command.choice,
        cantonContractId: ledgerResult.contractId,
        cantonCommandId: command.commandId,
        cantonUpdateId: ledgerResult.updateId,
        cantonCompletionOffset: ledgerResult.completionOffset,
        templateId: config.templateId,
      },
    });

    return updated;
  } catch (error) {
    await markCantonFailure(invoiceId, error.message || 'Canton workflow action failed');
    throw error;
  }
}
