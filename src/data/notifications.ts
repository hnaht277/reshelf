import type { AppNotification } from "@/types";

const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const notifications: AppNotification[] = [
  {
    id: "n-001",
    type: "new-listing",
    title: "New rescue bags nearby",
    body: "Green Basket Market added 3 ripe produce bundles within 1 km.",
    createdAt: new Date(Date.now() - 2 * hour).toISOString(),
    read: false
  },
  {
    id: "n-002",
    type: "expiry-alert",
    title: "Saved item expires tomorrow",
    body: "Cold-Pressed Green Juice is still available, but only for a short window.",
    createdAt: new Date(Date.now() - 5 * hour).toISOString(),
    read: false
  },
  {
    id: "n-003",
    type: "price-drop",
    title: "Price dropped on yogurt",
    body: "Organic Greek Yogurt Pack is now 44% off at Urban Dairy Co.",
    createdAt: new Date(Date.now() - 22 * hour).toISOString(),
    read: true
  },
  {
    id: "n-004",
    type: "order-update",
    title: "Pickup window confirmed",
    body: "Your Morning Loaf Bakery order can be picked up between 5:00 and 7:00 PM.",
    createdAt: new Date(Date.now() - day - 2 * hour).toISOString(),
    read: true
  },
  {
    id: "n-005",
    type: "impact",
    title: "Milestone reached",
    body: "You have rescued 12 meals and saved 4.8 kg CO2 so far.",
    createdAt: new Date(Date.now() - 4 * day).toISOString(),
    read: false
  }
];
