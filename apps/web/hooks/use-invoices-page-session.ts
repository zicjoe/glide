"use client";

import { useState } from "react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";

export function useInvoicesPageSession() {
  const merchantSession = useMerchantSession();
  const invoicesQuery = useIndexedInvoices(merchantSession.merchantId);
  const settlementsQuery = useIndexedSettlements(merchantSession.merchantId);

  const [refreshing, setRefreshing] = useState(false);

  async function refreshAll() {
    try {
      setRefreshing(true);
      await invoicesQuery.refetch();
      await settlementsQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  async function refreshAfterWrite(delayMs = 5000) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await refreshAll();
  }

  return {
    ...merchantSession,
    invoices: invoicesQuery.invoices,
    invoicesLoading: invoicesQuery.loading,
    invoicesError: invoicesQuery.error,
    settlements: settlementsQuery.settlements,
    settlementAllocations: settlementsQuery.allocations,
    settlementsLoading: settlementsQuery.loading,
    settlementsError: settlementsQuery.error,
    refreshAll,
    refreshAfterWrite,
    refreshing,
  };
}