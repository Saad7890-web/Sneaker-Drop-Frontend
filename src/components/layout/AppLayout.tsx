import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { env } from "@/lib/env";
import { useAuthStore } from "@/store/authStore";
import { useReservationStore } from "@/store/reservationStore";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearAllReservations = useReservationStore(
    (state) => state.clearAllReservations,
  );

  const handleLogout = () => {
    clearSession();
    clearAllReservations();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{env.appName}</p>
              <p className="text-xs text-slate-400">
                Realtime sneaker drop dashboard
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-3">
            {user ? (
              <Badge tone="info">
                <UserRound className="mr-1 h-3.5 w-3.5" />
                {user.username}
              </Badge>
            ) : null}
            {user ? (
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
