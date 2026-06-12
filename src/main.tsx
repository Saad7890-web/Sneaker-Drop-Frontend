import { queryClient } from "@/lib/queryClient";
import { SocketProvider } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.isHydrated);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HydrationGate>
          <SocketProvider>
            <App />
          </SocketProvider>
        </HydrationGate>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
