import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  fetchDrop,
  purchaseReservation,
  reserveDrop,
} from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { dropStatusLabel, isDropActive, isDropSoldOut } from "@/lib/dropStatus";
import { dropKeys, queryClient } from "@/lib/queryClient";
import { useReservationStore } from "@/store/reservationStore";
import type { DropCard } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock3, Loader2, Users } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function formatCountdown(expiresAt?: string) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "00:00";

  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DropDetailPage() {
  const { dropId } = useParams<{ dropId: string }>();
  const { getReservation, upsertReservation, clearReservation } =
    useReservationStore();

  const reservation = dropId ? getReservation(dropId) : undefined;

  const dropQuery = useQuery<DropCard>({
    queryKey: dropId ? dropKeys.detail(dropId) : ["drops", "detail", "missing"],
    queryFn: () => {
      if (!dropId) throw new Error("Missing drop ID");
      return fetchDrop(dropId);
    },
    enabled: Boolean(dropId),
  });

  const reserveMutation = useMutation({
    mutationFn: async () => {
      if (!dropId) throw new Error("Missing drop ID");
      return reserveDrop(dropId);
    },
    onSuccess: (result) => {
      upsertReservation({
        reservationId: result.reservation.id,
        dropId: result.reservation.dropId,
        expiresAt: result.reservation.expiresAt,
      });

      queryClient.invalidateQueries({ queryKey: dropKeys.active });
      if (dropId)
        queryClient.invalidateQueries({ queryKey: dropKeys.detail(dropId) });

      toast.success("Reservation created");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.message);
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (reservationId: string) =>
      purchaseReservation(reservationId),
    onSuccess: () => {
      if (dropId) clearReservation(dropId);
      queryClient.invalidateQueries({ queryKey: dropKeys.active });
      if (dropId)
        queryClient.invalidateQueries({ queryKey: dropKeys.detail(dropId) });
      toast.success("Purchase completed");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.message);
    },
  });

  const drop = dropQuery.data;

  const countdown = useMemo(() => {
    if (!reservation?.expiresAt) return null;
    return formatCountdown(reservation.expiresAt);
  }, [reservation?.expiresAt]);

  const expired = reservation
    ? new Date(reservation.expiresAt).getTime() <= Date.now()
    : false;

  if (dropQuery.isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading drop details...
        </div>
      </Card>
    );
  }

  if (dropQuery.isError || !drop) {
    return (
      <Card className="p-8">
        <div className="flex items-center gap-3 text-rose-300">
          <AlertCircle className="h-5 w-5" />
          Failed to load drop details.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold text-white">
                {drop.title}
              </h1>
              <Badge tone={drop.status === "ACTIVE" ? "success" : "neutral"}>
                {dropStatusLabel(drop.status)}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Starts: {new Date(drop.startsAt).toLocaleString()}
            </p>
            {drop.endsAt ? (
              <p className="mt-1 text-sm text-slate-400">
                Ends: {new Date(drop.endsAt).toLocaleString()}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Available
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {drop.availableStock}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {drop.totalStock}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
            <Users className="h-4 w-4" />
            Recent purchasers
          </div>

          <div className="space-y-3">
            {drop.recentBuyers.length > 0 ? (
              drop.recentBuyers.map((buyer) => (
                <div
                  key={`${buyer.username}-${buyer.purchasedAt}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <span className="text-sm text-white">{buyer.username}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(buyer.purchasedAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-slate-800 px-4 py-5 text-sm text-slate-500">
                No successful purchases yet.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
            <Clock3 className="h-4 w-4" />
            Reservation
          </div>

          {reservation ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-sm text-blue-100">
                  You already reserved this drop.
                </p>
                <p className="mt-1 text-xs text-blue-100/70">
                  Reservation ID: {reservation.reservationId}
                </p>
                <div className="mt-3">
                  <Badge tone={expired ? "danger" : "info"}>
                    {expired ? "Expired" : `Time left: ${countdown}`}
                  </Badge>
                </div>
              </div>

              <Button
                className="w-full"
                loading={purchaseMutation.isPending}
                disabled={expired}
                onClick={() =>
                  purchaseMutation.mutate(reservation.reservationId)
                }
              >
                Complete Purchase
              </Button>

              <Button
                className="w-full"
                variant="secondary"
                onClick={() => clearReservation(drop.id)}
              >
                Clear from local UI
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Reserve this item for 60 seconds before the stock is released
                back.
              </p>

              <Button
                className="w-full"
                loading={reserveMutation.isPending}
                disabled={
                  isDropSoldOut(drop.availableStock) ||
                  !isDropActive(drop.status)
                }
                onClick={() => reserveMutation.mutate()}
              >
                {isDropSoldOut(drop.availableStock)
                  ? "Sold out"
                  : "Reserve now"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
