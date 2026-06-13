import { create } from "zustand";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  tone?: "info" | "success" | "warning" | "danger";
  createdAt: number;
};

type NotificationState = {
  items: AppNotification[];
  push: (notification: Omit<AppNotification, "id" | "createdAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const makeId = () => crypto.randomUUID();

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  push: (notification) =>
    set((state) => ({
      items: [
        {
          ...notification,
          id: makeId(),
          createdAt: Date.now(),
        },
        ...state.items,
      ].slice(0, 5),
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set({ items: [] }),
}));
