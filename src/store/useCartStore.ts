import { create } from "zustand";
import type { CartItem, Product } from "@/types";
import { productSavings } from "@/utils/format";

type CartStore = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
  originalSubtotal: () => number;
  savings: () => number;
  co2Saved: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  add: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item
          )
        };
      }
      return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] };
    }),
  remove: (productId) =>
    set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
  updateQty: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    })),
  clear: () => set({ items: [] }),
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  originalSubtotal: () =>
    get().items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0),
  savings: () =>
    get().items.reduce((sum, item) => sum + productSavings(item.product) * item.quantity, 0),
  co2Saved: () =>
    get().items.reduce((sum, item) => sum + item.product.co2Savings * item.quantity, 0)
}));
