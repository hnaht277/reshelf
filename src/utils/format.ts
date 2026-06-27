import type { FreshnessStatus, Product } from "@/types";

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateIso);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function getFreshnessStatus(dateIso: string): FreshnessStatus {
  const days = daysUntil(dateIso);
  if (days < 0) return "Expired";
  if (days === 0) return "Last Day";
  if (days <= 3) return "Expiring Soon";
  return "Fresh";
}

export function formatTimeLeft(dateIso: string): string {
  const days = daysUntil(dateIso);
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

export function formatExactDate(dateIso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateIso));
}

export function productSavings(product: Product): number {
  return product.originalPrice - product.price;
}

export function shortDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}
