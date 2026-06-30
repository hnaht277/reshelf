import { Clock, MapPin, Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import type { Product } from "@/types";
import { formatCurrency, formatTimeLeft, getFreshnessStatus, shortDistance } from "@/utils/format";

type ProductCardProps = {
  product: Product;
  mode?: "grid" | "list";
  grow?: boolean;
  onPress: () => void;
};

export function ProductCard({ product, mode = "grid", grow = true, onPress }: ProductCardProps) {
  if (mode === "list") {
    return (
      <Pressable
        accessibilityLabel={`Open ${product.name}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.listCard, pressed && styles.pressed]}
      >
        <Image source={{ uri: product.imageUrl }} style={styles.listImage} />
        <View style={styles.listBody}>
          <Text numberOfLines={2} style={styles.title}>
            {product.name}
          </Text>
          <View style={styles.metaRow}>
            <Text numberOfLines={1} style={styles.meta}>
              {product.seller.name}
            </Text>
            <Star size={12} color={colors.warning} fill={colors.warning} />
            <Text style={styles.meta}>{product.seller.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.original}>{formatCurrency(product.originalPrice)}</Text>
            <Badge label={`-${product.discount}%`} tone="danger" />
          </View>
          <View style={styles.metaRow}>
            <Clock size={14} color={colors.neutral[500]} />
            <Text style={styles.meta}>{formatTimeLeft(product.expiryDate)}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  const freshness = getFreshnessStatus(product.expiryDate);

  return (
    <Pressable
      accessibilityLabel={`Open ${product.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.gridCard, !grow && styles.noGrow, pressed && styles.pressed]}
    >
      <View>
        <Image source={{ uri: product.imageUrl }} style={styles.gridImage} />
        <View style={styles.discount}>
          <Badge label={`-${product.discount}%`} tone="danger" />
        </View>
      </View>
      <View style={styles.gridBody}>
        <Text numberOfLines={2} style={styles.title}>
          {product.name}
        </Text>
        <View style={styles.metaRow}>
          <MapPin size={13} color={colors.neutral[400]} />
          <Text numberOfLines={1} style={styles.meta}>
            {product.seller.name} · {shortDistance(product.seller.distanceKm)}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={styles.original}>{formatCurrency(product.originalPrice)}</Text>
        </View>
        <Badge label={formatTimeLeft(product.expiryDate)} freshness={freshness} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    overflow: "hidden",
    ...shadows.md
  },
  noGrow: {
    flex: 0
  },
  listCard: {
    minHeight: 120,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.md,
    ...shadows.md
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    ...shadows.sm
  },
  gridImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: colors.neutral[100]
  },
  listImage: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[100]
  },
  discount: {
    position: "absolute",
    left: spacing.sm,
    top: spacing.sm
  },
  gridBody: {
    padding: spacing.md,
    gap: spacing.sm
  },
  listBody: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: "center"
  },
  title: {
    ...type.headingSm,
    color: colors.neutral[800]
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  meta: {
    ...type.bodySm,
    color: colors.neutral[500],
    flexShrink: 1
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  price: {
    ...type.headingMd,
    color: colors.primary[700],
    fontFamily: "Inter_700Bold"
  },
  original: {
    ...type.bodySm,
    color: colors.neutral[400],
    textDecorationLine: "line-through"
  }
});
