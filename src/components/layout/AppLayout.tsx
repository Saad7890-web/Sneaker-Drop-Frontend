import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { env } from "@/lib/env";
import { useAuthStore } from "@/store/authStore";
import { useReservationStore } from "@/store/reservationStore";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearAllReservations = useReservationStore(
    (state) => state.clearAllReservations,
  );

  const logoutDialog = useDisclosure();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      clearSession();
      clearAllReservations();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
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

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <Badge tone="info">
                <UserRound className="mr-1 h-3.5 w-3.5" />
                {user.username}
              </Badge>
            ) : null}

            {user?.role === "ADMIN" ? (
              <Link to="/admin/drops/new">
                <Button variant="secondary">Create Drop</Button>
              </Link>
            ) : null}

            {user ? (
              <Button variant="secondary" onClick={logoutDialog.onOpen}>
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

      <Dialog
        open={logoutDialog.open}
        title="Sign out?"
        description="This will clear your session and local reservation state."
        confirmLabel="Logout"
        confirmTone="danger"
        loading={loggingOut}
        onClose={logoutDialog.onClose}
        onConfirm={handleLogout}
      />
    </div>
  );
}
