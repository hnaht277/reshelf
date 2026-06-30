import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { orders as initialOrders } from "@/data/orders";
import type { Order } from "@/types";

type OrderStore = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: initialOrders,
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((candidate) => candidate.id !== order.id)]
        }))
    }),
    {
      name: "reshelf-orders",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
