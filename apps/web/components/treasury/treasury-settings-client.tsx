"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DESTINATION_TYPES,
  IDLE_MODES,
  SETTLEMENT_ASSETS,
} from "@/lib/constants/treasury";
import { createId } from "@/lib/format/id";
import {
  loadTreasurySettings,
  saveTreasurySettings,
  type TreasurySettingsSnapshot,
} from "@/lib/treasury-storage";
import {
  getAllocationTotal,
  validateTreasuryPolicy,
} from "@/lib/validators/treasury";
import type { SettlementAsset } from "@/types/merchant";
import type {
  IdleMode,
  PayoutDestination,
  TreasuryBucket,
  TreasuryPolicy,
} from "@/types/treasury";
import { SectionCard } from "@/components/shared/section-card";

function createDefaultPolicy(): TreasuryPolicy {
  const now = new Date().toISOString();

  return {
    policyId: createId("policy"),
    merchantId: "merchant_demo",
    settlementAsset: "USDCx",
    autoSplitEnabled: true,
    yieldEnabled: false,
    yieldThreshold: "0",
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}

function createDefaultSnapshot(): TreasurySettingsSnapshot {
  const destinationId = createId("dest");
  const now = new Date().toISOString();

  return {
    policy: createDefaultPolicy(),
    destinations: [
      {
        destinationId,
        merchantId: "merchant_demo",
        label: "Primary Ops Wallet",
        asset: "USDCx",
        address: "SP000000000000000000002Q6VF78",
        type: "OPS",
        enabled: true,
        createdAt: now,
      },
    ],
    buckets: [
      {
        bucketId: createId("bucket"),
        policyId: "default",
        name: "Operations",
        allocationBps: 10000,
        destinationId,
        idleMode: "HOLD",
        enabled: true,
      },
    ],
  };
}

export function TreasurySettingsClient() {
  const [policy, setPolicy] = useState<TreasuryPolicy>(createDefaultPolicy);
  const [destinations, setDestinations] = useState<PayoutDestination[]>([]);
  const [buckets, setBuckets] = useState<TreasuryBucket[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const [destinationForm, setDestinationForm] = useState({
    label: "",
    asset: "USDCx" as SettlementAsset,
    address: "",
    type: "OPS" as PayoutDestination["type"],
  });

  const [bucketForm, setBucketForm] = useState({
    name: "",
    allocationPercent: "0",
    destinationId: "",
    idleMode: "HOLD" as IdleMode,
  });

  useEffect(() => {
    const saved = loadTreasurySettings();

    if (saved) {
      setPolicy(saved.policy);
      setDestinations(saved.destinations);
      setBuckets(saved.buckets);
      setBucketForm((current) => ({
        ...current,
        destinationId: saved.destinations[0]?.destinationId ?? "",
      }));
    } else {
      const defaults = createDefaultSnapshot();

      setPolicy(defaults.policy);
      setDestinations(defaults.destinations);
      setBuckets(defaults.buckets);
      setBucketForm((current) => ({
        ...current,
        destinationId: defaults.destinations[0]?.destinationId ?? "",
      }));
    }

    setIsHydrated(true);
  }, []);

  const allocationTotal = useMemo(() => getAllocationTotal(buckets), [buckets]);

  const allocationPercent = (allocationTotal / 100).toFixed(2);

  function handlePolicyChange<K extends keyof TreasuryPolicy>(
    key: K,
    value: TreasuryPolicy[K],
  ) {
    setPolicy((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleAddDestination() {
    if (!destinationForm.label.trim() || !destinationForm.address.trim()) {
      setErrors(["Destination label and address are required."]);
      return;
    }

    const nextDestination: PayoutDestination = {
      destinationId: createId("dest"),
      merchantId: policy.merchantId,
      label: destinationForm.label.trim(),
      asset: destinationForm.asset,
      address: destinationForm.address.trim(),
      type: destinationForm.type,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    setDestinations((current) => [...current, nextDestination]);
    setDestinationForm({
      label: "",
      asset: policy.settlementAsset,
      address: "",
      type: "OPS",
    });
    setErrors([]);
    setSaveMessage("");
  }

  function handleToggleDestination(destinationId: string) {
    setDestinations((current) =>
      current.map((destination) =>
        destination.destinationId === destinationId
          ? { ...destination, enabled: !destination.enabled }
          : destination,
      ),
    );
    setSaveMessage("");
  }

  function handleAddBucket() {
    const allocationPercentNumber = Number(bucketForm.allocationPercent);

    if (!bucketForm.name.trim()) {
      setErrors(["Bucket name is required."]);
      return;
    }

    if (!bucketForm.destinationId) {
      setErrors(["Choose a destination for the bucket."]);
      return;
    }

    if (!Number.isFinite(allocationPercentNumber) || allocationPercentNumber <= 0) {
      setErrors(["Bucket allocation percent must be greater than zero."]);
      return;
    }

    const nextBucket: TreasuryBucket = {
      bucketId: createId("bucket"),
      policyId: policy.policyId,
      name: bucketForm.name.trim(),
      allocationBps: Math.round(allocationPercentNumber * 100),
      destinationId: bucketForm.destinationId,
      idleMode: bucketForm.idleMode,
      enabled: true,
    };

    setBuckets((current) => [...current, nextBucket]);
    setBucketForm({
      name: "",
      allocationPercent: "0",
      destinationId: destinations[0]?.destinationId ?? "",
      idleMode: "HOLD",
    });
    setErrors([]);
    setSaveMessage("");
  }

  function handleToggleBucket(bucketId: string) {
    setBuckets((current) =>
      current.map((bucket) =>
        bucket.bucketId === bucketId
          ? { ...bucket, enabled: !bucket.enabled }
          : bucket,
      ),
    );
    setSaveMessage("");
  }

  function handleSave() {
    const nextErrors = validateTreasuryPolicy(policy, buckets, destinations);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setSaveMessage("");
      return;
    }

    const snapshot: TreasurySettingsSnapshot = {
      policy,
      buckets,
      destinations,
    };

    saveTreasurySettings(snapshot);
    setErrors([]);
    setSaveMessage("Treasury settings saved locally.");
  }

  if (!isHydrated) {
    return (
      <div className="p-8">
        <SectionCard
          title="Treasury settings"
          description="Loading merchant treasury configuration."
        >
          <p className="text-sm text-zinc-500">Loading settings...</p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Settlement defaults"
          description="Define the merchant default settlement asset and base policy."
        >
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">
                Default settlement asset
              </span>
              <select
                value={policy.settlementAsset}
                onChange={(event) =>
                  handlePolicyChange(
                    "settlementAsset",
                    event.target.value as SettlementAsset,
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-950"
              >
                {SETTLEMENT_ASSETS.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={policy.autoSplitEnabled}
                onChange={(event) =>
                  handlePolicyChange("autoSplitEnabled", event.target.checked)
                }
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">
                Enable automatic post-settlement splitting
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={policy.yieldEnabled}
                onChange={(event) =>
                  handlePolicyChange("yieldEnabled", event.target.checked)
                }
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">
                Enable idle-balance yield routing
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">
                Yield threshold
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={policy.yieldThreshold}
                onChange={(event) =>
                  handlePolicyChange("yieldThreshold", event.target.value)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
              <p className="text-xs text-zinc-500">
                Only balances above this amount are eligible for deployment.
              </p>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          title="Policy status"
          description="Review the treasury policy before saving."
        >
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Settlement asset</dt>
              <dd className="font-medium text-zinc-950">{policy.settlementAsset}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Auto split</dt>
              <dd className="font-medium text-zinc-950">
                {policy.autoSplitEnabled ? "Enabled" : "Disabled"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Yield mode</dt>
              <dd className="font-medium text-zinc-950">
                {policy.yieldEnabled ? "Enabled" : "Disabled"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Allocation total</dt>
              <dd
                className={[
                  "font-medium",
                  allocationTotal === 10000 ? "text-zinc-950" : "text-red-600",
                ].join(" ")}
              >
                {allocationPercent}%
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Save treasury settings
          </button>

          {saveMessage ? (
            <p className="mt-3 text-sm text-emerald-700">{saveMessage}</p>
          ) : null}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Payout destinations"
          description="Add reusable payout destinations for treasury allocations."
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Label"
              value={destinationForm.label}
              onChange={(event) =>
                setDestinationForm((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            />

            <select
              value={destinationForm.asset}
              onChange={(event) =>
                setDestinationForm((current) => ({
                  ...current,
                  asset: event.target.value as SettlementAsset,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            >
              {SETTLEMENT_ASSETS.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </select>

            <select
              value={destinationForm.type}
              onChange={(event) =>
                setDestinationForm((current) => ({
                  ...current,
                  type: event.target.value as PayoutDestination["type"],
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            >
              {DESTINATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Destination address"
              value={destinationForm.address}
              onChange={(event) =>
                setDestinationForm((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            />

            <button
              type="button"
              onClick={handleAddDestination}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Add destination
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {destinations.map((destination) => (
              <div
                key={destination.destinationId}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-950">
                      {destination.label}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {destination.type} • {destination.asset}
                    </p>
                    <p className="mt-2 break-all text-xs text-zinc-500">
                      {destination.address}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleDestination(destination.destinationId)}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    {destination.enabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Treasury buckets"
          description="Define how net settlement is split after payment finalization."
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Bucket name"
              value={bucketForm.name}
              onChange={(event) =>
                setBucketForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Allocation percent"
              value={bucketForm.allocationPercent}
              onChange={(event) =>
                setBucketForm((current) => ({
                  ...current,
                  allocationPercent: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            />

            <select
              value={bucketForm.destinationId}
              onChange={(event) =>
                setBucketForm((current) => ({
                  ...current,
                  destinationId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            >
              <option value="">Choose destination</option>
              {destinations
                .filter((destination) => destination.enabled)
                .map((destination) => (
                  <option
                    key={destination.destinationId}
                    value={destination.destinationId}
                  >
                    {destination.label}
                  </option>
                ))}
            </select>

            <select
              value={bucketForm.idleMode}
              onChange={(event) =>
                setBucketForm((current) => ({
                  ...current,
                  idleMode: event.target.value as IdleMode,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
            >
              {IDLE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddBucket}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Add bucket
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {buckets.map((bucket) => {
              const destination = destinations.find(
                (item) => item.destinationId === bucket.destinationId,
              );

              return (
                <div
                  key={bucket.bucketId}
                  className="rounded-lg border border-zinc-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-950">
                        {bucket.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {(bucket.allocationBps / 100).toFixed(2)}% • {bucket.idleMode}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {destination?.label ?? "Unknown destination"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBucket(bucket.bucketId)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                      {bucket.enabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {errors.length > 0 ? (
        <SectionCard
          title="Validation issues"
          description="Resolve these before saving treasury settings."
        >
          <ul className="space-y-2 text-sm text-red-600">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}