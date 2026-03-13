const INVOICE_STORAGE_KEY = "glide:invoices";

export interface StoredInvoice {
  invoiceId: string;
  merchantId: string;
  reference: string;
  amount: string;
  settlementAsset: "sBTC" | "USDCx";
  description: string;
  expiresAt: string;
  status: "DRAFT" | "OPEN" | "PAID" | "EXPIRED" | "CANCELLED";
  createdAt: string;
}

export function loadInvoices(): StoredInvoice[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(INVOICE_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredInvoice[];
  } catch {
    return [];
  }
}

export function saveInvoices(invoices: StoredInvoice[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
}