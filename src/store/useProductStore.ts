import { create } from "zustand";
import { getProducts } from "@/services/api";
import type { Category, Product } from "@/types";

type ProductStore = {
  products: Product[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  category: Category;
  query: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setCategory: (category: Category) => void;
  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
};

async function loadPage(page: number, category: Category, query: string) {
  return getProducts(page, { category, query });
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  page: 1,
  hasMore: true,
  loading: false,
  refreshing: false,
  category: "All",
  query: "",
  recentSearches: ["yogurt", "bakery", "juice"],
  setQuery: (query) =>
    set((state) => ({
      query,
      recentSearches:
        query.trim().length > 1
          ? [query.trim(), ...state.recentSearches.filter((term) => term !== query.trim())].slice(
              0,
              4
            )
          : state.recentSearches
    })),
  setCategory: (category) => set({ category }),
  fetchFirstPage: async () => {
    const { category, query } = get();
    set({ loading: true, page: 1 });
    const result = await loadPage(1, category, query);
    set({ products: result.items, hasMore: result.hasMore, loading: false, page: 1 });
  },
  fetchNextPage: async () => {
    const { category, query, page, hasMore, loading } = get();
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    set({ loading: true });
    const result = await loadPage(nextPage, category, query);
    set((state) => ({
      products: [...state.products, ...result.items],
      hasMore: result.hasMore,
      loading: false,
      page: nextPage
    }));
  },
  refresh: async () => {
    const { category, query } = get();
    set({ refreshing: true, page: 1 });
    const result = await loadPage(1, category, query);
    set({ products: result.items, hasMore: result.hasMore, refreshing: false, page: 1 });
  }
}));
