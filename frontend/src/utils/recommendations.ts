import type { Order, Product } from "@/types";

export type ProductSuggestion = {
  product: Product;
  reason: string;
};

/**
 * Builds a lightweight preference profile from successful orders. This is kept
 * deterministic for the prototype, but mirrors the inputs an AI recommender
 * would receive from the API: category affinity, seller affinity, and recency.
 */
export function getProductSuggestions(
  products: Product[],
  orders: Order[],
  limit = 4
): ProductSuggestion[] {
  const categoryAffinity = new Map<Product["category"], number>();
  const sellerAffinity = new Map<string, number>();
  const purchasedProductIds = new Set<string>();
  const now = Date.now();

  for (const order of orders) {
    if (order.status === "cancelled") continue;

    const ageInDays = Math.max(0, (now - new Date(order.placedAt).getTime()) / 86_400_000);
    const recencyWeight = 1 / (1 + ageInDays / 30);

    for (const item of order.items) {
      const preferenceWeight = item.quantity * recencyWeight;
      purchasedProductIds.add(item.product.id);
      categoryAffinity.set(
        item.product.category,
        (categoryAffinity.get(item.product.category) ?? 0) + preferenceWeight
      );
      sellerAffinity.set(
        item.product.seller.id,
        (sellerAffinity.get(item.product.seller.id) ?? 0) + preferenceWeight
      );
    }
  }

  return products
    .filter(
      (product) =>
        product.stock > 0 &&
        new Date(product.expiryDate).getTime() > now &&
        !purchasedProductIds.has(product.id)
    )
    .map((product) => {
      const categoryScore = categoryAffinity.get(product.category) ?? 0;
      const sellerScore = sellerAffinity.get(product.seller.id) ?? 0;
      const score =
        categoryScore * 3 +
        sellerScore * 2 +
        product.discount / 100 +
        1 / (1 + product.seller.distanceKm);

      const reason =
        sellerScore > categoryScore
          ? `You have enjoyed rescues from ${product.seller.name} before, so we think this nearby deal could be a good fit.`
          : categoryScore > 0
            ? `Your order history shows that you often rescue ${product.category.toLowerCase()} products, and this is one of the strongest available matches.`
            : "This popular rescue is nearby, in stock, and offers a strong discount compared with similar available products.";

      return { product, reason, score };
    })
    .sort((a, b) => b.score - a.score || b.product.discount - a.product.discount)
    .slice(0, limit)
    .map(({ product, reason }) => ({ product, reason }));
}
