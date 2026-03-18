"use client";

import { useEffect, useState } from "react";
import { getIndexedActivity } from "@/lib/api/indexer";

export type IndexedActivity = {
  id: number;
  merchantId: number | null;
  eventType: string;
  entityType: string;
  entityId: string;
  payload: any;
  createdAt: number;
};

type UseIndexedActivityResult = {
  activities: IndexedActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapActivity(row: any): IndexedActivity {
  return {
    id: Number(row.id),
    merchantId: row.merchant_id == null ? null : Number(row.merchant_id),
    eventType: String(row.event_type),
    entityType: String(row.entity_type),
    entityId: String(row.entity_id),
    payload: row.payload_json,
    createdAt: Number(row.created_at),
  };
}

export function useIndexedActivity(
  merchantId: number | null,
  limit = 20,
): UseIndexedActivityResult {
  const [activities, setActivities] = useState<IndexedActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setActivities([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedActivity(merchantId, limit);
      setActivities(result.activities.map(mapActivity));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId, limit]);

  return {
    activities,
    loading,
    error,
    refetch: load,
  };
}
