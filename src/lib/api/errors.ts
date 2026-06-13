import { getFriendlyErrorMessage } from "@/lib/api/errorMessages";
import type { ApiErrorPayload } from "@/types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const getMessage = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") return "Request failed";
  const maybe = payload as Record<string, unknown>;

  if (typeof maybe.message === "string") return maybe.message;

  if (typeof maybe.error === "object" && maybe.error) {
    const err = maybe.error as Record<string, unknown>;
    if (typeof err.message === "string") return err.message;
  }

  return "Request failed";
};

const getCode = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") return "UNKNOWN_ERROR";
  const maybe = payload as Record<string, unknown>;

  if (typeof maybe.error === "object" && maybe.error) {
    const err = maybe.error as Record<string, unknown>;
    if (typeof err.code === "string") return err.code;
  }

  return "UNKNOWN_ERROR";
};

export function normalizeApiError(payload: unknown, status: number): ApiError {
  const rawMessage = getMessage(payload);
  const code = getCode(payload);

  const details =
    payload && typeof payload === "object"
      ? (payload as ApiErrorPayload).error?.details
      : undefined;

  const friendlyMessage = getFriendlyErrorMessage(code, rawMessage);

  return new ApiError(friendlyMessage, status, code, details);
}
