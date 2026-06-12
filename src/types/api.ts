export type ApiErrorPayload = {
  success: false;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  message?: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type RecentBuyer = {
  username: string;
  purchasedAt: string;
};

export type DropCard = {
  id: string;
  title: string;
  totalStock: number;
  availableStock: number;
  status: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  recentBuyers: RecentBuyer[];
};

export type PaginatedDropResponse = {
  items: DropCard[];
  pageInfo: {
    page: number;
    limit: number;
    hasMore: boolean;
    nextPage: number | null;
  };
};

export type DropDetailResponse = DropCard;

export type ReserveResponse = {
  drop: {
    id: string;
    title: string;
    totalStock: number;
    availableStock: number;
    status: string;
    startsAt: string;
    endsAt: string | null;
  };
  reservation: {
    id: string;
    userId: string;
    dropId: string;
    status: string;
    reservedAt: string;
    expiresAt: string;
  };
};

export type PurchaseResponse = {
  purchase: {
    id: string;
    userId: string;
    dropId: string;
    reservationId: string;
    status: string;
    purchasedAt: string;
  };
  reservation: {
    id: string;
    status: string;
    completedAt: string | null;
  };
};

export type StockUpdatedPayload = {
  dropId: string;
  availableStock: number;
  status: string;
};

export type ReservationCreatedPayload = {
  reservationId: string;
  dropId: string;
  userId: string;
  expiresAt: string;
  availableStock: number;
  status: string;
};

export type ReservationExpiredPayload = {
  reservationId: string;
  dropId: string;
  userId: string;
  expiredAt: string;
  availableStock: number;
  status: string;
};

export type PurchaseCompletedPayload = {
  purchaseId: string;
  reservationId: string;
  dropId: string;
  userId: string;
  purchasedAt: string;
};
