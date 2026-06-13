import { useNotificationStore } from "@/store/notificationStore";
import { X } from "lucide-react";

const toneStyles: Record<string, string> = {
  info: "border-blue-500/30 bg-blue-500/10 text-blue-100",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-100",
};

export function NotificationTray() {
  const items = useNotificationStore((state) => state.items);
  const remove = useNotificationStore((state) => state.remove);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-3 px-4 sm:px-0">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl border p-4 shadow-soft backdrop-blur ${toneStyles[item.tone ?? "info"] ?? toneStyles.info}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-sm opacity-90">{item.message}</p>
            </div>

            <button
              onClick={() => remove(item.id)}
              className="rounded-lg p-1 transition hover:bg-white/10"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
