import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StoredReservation = {
  reservationId: string;
  dropId: string;
  expiresAt: string;
};

type ReservationState = {
  reservationsByDropId: Record<string, StoredReservation>;
  upsertReservation: (reservation: StoredReservation) => void;
  clearReservation: (dropId: string) => void;
  clearAllReservations: () => void;
  getReservation: (dropId: string) => StoredReservation | undefined;
};

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservationsByDropId: {},
      upsertReservation: (reservation) =>
        set((state) => ({
          reservationsByDropId: {
            ...state.reservationsByDropId,
            [reservation.dropId]: reservation,
          },
        })),
      clearReservation: (dropId) =>
        set((state) => {
          const next = { ...state.reservationsByDropId };
          delete next[dropId];
          return { reservationsByDropId: next };
        }),
      clearAllReservations: () => set({ reservationsByDropId: {} }),
      getReservation: (dropId) => get().reservationsByDropId[dropId],
    }),
    {
      name: "sneaker-drop-reservations",
    },
  ),
);
