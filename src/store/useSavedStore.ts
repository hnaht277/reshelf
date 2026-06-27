import { create } from "zustand";

type SavedStore = {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  isSaved: (productId: string) => boolean;
};

export const useSavedStore = create<SavedStore>((set, get) => ({
  productIds: ["p-001", "p-004", "p-008", "p-010"],
  toggle: (productId) =>
    set((state) => ({
      productIds: state.productIds.includes(productId)
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId]
    })),
  remove: (productId) =>
    set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),
  isSaved: (productId) => get().productIds.includes(productId)
}));
