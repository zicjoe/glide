"use client";

import { useState } from "react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";

export function useInvoicesPageSession() {
  const merchantSession = useMerchantSession();
  const invoicesQuery = useIndexedInvoices(merchantSession.merchantId);

  const [refreshing, setRefreshing] = useState(false);

  async function refreshInvoices() {
    try {
      setRefreshing(true);
      await invoicesQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  async function refreshAfterWrite(delayMs = 5000) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await refreshInvoices();
  }

  return {
    ...merchantSession,
    invoices: invoicesQuery.invoices,
    invoicesLoading: invoicesQuery.loading,
    invoicesError: invoicesQuery.error,
    refreshInvoices,
    refreshAfterWrite,
    refreshing,
  };
}
