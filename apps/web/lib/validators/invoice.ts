import type { Invoice } from "@/types/invoice";

export function validateInvoiceForm(input: {
  reference: string;
  amount: string;
  description: string;
  expiresAt: string;
}): string[] {
  const errors: string[] = [];

  if (!input.reference.trim()) {
    errors.push("Reference is required.");
  }

  const amount = Number(input.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be greater than zero.");
  }

  if (!input.description.trim()) {
    errors.push("Description is required.");
  }

  if (!input.expiresAt) {
    errors.push("Expiry is required.");
  }

  return errors;
}

export function getInvoiceStatus(invoice: Invoice): Invoice["status"] {
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return invoice.status;
  }

  const expiryTime = new Date(invoice.expiresAt).getTime();
  const now = Date.now();

  if (Number.isFinite(expiryTime) && now > expiryTime) {
    return "EXPIRED";
  }

  return "OPEN";
}