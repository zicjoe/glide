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

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${INDEXER_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Indexer request failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${INDEXER_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(body),
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
  destination_id: number | null;
  payment_destination: string;
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
    destination_id?: number | null;
    payment_destination?: string;
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
    destination_id: number | null;
    label: string;
    asset: number;
    destination: string;
    destination_type: number | null;
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
  checkout: {
    settlementAsset: number;
    settlementAssetLabel: string;
    settlementAmount: number;
    quoteSource: {
      btcUsd: number;
      usdcUsd: number;
      usdcxUsd: number;
      sbtcBtc: number;
      mode: string;
    } | null;
    defaultRail: string | null;
    rails: Array<{
      rail: string;
      label: string;
      assetLabel: string;
      amount: number;
      normalizedAsset: number;
      normalizedAmount: number;
      customerStatusLabel: string;
      cashbackEligible: boolean;
      cashbackBps: number;
      cashbackAmount: number;
      routeType: string;
      visibleMessage: string;
      address: string | null;
      addressLabel: string;
    }>;
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

export type IndexedYieldStrategyRow = {
  strategy_id: number;
  name: string;
  asset: number;
  risk_level: number;
  active: boolean;
  created_at: number;
  updated_at: number;
};

export type IndexedYieldQueueRow = {
  queue_id: number;
  merchant_id: number;
  bucket_id: number;
  asset: number;
  amount: number;
  strategy_id: number;
  status: number;
  created_at: number;
  executor: string;
};

export type IndexedYieldPositionRow = {
  position_id: number;
  merchant_id: number;
  bucket_id: number;
  asset: number;
  amount: number;
  strategy_id: number;
  status: number;
  queued_id: number;
  deployed_at: number;
  withdrawn_at: number;
  executor: string;
};

export type IndexedVaultBalanceRow = {
  merchant_id: number;
  bucket_id: number;
  asset: number;
  available: number;
  queued: number;
  deployed: number;
  updated_at: number;
};

export type IndexedYieldResponse = {
  strategies: IndexedYieldStrategyRow[];
  queueItems: IndexedYieldQueueRow[];
  positions: IndexedYieldPositionRow[];
  balances: IndexedVaultBalanceRow[];
};

export async function getIndexedYield(merchantId: number) {
  return apiGet<IndexedYieldResponse>(`/api/yield?merchantId=${merchantId}`);
}

export type IndexedRefundRow = {
  refund_id: string;
  merchant_id: number;
  invoice_id: number | null;
  settlement_id: number | null;
  asset: number;
  amount: number;
  destination: string;
  reason: string;
  status: string;
  requested_by: string | null;
  created_at: number;
  updated_at: number;
};

export type IndexedRefundsResponse = {
  refunds: IndexedRefundRow[];
};

export async function getIndexedRefunds(merchantId: number) {
  return apiGet<IndexedRefundsResponse>(`/api/refunds?merchantId=${merchantId}`);
}

export type IndexedMerchantRailsResponse = {
  rails: {
    owner: string;
    stacks_address: string | null;
    btc_address: string | null;
    usdc_address: string | null;
    usdcx_address: string | null;
    updated_at: number;
  } | null;
};

export async function getMerchantRails(owner: string) {
  return apiGet<IndexedMerchantRailsResponse>(
    `/api/merchant-rails/${encodeURIComponent(owner)}`
  );
}

export async function saveMerchantRails(args: {
  owner: string;
  stacksAddress: string | null;
  btcAddress: string | null;
  usdcAddress?: string | null;
  usdcxAddress?: string | null;
}) {
  return apiPost<IndexedMerchantRailsResponse>("/api/merchant-rails", {
    owner: args.owner,
    stacksAddress: args.stacksAddress,
    btcAddress: args.btcAddress ?? null,
    usdcAddress: args.usdcAddress ?? null,
    usdcxAddress: args.usdcxAddress ?? args.stacksAddress ?? null,
  });
}

export type IndexedConversionQuoteResponse = {
  quote: {
    fromAsset: string;
    toAsset: string;
    fromAmount: number;
    toAmount: number;
    rate: number;
    quotedAt: number;
    mode: string;
  };
};

export type IndexedConversionRow = {
  conversion_id: number;
  merchant_id: number;
  from_asset: string;
  to_asset: string;
  from_amount: number;
  to_amount: number;
  quote_rate: number;
  source_address: string | null;
  destination_address: string | null;
  txid: string | null;
  status: string;
  metadata_json: any;
  created_at: number;
  updated_at: number;
};

export type IndexedConversionsResponse = {
  conversions: IndexedConversionRow[];
};

export async function getConversionQuote(args: {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
}) {
  return apiPost<IndexedConversionQuoteResponse>("/api/conversions/quote", args);
}

export async function createConversionRecord(args: {
  merchantId: number;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  quoteRate: number;
  sourceAddress?: string | null;
  destinationAddress?: string | null;
  txid?: string | null;
  status?: string;
  metadata?: Record<string, unknown>;
}) {
  return apiPost<{ conversion: IndexedConversionRow }>("/api/conversions", args);
}

export async function updateConversionStatus(
  conversionId: number,
  args: {
    status: string;
    txid?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  return apiPatch<{ conversion: IndexedConversionRow }>(
    `/api/conversions/${conversionId}/status`,
    args,
  );
}

export async function getConversions(merchantId: number) {
  return apiGet<IndexedConversionsResponse>(
    `/api/conversions?merchantId=${merchantId}`,
  );
}