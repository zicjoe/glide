import { createId } from "@/lib/format/id";
import type { StoredNotificationEvent } from "@/lib/ops-storage";

export function createEvent(params: {
  merchantId: string;
  type: StoredNotificationEvent["type"];
  payload: string;
}): StoredNotificationEvent {
  return {
    eventId: createId("evt"),
    merchantId: params.merchantId,
    type: params.type,
    payload: params.payload,
    deliveryStatus: "DELIVERED",
    createdAt: new Date().toISOString(),
  };
}