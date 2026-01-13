import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "family"
  | "community-member"
  | "charity-admin"
  | "compost-hub-manager"
  | "shop-staff"
  | "restaurant-staff"
  | "admin";

interface RoleState {
  selectedRole: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      selectedRole: null,
      setRole: (role) => {
        set({ selectedRole: role });
        // Also store in localStorage for quick access
        if (typeof window !== "undefined") {
          localStorage.setItem("user_role", role);
        }
      },
      clearRole: () => {
        set({ selectedRole: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_role");
        }
      },
    }),
    {
      name: "role-storage",
    }
  )
);

