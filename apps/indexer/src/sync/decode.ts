import { Cl, cvToValue } from "@stacks/transactions";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapClarityLike(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(unwrapClarityLike);
  }

  if (!isObject(value)) return value;

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

export function decodeReadOnlyResult(result: string) {
  const clarityValue = Cl.deserialize(result);
  const decoded = cvToValue(clarityValue);
  return unwrapClarityLike(decoded);
}