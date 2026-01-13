import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NgoState {
  activeNav: "dashboard" | "donations" | "capacity" | "pickups" | "history" | "partners" | "reports" | "feedback" | "profile";
  selectedOfferId?: string;
  showUrgentOnly: boolean;
  xpProgress: number;
  level: number;
  capacityPercent: number;
  setActiveNav: (nav: NgoState["activeNav"]) => void;
  setSelectedOffer: (offerId?: string) => void;
  toggleUrgentFilter: () => void;
  setXpProgress: (progress: number, level?: number) => void;
  setCapacityPercent: (percent: number) => void;
}

export const useNgoStore = create<NgoState>()(
  persist(
    (set) => ({
      activeNav: "dashboard",
      selectedOfferId: undefined,
      showUrgentOnly: false,
      xpProgress: 0.62,
      level: 7,
      capacityPercent: 0.61,
      setActiveNav: (activeNav) => set({ activeNav }),
      setSelectedOffer: (selectedOfferId) => set({ selectedOfferId }),
      toggleUrgentFilter: () =>
        set((state) => ({
          showUrgentOnly: !state.showUrgentOnly,
        })),
      setXpProgress: (xpProgress, level) =>
        set((state) => ({
          xpProgress,
          level: level ?? state.level,
        })),
      setCapacityPercent: (capacityPercent) => set({ capacityPercent }),
    }),
    {
      name: "ngo-dashboard-store",
      partialize: (state) => ({
        activeNav: state.activeNav,
        showUrgentOnly: state.showUrgentOnly,
      }),
    }
  )
);


