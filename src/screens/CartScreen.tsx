import { LinearGradient } from "expo-linear-gradient";
import { Leaf, ShoppingBag } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItemRow } from "@/components/CartItemRow";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { checkout } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";
import type { CheckoutResult } from "@/types";
import { formatCurrency } from "@/utils/format";

const DELIVERY_FEE = 20000;
const ECO_DISCOUNT = 5000;

export function CartScreen() {
  const items = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal());
  const savings = useCartStore((state) => state.savings());
  const itemCount = useCartStore((state) => state.itemCount());
  const co2Saved = useCartStore((state) => state.co2Saved());
  const recordCheckout = useUserStore((state) => state.recordCheckout);
  const showToast = useToastStore((state) => state.show);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState<CheckoutResult | undefined>();

  const total = Math.max(0, subtotal + DELIVERY_FEE - ECO_DISCOUNT);

  const handleCheckout = async () => {
    setCheckingOut(true);
    const result = await checkout(items);
    recordCheckout(result.itemsRescued, result.co2Saved, savings);
    clear();
    setCheckingOut(false);
    setSuccess({ ...result, total });
    showToast("Checkout complete", `${result.itemsRescued} items rescued`);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Cart</Text>
            <Text style={styles.subtitle}>{itemCount} rescue items selected</Text>
          </View>
          {items.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear cart" onPress={clear}>
              <Text style={styles.clear}>Clear All</Text>
            </Pressable>
          ) : null}
        </View>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is ready"
            message="Start rescuing nearby products and your impact will appear here."
          />
        ) : (
          <>
            <View style={styles.items}>
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onQuantityChange={(quantity) => updateQty(item.product.id, quantity)}
                  onRemove={() => remove(item.product.id)}
                />
              ))}
            </View>

            <LinearGradient
              colors={[colors.primary[500], "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.savingsCard}
            >
              <Leaf color={colors.neutral[0]} size={26} strokeWidth={1.5} />
              <Text style={styles.savingsText}>
                You are saving {formatCurrency(savings)} and rescuing {itemCount} items from waste.
              </Text>
            </LinearGradient>

            <View style={styles.summary}>
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow label="Delivery fee" value={formatCurrency(DELIVERY_FEE)} />
              <SummaryRow label="Eco-discount" value={`-${formatCurrency(ECO_DISCOUNT)}`} accent />
              <View style={styles.divider} />
              <SummaryRow label="Total" value={formatCurrency(total)} total />
              <Text style={styles.co2}>Estimated CO2 saved: {co2Saved.toFixed(1)} kg</Text>
            </View>

            <Button
              label="Proceed to Checkout"
              onPress={handleCheckout}
              loading={checkingOut}
              disabled={items.length === 0}
            />
          </>
        )}
      </ScrollView>

      <Modal visible={Boolean(success)} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Leaf color={colors.primary[700]} size={42} strokeWidth={1.5} />
            </View>
            <Text style={styles.successTitle}>Rescue confirmed</Text>
            <Text style={styles.successBody}>
              Order {success?.orderId} saved {success?.itemsRescued} items and about{" "}
              {success?.co2Saved.toFixed(1)} kg CO2.
            </Text>
            <Button label="Done" onPress={() => setSuccess(undefined)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
  total = false
}: {
  label: string;
  value: string;
  accent?: boolean;
  total?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, total && styles.totalText]}>{label}</Text>
      <Text style={[styles.summaryValue, accent && styles.accent, total && styles.totalText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral[50]
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 112,
    gap: spacing.base
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    ...type.displayMd,
    color: colors.neutral[900]
  },
  subtitle: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  clear: {
    ...type.bodyMd,
    color: colors.danger,
    fontFamily: "Inter_600SemiBold"
  },
  items: {
    gap: spacing.md
  },
  savingsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.lg
  },
  savingsText: {
    flex: 1,
    ...type.bodyLg,
    color: colors.neutral[0],
    fontFamily: "Inter_600SemiBold"
  },
  summary: {
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  summaryLabel: {
    ...type.bodyMd,
    color: colors.neutral[600]
  },
  summaryValue: {
    ...type.bodyMd,
    color: colors.neutral[800],
    fontFamily: "Inter_600SemiBold"
  },
  accent: {
    color: colors.primary[700]
  },
  totalText: {
    ...type.headingSm,
    color: colors.neutral[900]
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs
  },
  co2: {
    ...type.bodySm,
    color: colors.impact
  },
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(0,0,0,0.35)"
  },
  successModal: {
    width: "100%",
    gap: spacing.base,
    padding: spacing.xl,
    borderRadius: radius["2xl"],
    backgroundColor: colors.neutral[0],
    alignItems: "center",
    ...shadows.xl
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50]
  },
  successTitle: {
    ...type.headingLg,
    color: colors.neutral[900]
  },
  successBody: {
    ...type.bodyMd,
    color: colors.neutral[600],
    textAlign: "center"
  }
});
