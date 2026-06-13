import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
  const hydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);

  if (!hydrated) {
    return <div className="p-8 text-slate-300">Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
