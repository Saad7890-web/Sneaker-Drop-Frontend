import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { NotFoundPage } from "@/components/common/NotFoundPage";
import { AdminRoute } from "@/components/layout/AdminRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/layout/PublicOnlyRoute";
import { ReservationBanner } from "@/components/layout/ReservationBanner";
import { CreateDropPage } from "@/features/admin/CreateDropPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/drops/DashboardPage";
import { DropDetailPage } from "@/features/drops/DropDetailPage";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <AppLayout>
                <ReservationBanner />
                <DashboardPage />
              </AppLayout>
            }
          />

          <Route
            path="/drops/:dropId"
            element={
              <AppLayout>
                <ReservationBanner />
                <DropDetailPage />
              </AppLayout>
            }
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/drops/new"
              element={
                <AppLayout>
                  <CreateDropPage />
                </AppLayout>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  );
}
