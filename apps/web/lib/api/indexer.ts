const INDEXER_BASE_URL =
  process.env.NEXT_PUBLIC_INDEXER_API_URL || "http://localhost:4010";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${INDEXER_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Indexer request failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export type IndexedMerchantResponse = {
  merchant: {
    merchant_id: number;
    owner: string;
    active: boolean;
    created_at: number;
    updated_at: number;
  } | null;
};

export type IndexedTreasuryResponse = {
  policy: {
    merchant_id: number;
    settlement_asset: number;
    auto_split: boolean;
    idle_yield: boolean;
    yield_threshold: number;
    updated_at: number;
  } | null;
  destinations: Array<{
    merchant_id: number;
    destination_id: number;
    label: string;
    asset: number;
    destination: string;
    destination_type: number;
    enabled: boolean;
    created_at: number;
  }>;
  buckets: Array<{
    merchant_id: number;
    bucket_id: number;
    name: string;
    allocation_bps: number;
    destination_id: number;
    idle_mode: number;
    enabled: boolean;
    created_at: number;
  }>;
};

export async function getIndexedMerchant(owner: string) {
  return apiGet<IndexedMerchantResponse>(
    `/api/merchant/${encodeURIComponent(owner)}`
  );
}

export async function getIndexedTreasury(merchantId: number) {
  return apiGet<IndexedTreasuryResponse>(`/api/treasury/${merchantId}`);
}

export type IndexedInvoiceRow = {
    invoice_id: number;
    merchant_id: number;
    reference: string;
    asset: number;
    amount: number;
    description: string;
    expiry_at: number;
    status: number;
    created_at: number;
    paid_at: number;
    settlement_id: number | null;
  };
  
  export type IndexedInvoicesResponse = {
    invoices: IndexedInvoiceRow[];
  };
  
  export async function getIndexedInvoices(merchantId: number) {
    return apiGet<IndexedInvoicesResponse>(
      `/api/invoices?merchantId=${merchantId}`
    );
  }
  export type IndexedInvoiceCheckoutResponse = {
    invoice: {
      invoice_id: number;
      merchant_id: number;
      reference: string;
      asset: number;
      amount: number;
      description: string;
      expiry_at: number;
      status: number;
      created_at: number;
      paid_at: number;
      settlement_id: number | null;
    } | null;
    policy: {
      merchant_id: number;
      settlement_asset: number;
      auto_split: boolean;
      idle_yield: boolean;
      yield_threshold: number;
      updated_at: number;
    } | null;
    paymentDestination: {
      merchant_id: number;
      destination_id: number;
      label: string;
      asset: number;
      destination: string;
      destination_type: number;
      enabled: boolean;
      created_at: number;
    } | null;
    paymentStatus: {
        invoice_id: number;
        merchant_id: number;
        payment_status: string;
        observed_amount: number | null;
        observed_asset: number | null;
        observed_txid: string | null;
        observed_at: number | null;
        confirmed_at: number | null;
        updated_at: number;
      } | null;
  };
  
  export async function getIndexedInvoiceByReference(reference: string) {
    return apiGet<IndexedInvoiceCheckoutResponse>(
      `/api/invoice-by-reference/${encodeURIComponent(reference)}`
    );
  }

  export type IndexedSettlementRow = {
    settlement_id: number;
    merchant_id: number;
    invoice_id: number;
    asset: number;
    gross_amount: number;
    fee_amount: number;
    net_amount: number;
    status: number;
    created_at: number;
    completed_at: number;
    executor: string;
  };
  
  export type IndexedSettlementAllocationRow = {
    settlement_id: number;
    bucket_id: number;
    allocation_bps: number;
    amount: number;
    destination_id: number;
  };
  
  export type IndexedSettlementsResponse = {
    settlements: IndexedSettlementRow[];
    allocations: IndexedSettlementAllocationRow[];
  };
  
  export async function getIndexedSettlements(merchantId: number) {
    return apiGet<IndexedSettlementsResponse>(
      `/api/settlements?merchantId=${merchantId}`
    );
  }

  export type IndexedActivityRow = {
    id: number;
    merchant_id: number | null;
    event_type: string;
    entity_type: string;
    entity_id: string;
    payload_json: any;
    created_at: number;
  };
  
  export type IndexedActivityResponse = {
    activities: IndexedActivityRow[];
  };
  
  export async function getIndexedActivity(merchantId: number, limit = 20) {
    return apiGet<IndexedActivityResponse>(
      `/api/activity?merchantId=${merchantId}&limit=${limit}`,
    );
  }
  