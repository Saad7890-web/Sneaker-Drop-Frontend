import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const dropKeys = {
  active: ["drops", "active"] as const,
  detail: (dropId: string) => ["drops", "detail", dropId] as const,
};
