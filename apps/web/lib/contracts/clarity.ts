type ClarityPrimitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") {
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

export function getField<T = unknown>(
  value: unknown,
  key: string,
): T {
  if (!isObject(value)) {
    throw new Error(`Expected object while reading key "${key}"`);
  }

  return value[key] as T;
}

export function getOptionalField<T = unknown>(
  value: unknown,
  key: string,
): T | null {
  if (!isObject(value)) return null;
  const result = value[key];
  return result == null ? null : (result as T);
}

export function unwrapSome<T = unknown>(value: unknown): T | null {
  if (value == null) return null;

  if (isObject(value)) {
    if ("type" in value && value.type === "none") return null;
    if ("type" in value && value.type === "some") {
      return (value.value as T) ?? null;
    }
    if ("some" in value) return value.some as T;
    if ("value" in value) return value.value as T;
  }

  return value as T;
}

export function normalizeResponse<T>(value: T): T {
  return value;
}