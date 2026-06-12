import { env } from "@/lib/env";
import { dropKeys, queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import type {
  DropCard,
  PaginatedDropResponse,
  PurchaseCompletedPayload,
  ReservationCreatedPayload,
  ReservationExpiredPayload,
  StockUpdatedPayload,
} from "@/types/api";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

function patchDropStock(
  old: PaginatedDropResponse | undefined,
  payload: StockUpdatedPayload,
): PaginatedDropResponse | undefined {
  if (!old) return old;

  return {
    ...old,
    items: old.items.map((drop) =>
      drop.id === payload.dropId
        ? {
            ...drop,
            availableStock: payload.availableStock,
            status: payload.status,
          }
        : drop,
    ),
  };
}

function patchDropStockInDetail(
  old: DropCard | undefined,
  payload: StockUpdatedPayload,
): DropCard | undefined {
  if (!old || old.id !== payload.dropId) return old;
  return {
    ...old,
    availableStock: payload.availableStock,
    status: payload.status,
  };
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);

  const socket = useMemo(() => {
    return io(env.socketUrl, {
      autoConnect: false,
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });
  }, [token]);

  useEffect(() => {
    socket.connect();

    const onStockUpdated = (payload: StockUpdatedPayload) => {
      queryClient.setQueryData<PaginatedDropResponse>(dropKeys.active, (old) =>
        patchDropStock(old, payload),
      );

      const allQueries = queryClient.getQueryCache().findAll({
        queryKey: ["drops", "detail"],
      });

      for (const query of allQueries) {
        const data = queryClient.getQueryData<DropCard>(query.queryKey);
        const updated = patchDropStockInDetail(data, payload);
        if (updated) queryClient.setQueryData(query.queryKey, updated);
      }
    };

    const onReservationCreated = (_payload: ReservationCreatedPayload) => {
      queryClient.invalidateQueries({ queryKey: dropKeys.active });
    };

    const onReservationExpired = (_payload: ReservationExpiredPayload) => {
      queryClient.invalidateQueries({ queryKey: dropKeys.active });
    };

    const onPurchaseCompleted = (_payload: PurchaseCompletedPayload) => {
      queryClient.invalidateQueries({ queryKey: dropKeys.active });
    };

    socket.on("stock_updated", onStockUpdated);
    socket.on("reservation_created", onReservationCreated);
    socket.on("reservation_expired", onReservationExpired);
    socket.on("purchase_completed", onPurchaseCompleted);

    return () => {
      socket.off("stock_updated", onStockUpdated);
      socket.off("reservation_created", onReservationCreated);
      socket.off("reservation_expired", onReservationExpired);
      socket.off("purchase_completed", onPurchaseCompleted);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
