import { TREASURY_STORAGE_KEY } from "@/lib/constants/treasury";
import type { PayoutDestination, TreasuryBucket, TreasuryPolicy } from "@/types/treasury";

export interface TreasurySettingsSnapshot {
  policy: TreasuryPolicy;
  buckets: TreasuryBucket[];
  destinations: PayoutDestination[];
}

export function saveTreasurySettings(snapshot: TreasurySettingsSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TREASURY_STORAGE_KEY, JSON.stringify(snapshot));
}

export function loadTreasurySettings(): TreasurySettingsSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(TREASURY_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TreasurySettingsSnapshot;
  } catch {
    return null;
  }
}