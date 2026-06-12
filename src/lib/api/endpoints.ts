import { apiRequest } from "@/lib/api/client";
import type {
  AuthResponse,
  DropDetailResponse,
  PaginatedDropResponse,
  PurchaseResponse,
  ReserveResponse,
} from "@/types/api";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export async function login(input: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function register(input: RegisterInput) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function fetchActiveDrops(page = 1, limit = 12) {
  return apiRequest<PaginatedDropResponse>(
    `/drops/active?page=${page}&limit=${limit}`,
  );
}

export async function fetchDrop(dropId: string) {
  return apiRequest<DropDetailResponse>(`/drops/${dropId}`);
}

export async function reserveDrop(dropId: string) {
  return apiRequest<ReserveResponse>(`/drops/${dropId}/reserve`, {
    method: "POST",
  });
}

export async function purchaseReservation(reservationId: string) {
  return apiRequest<PurchaseResponse>(
    `/reservations/${reservationId}/purchase`,
    {
      method: "POST",
    },
  );
}
