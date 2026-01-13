import { create } from "zustand";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  filters: {
    category?: string;
    location?: string;
    search?: string;
  };
  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  setSelectedItem: (item: InventoryItem | null) => void;
  setFilters: (filters: Partial<InventoryState["filters"]>) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  selectedItem: null,
  filters: {},
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));

