import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  fetchActiveDrops,
  purchaseReservation,
  reserveDrop,
} from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { dropKeys, queryClient } from "@/lib/queryClient";
import { useReservationStore } from "@/store/reservationStore";
import type { PaginatedDropResponse } from "@/types/api";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DropCard } from "./DropCard";
import { DropCardSkeleton } from "./DropCardSkeleton";

export function DashboardPage() {
  const { getReservation, upsertReservation, clearReservation } =
    useReservationStore();

  const dropsQuery = useInfiniteQuery({
    queryKey: dropKeys.active,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchActiveDrops(pageParam as number, 12),
    getNextPageParam: (lastPage: PaginatedDropResponse) =>
      lastPage.pageInfo.nextPage,
  });

  const reserveMutation = useMutation({
    mutationFn: async (dropId: string) => reserveDrop(dropId),
    onSuccess: (result) => {
      upsertReservation({
        reservationId: result.reservation.id,
        dropId: result.reservation.dropId,
        expiresAt: result.reservation.expiresAt,
      });

      queryClient.invalidateQueries({ queryKey: dropKeys.active });
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
    onSuccess: (_result, reservationId) => {
      const allReservations =
        useReservationStore.getState().reservationsByDropId;
      const entry = Object.values(allReservations).find(
        (item) => item.reservationId === reservationId,
      );
      if (entry) clearReservation(entry.dropId);

      queryClient.invalidateQueries({ queryKey: dropKeys.active });
      toast.success("Purchase completed");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.message);
    },
  });

  const allDrops = dropsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Active drops</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Reserve instantly, watch stock update in realtime, and complete
            purchase within the 60-second window.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => dropsQuery.refetch()}
          disabled={dropsQuery.isFetching}
        >
          {dropsQuery.isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </section>

      {dropsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DropCardSkeleton key={index} />
          ))}
        </div>
      ) : dropsQuery.isError ? (
        <Card className="p-8">
          <div className="flex items-center gap-3 text-rose-300">
            <AlertCircle className="h-5 w-5" />
            Failed to load drops.
          </div>
        </Card>
      ) : null}

      {!dropsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allDrops.map((drop) => {
            const reservation = getReservation(drop.id);

            return (
              <DropCard
                key={drop.id}
                drop={drop}
                reservation={reservation}
                reserving={reserveMutation.isPending}
                purchasing={purchaseMutation.isPending}
                onReserve={(dropId) => reserveMutation.mutate(dropId)}
                onPurchase={(_reservationId, _dropId) =>
                  purchaseMutation.mutate(_reservationId)
                }
              />
            );
          })}
        </div>
      ) : null}

      {dropsQuery.hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            onClick={() => dropsQuery.fetchNextPage()}
            loading={dropsQuery.isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      ) : null}

      {!dropsQuery.isLoading && allDrops.length === 0 ? (
        <Card className="p-8">
          <p className="text-slate-300">No active drops right now.</p>
        </Card>
      ) : null}
    </div>
  );
}
