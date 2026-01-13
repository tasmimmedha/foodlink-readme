import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRoleStore } from "./role.store";

interface User {
  id: string;
  name: string;
  email: string;
  householdId?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token && typeof window !== "undefined") {
          // Store token in both keys for consistency
          localStorage.setItem("token", token);
          localStorage.setItem("auth_token", token);
        } else if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
        }
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          // Clear zustand persisted storage
          localStorage.removeItem("user-storage");
          // Clear role selection so user must select again on next login
          const roleStore = useRoleStore.getState();
          roleStore.clearRole();
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);

