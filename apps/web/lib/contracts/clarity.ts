import { Cl, cvToValue } from "@stacks/transactions";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapClarityLike(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(unwrapClarityLike);
  }

  if (!isObject(value)) {
    return value;
  }

  const type = typeof value.type === "string" ? value.type : null;

  if (type === "ok" || type === "response-ok") {
    return unwrapClarityLike(value.value);
  }

  if (type === "err" || type === "response-err") {
    throw new Error(`Contract returned err: ${JSON.stringify(value.value)}`);
  }

  if (type === "some") {
    return unwrapClarityLike(value.value);
  }

  if (type === "none") {
    return null;
  }

  if (type === "tuple" && isObject(value.value)) {
    const tuple: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value.value)) {
      tuple[k] = unwrapClarityLike(v);
    }
    return tuple;
  }

  if ("value" in value && Object.keys(value).length <= 2) {
    return unwrapClarityLike(value.value);
  }

  const normalized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    normalized[k] = unwrapClarityLike(v);
  }
  return normalized;
}

export function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  throw new Error(`Cannot convert value to number: ${String(value)}`);
}

export function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  throw new Error(`Cannot convert value to string: ${String(value)}`);
}

export function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  throw new Error(`Cannot convert value to boolean: ${String(value)}`);
}

export function getField<T = unknown>(value: unknown, key: string): T {
  if (!isObject(value)) {
    throw new Error(`Expected object while reading key "${key}"`);
  }

  if (!(key in value)) {
    throw new Error(
      `Missing key "${key}" in ${JSON.stringify(value)}`
    );
  }

  return value[key] as T;
}

export function getOptionalField<T = unknown>(
  value: unknown,
  key: string
): T | null {
  if (!isObject(value)) return null;
  return key in value ? (value[key] as T) : null;
}

export function unwrapSome<T = unknown>(value: unknown): T | null {
  if (value == null) return null;
  return value as T;
}

export function normalizeResponse(value: any): any {
  if (isObject(value) && "result" in value && typeof value.result === "string") {
    const clarityValue = Cl.deserialize(value.result);
    const decoded = cvToValue(clarityValue);
    return unwrapClarityLike(decoded);
  }

  return unwrapClarityLike(value);
}