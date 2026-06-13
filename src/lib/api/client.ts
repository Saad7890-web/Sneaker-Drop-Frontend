import { normalizeApiError } from "@/lib/api/errors";
import { extractResponseData, isFailurePayload } from "@/lib/api/response";
import { env } from "@/lib/env";
import { useAuthStore } from "@/store/authStore";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload = await readJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().clearSession();
    }
    throw normalizeApiError(payload, response.status);
  }

  if (isFailurePayload(payload)) {
    throw normalizeApiError(payload, response.status);
  }

  return extractResponseData<T>(payload);
}
