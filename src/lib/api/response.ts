export type WrappedApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  message?: string;
};

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function extractResponseData<T>(payload: unknown): T {
  if (!isObject(payload)) {
    return payload as T;
  }

  if ("data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export function isFailurePayload(
  payload: unknown,
): payload is WrappedApiResponse<never> {
  if (!isObject(payload)) return false;
  if ("success" in payload && payload.success === false) return true;
  if ("error" in payload && isObject(payload.error)) return true;
  return false;
}
