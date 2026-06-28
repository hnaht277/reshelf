import { Trash2 } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import type { CartItem } from "@/types";
import { formatCurrency, formatTimeLeft } from "@/utils/format";

type CartItemRowProps = {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text numberOfLines={2} style={styles.title}>
            {item.product.name}
          </Text>
          <Pressable
            accessibilityLabel={`Remove ${item.product.name}`}
            accessibilityRole="button"
            onPress={onRemove}
            style={styles.remove}
          >
            <Trash2 size={20} color={colors.danger} strokeWidth={1.5} />
          </Pressable>
        </View>
        <Text style={styles.meta}>{formatTimeLeft(item.product.expiryDate)}</Text>
        <View style={styles.bottom}>
          <QuantityStepper
            max={item.product.stock}
            value={item.quantity}
            onChange={onQuantityChange}
          />
          <View style={styles.priceBlock}>
            <Text style={styles.price}>
              {formatCurrency(item.product.price * item.quantity)}
            </Text>
            <Text style={styles.meta}>
              {formatCurrency(item.product.price)} x {item.quantity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    ...shadows.md
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[100]
  },
  body: {
    flex: 1,
    gap: spacing.sm
  },
  top: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start"
  },
  title: {
    flex: 1,
    ...type.bodyLg,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[800]
  },
  remove: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
    marginRight: -10
  },
  meta: {
    ...type.bodySm,
    color: colors.neutral[500]
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  priceBlock: {
    alignItems: "flex-end"
  },
  price: {
    ...type.bodyLg,
    fontFamily: "Inter_700Bold",
    color: colors.primary[700]
  }
});
