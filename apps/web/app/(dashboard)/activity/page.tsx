"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";
import { formatDateTime } from "@/lib/format/date";
import {
  loadNotificationEvents,
  type StoredNotificationEvent,
} from "@/lib/ops-storage";

export default function ActivityPage() {
  const [events, setEvents] = useState<StoredNotificationEvent[]>([]);

  useEffect(() => {
    setEvents(loadNotificationEvents());
  }, []);

  return (
    <div>
      <AppHeader
        title="Activity"
        description="Review invoice, payment, settlement, and refund events."
      />

      <div className="p-8">
        <SectionCard
          title="Event log"
          description="Operational events emitted across the Glide workflow."
        >
          {events.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
              No events yet.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  className="rounded-xl border border-zinc-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">
                        {event.type}
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">{event.payload}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        {formatDateTime(event.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {event.deliveryStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}