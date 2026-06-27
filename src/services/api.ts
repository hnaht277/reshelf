import { notifications } from "@/data/notifications";
import { products } from "@/data/products";
import type { AppNotification, CartItem, Category, CheckoutResult, Product } from "@/types";

const PAGE_SIZE = 10;

type ProductFilters = {
  category: Category;
  query: string;
};

function delay(): Promise<void> {
  const ms = 300 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterProducts(filters: ProductFilters): Product[] {
  const query = filters.query.trim().toLowerCase();
  return products.filter((product) => {
    const categoryMatch = filters.category === "All" || product.category === filters.category;
    const queryMatch =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.seller.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });
}

export async function getProducts(
  page: number,
  filters: ProductFilters
): Promise<{ items: Product[]; hasMore: boolean }> {
  await delay();
  const filtered = filterProducts(filters);
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    hasMore: start + PAGE_SIZE < filtered.length
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay();
  return products.find((product) => product.id === id);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay();
  if (query.trim().toLowerCase() === "empty") return [];
  return filterProducts({ category: "All", query });
}

export async function getNotifications(): Promise<AppNotification[]> {
  await delay();
  return notifications;
}

export async function checkout(cart: CartItem[]): Promise<CheckoutResult> {
  await delay();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 15000;
  return {
    orderId: `RS-${Math.floor(100000 + Math.random() * 900000)}`,
    itemsRescued: cart.reduce((sum, item) => sum + item.quantity, 0),
    co2Saved: cart.reduce((sum, item) => sum + item.product.co2Savings * item.quantity, 0),
    total
  };
}
