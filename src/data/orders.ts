import { products } from "@/data/products";
import type { Order } from "@/types";

function product(id: string) {
  const item = products.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing mock product ${id}`);
  return item;
}

export const orders: Order[] = [
  {
    id: "RS-8421",
    placedAt: "2026-06-26T10:30:00.000Z",
    status: "ready",
    items: [
      { product: product("p-002"), quantity: 1 },
      { product: product("p-004"), quantity: 1 }
    ],
    total: 9.74,
    co2Saved: 2
  },
  {
    id: "RS-8157",
    placedAt: "2026-06-18T08:15:00.000Z",
    status: "delivered",
    items: [
      { product: product("p-001"), quantity: 2 },
      { product: product("p-003"), quantity: 1 },
      { product: product("p-011"), quantity: 1 }
    ],
    total: 23.95,
    co2Saved: 3.8
  },
  {
    id: "RS-7894",
    placedAt: "2026-06-04T15:40:00.000Z",
    status: "delivered",
    items: [
      { product: product("p-006"), quantity: 1 },
      { product: product("p-012"), quantity: 2 }
    ],
    total: 12.48,
    co2Saved: 2
  },
  {
    id: "RS-7512",
    placedAt: "2026-05-21T12:00:00.000Z",
    status: "cancelled",
    items: [{ product: product("p-008"), quantity: 1 }],
    total: 15.98,
    co2Saved: 0
  }
];
