import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { purchaseReservation } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { queryClient } from "@/lib/queryClient";
import { useReservationStore } from "@/store/reservationStore";
import { useMutation } from "@tanstack/react-query";
import { Clock3, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatRemaining(expiresAt: string, now: number) {
  const diff = new Date(expiresAt).getTime() - now;
  if (diff <= 0) return "00:00";

  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ReservationBanner() {
  const [now, setNow] = useState(Date.now());
  const { reservationsByDropId, clearReservation } = useReservationStore();
  const clearDialog = useDisclosure();

  const activeReservations = useMemo(
    () => Object.values(reservationsByDropId),
    [reservationsByDropId],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const purchaseMutation = useMutation({
    mutationFn: async (reservationId: string) =>
      purchaseReservation(reservationId),
    onSuccess: (_result, reservationId) => {
      const entry = activeReservations.find(
        (item) => item.reservationId === reservationId,
      );
      if (entry) clearReservation(entry.dropId);

      queryClient.invalidateQueries({ queryKey: ["drops", "active"] });
      toast.success("Purchase completed");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.message);
    },
  });

  const handleClearAll = () => {
    for (const reservation of activeReservations) {
      clearReservation(reservation.dropId);
    }
    clearDialog.onClose();
    toast.success("Local reservation state cleared");
  };

  if (activeReservations.length === 0) return null;

  return (
    <div className="sticky top-[84px] z-10 mb-6">
      <Card className="border-blue-500/30 bg-blue-500/10 p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-100">
            <Clock3 className="h-4 w-4" />
            Active reservation(s)
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="info">{activeReservations.length} running</Badge>
            <Button variant="ghost" onClick={clearDialog.onOpen}>
              <X className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {activeReservations.map((reservation) => {
            const remaining = formatRemaining(reservation.expiresAt, now);
            const expired = new Date(reservation.expiresAt).getTime() <= now;

            return (
              <div
                key={reservation.reservationId}
                className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">
                    Drop ID:{" "}
                    <span className="text-slate-300">{reservation.dropId}</span>
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Reservation ID: {reservation.reservationId}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={expired ? "danger" : "info"}>
                    {expired ? "Expired" : remaining}
                  </Badge>

                  <Button
                    variant="primary"
                    loading={purchaseMutation.isPending}
                    disabled={expired}
                    onClick={() =>
                      purchaseMutation.mutate(reservation.reservationId)
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Purchase
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => clearReservation(reservation.dropId)}
                    title="Remove from local UI"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog
        open={clearDialog.open}
        title="Clear all reservation UI state?"
        description="This only removes local frontend state. It does not cancel backend reservations."
        confirmLabel="Clear"
        confirmTone="danger"
        onClose={clearDialog.onClose}
        onConfirm={handleClearAll}
      />
    </div>
  );
}
