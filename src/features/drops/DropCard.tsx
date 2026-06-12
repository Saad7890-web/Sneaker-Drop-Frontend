import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StoredReservation } from "@/store/reservationStore";
import type { DropCard as DropCardType } from "@/types/api";
import { Clock3, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  drop: DropCardType;
  reservation?: StoredReservation;
  onReserve: (dropId: string) => void;
  onPurchase: (reservationId: string, dropId: string) => void;
  reserving: boolean;
  purchasing: boolean;
};

function formatCountdown(targetIso?: string) {
  if (!targetIso) return null;
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DropCard({
  drop,
  reservation,
  onReserve,
  onPurchase,
  reserving,
  purchasing,
}: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const countdown = useMemo(() => {
    if (!reservation?.expiresAt) return null;
    const diff = new Date(reservation.expiresAt).getTime() - now;
    if (diff <= 0) return "00:00";
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor(diff / 1000) % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [reservation?.expiresAt, now]);

  const expired = reservation
    ? new Date(reservation.expiresAt).getTime() <= now
    : false;

  const stockTone =
    drop.availableStock === 0
      ? "danger"
      : drop.availableStock <= 3
        ? "warning"
        : "success";

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{drop.title}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Starts: {new Date(drop.startsAt).toLocaleString()}
            </p>
          </div>
          <Badge
            tone={
              drop.status === "ACTIVE"
                ? "success"
                : drop.status === "SCHEDULED"
                  ? "info"
                  : "neutral"
            }
          >
            {drop.status}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Available
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {drop.availableStock}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {drop.totalStock}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Clock3 className="h-4 w-4" />
          <span>
            {drop.endsAt
              ? `Ends ${new Date(drop.endsAt).toLocaleString()}`
              : "No end time set"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
            <Users className="h-4 w-4" />
            Recent purchasers
          </div>

          <div className="space-y-2">
            {drop.recentBuyers.length > 0 ? (
              drop.recentBuyers.map((buyer) => (
                <div
                  key={`${buyer.username}-${buyer.purchasedAt}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm"
                >
                  <span className="text-slate-100">{buyer.username}</span>
                  <span className="text-slate-500">
                    {new Date(buyer.purchasedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-sm text-slate-500">
                No purchases yet.
              </p>
            )}
          </div>
        </div>

        {reservation ? (
          <div className="mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-blue-200">
                  Reservation active
                </p>
                <p className="text-xs text-blue-100/80">
                  Reservation ID: {reservation.reservationId}
                </p>
              </div>
              <Badge tone={expired ? "danger" : "info"}>
                {expired ? "Expired" : (countdown ?? "--:--")}
              </Badge>
            </div>

            <div className="mt-4">
              <Button
                className="w-full"
                variant="primary"
                loading={purchasing}
                disabled={expired}
                onClick={() => onPurchase(reservation.reservationId, drop.id)}
              >
                Complete Purchase
              </Button>
              {expired ? (
                <p className="mt-2 text-sm text-rose-300">
                  Reservation expired. Refresh the list or reserve again.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <Button
          className="w-full"
          variant="secondary"
          loading={reserving}
          disabled={drop.availableStock <= 0 || drop.status !== "ACTIVE"}
          onClick={() => onReserve(drop.id)}
        >
          {drop.availableStock <= 0
            ? "Sold out"
            : drop.status !== "ACTIVE"
              ? "Unavailable"
              : "Reserve"}
        </Button>

        <p
          className={`mt-3 text-sm ${stockTone === "danger" ? "text-rose-400" : stockTone === "warning" ? "text-amber-300" : "text-emerald-300"}`}
        >
          Stock is {drop.availableStock} of {drop.totalStock}
        </p>
      </div>
    </Card>
  );
}
