import http from 'node:http';
import {
  applyInvoiceAction,
  createInvoice,
  getDashboardMetrics,
  getInvoice,
  getSystemStatus,
  listAuditEvents,
  listInvoices,
  readState,
  resetState,
  writeState,
} from './lib/workflowStore.mjs';
import {
  exerciseInvoiceWorkflow,
  getRealCantonStatus,
  submitInvoiceWorkflow,
} from './lib/cantonWorkflowService.mjs';

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(async (req, res) => {
  try {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      return sendJson(res, 204, null);
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, {
        ok: true,
        service: 'glide-api',
        environment: 'DevNet',
        timestamp: new Date().toISOString(),
      });
    }

    if (req.method === 'GET' && pathname === '/api/system/status') {
      return sendJson(res, 200, getSystemStatus());
    }

    if (req.method === 'GET' && pathname === '/api/canton/status') {
      return sendJson(res, 200, getRealCantonStatus());
    }

    if (req.method === 'GET' && pathname === '/api/dashboard/metrics') {
      const state = await readState();
      return sendJson(res, 200, getDashboardMetrics(state));
    }

    if (req.method === 'GET' && pathname === '/api/invoices') {
      const state = await readState();
      return sendJson(res, 200, listInvoices(state));
    }

    if (req.method === 'POST' && pathname === '/api/invoices') {
      const body = await readJsonBody(req);
      const state = await readState();
      const invoice = createInvoice(state, body);
      await writeState(state);
      return sendJson(res, 201, invoice);
    }

    if (req.method === 'POST' && pathname === '/api/demo/reset') {
      await resetState();
      return sendJson(res, 200, { ok: true });
    }

    const invoiceRoute = pathname.match(/^\/api\/invoices\/([^/]+)(?:\/([^/]+))?$/);

    if (invoiceRoute) {
      const [, invoiceId, action] = invoiceRoute;
      const state = await readState();

      if (req.method === 'GET' && !action) {
        const invoice = getInvoice(state, invoiceId);
        if (!invoice) return sendJson(res, 404, { message: `Invoice ${invoiceId} not found` });
        return sendJson(res, 200, invoice);
      }

      if (req.method === 'GET' && action === 'audit') {
        return sendJson(res, 200, listAuditEvents(state, invoiceId));
      }

      if (req.method === 'POST' && action === 'canton-submit') {
        const invoice = await submitInvoiceWorkflow(invoiceId);
        return sendJson(res, 200, invoice);
      }

      const cantonAction = action?.match(/^canton-(confirm-payment|route-settlement|mark-settled|mark-fulfilled|cancel|dispute)$/)?.[1];

      if (req.method === 'POST' && cantonAction) {
        const invoice = await exerciseInvoiceWorkflow(invoiceId, cantonAction);
        return sendJson(res, 200, invoice);
      }

      if (req.method === 'POST' && action) {
        const invoice = applyInvoiceAction(state, invoiceId, action);
        await writeState(state);
        return sendJson(res, 200, invoice);
      }
    }

    return sendJson(res, 404, { message: `Route not found: ${req.method} ${pathname}` });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return sendJson(res, statusCode, {
      message: error.message || 'Internal server error',
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Glide API listening on http://${HOST}:${PORT}`);
});

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');

  if (statusCode === 204) {
    return res.end();
  }

  return res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    const error = new Error('Request body must be valid JSON');
    error.statusCode = 400;
    throw error;
  }
}
