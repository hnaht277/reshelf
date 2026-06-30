import { Trash2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import type { CartItem } from "@/types";
import { formatCurrency, formatTimeLeft } from "@/utils/format";

type CartItemRowProps = {
  item: CartItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItemRow({
  item,
  isOpen,
  onOpen,
  onClose,
  onQuantityChange,
  onRemove
}: CartItemRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  useEffect(() => {
    if (!isOpen) swipeableRef.current?.close();
  }, [isOpen]);

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.swipeable}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpenStartDrag={onOpen}
      onSwipeableClose={onClose}
      renderRightActions={() => (
        <Pressable
          accessibilityLabel={`Remove ${item.product.name}`}
          accessibilityRole="button"
          onPress={onRemove}
          style={styles.removeAction}
        >
          <Trash2 size={22} color={colors.neutral[0]} strokeWidth={1.75} />
          <Text style={styles.removeText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Image source={{ uri: item.product.imageUrl }} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.top}>
            <Text numberOfLines={2} style={styles.title}>
              {item.product.name}
            </Text>
          </View>
          <Text style={styles.meta}>{formatTimeLeft(item.product.expiryDate)}</Text>
          <View style={styles.bottom}>
            <QuantityStepper
              min={0}
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
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeable: {
    borderRadius: radius.lg,
    ...shadows.md
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg
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
  removeAction: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.danger
  },
  removeText: {
    ...type.badge,
    color: colors.neutral[0]
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
