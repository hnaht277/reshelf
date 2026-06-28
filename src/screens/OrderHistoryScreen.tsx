import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, CheckCircle2, Clock3, Leaf, PackageCheck, RotateCcw, XCircle } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useToastStore } from "@/store/useToastStore";
import type { Order, OrderStatus, RootStackParamList } from "@/types";
import { formatCurrency } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "OrderHistory">;
type Filter = "All" | "Active" | "Completed";

export function OrderHistoryScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const orders = useOrderStore((state) => state.orders);
  const add = useCartStore((state) => state.add);
  const showToast = useToastStore((state) => state.show);
  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (filter === "Active") return order.status === "ready";
        if (filter === "Completed") return order.status !== "ready";
        return true;
      }),
    [filter, orders]
  );

  const reorder = (order: Order) => {
    order.items.forEach((item) => add(item.product, item.quantity));
    showToast("Added to cart", `${order.items.length} products from ${order.id}`);
    navigation.navigate("MainTabs", { screen: "Cart" });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Order History" subtitle={`${orders.length} rescue orders`} onBack={navigation.goBack} />

        <View style={styles.filters}>
          {(["All", "Active", "Completed"] as Filter[]).map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === item }}
              onPress={() => setFilter(item)}
              style={[styles.filter, filter === item && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.orders}>
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpen={() => navigation.navigate("OrderDetail", { orderId: order.id })}
              onReorder={() => reorder(order)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScreenHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.back}>
        <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
      </Pressable>
      <View style={styles.headerText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function OrderCard({ order, onOpen, onReorder }: { order: Order; onOpen: () => void; onReorder: () => void }) {
  const presentation = statusPresentation[order.status];
  const StatusIcon = presentation.icon;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Pressable
      accessibilityLabel={`Open order ${order.id}`}
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>Order {order.id}</Text>
          <Text style={styles.date}>
            {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.placedAt))}
          </Text>
        </View>
        <View style={[styles.status, { backgroundColor: presentation.background }]}>
          <StatusIcon color={presentation.color} size={15} strokeWidth={1.75} />
          <Text style={[styles.statusText, { color: presentation.color }]}>{presentation.label}</Text>
        </View>
      </View>

      <View style={styles.itemSummary}>
        <View style={styles.imageStack}>
          {order.items.slice(0, 3).map((item, index) => (
            <Image key={item.product.id} source={{ uri: item.product.imageUrl }} style={[styles.itemImage, index > 0 && styles.overlap]} />
          ))}
        </View>
        <View style={styles.itemText}>
          <Text numberOfLines={1} style={styles.itemNames}>{order.items.map((item) => item.product.name).join(", ")}</Text>
          <Text style={styles.itemCount}>{itemCount} {itemCount === 1 ? "item" : "items"}</Text>
        </View>
      </View>

      <View style={styles.impactRow}>
        <Leaf color={colors.impact} size={17} strokeWidth={1.5} />
        <Text style={styles.impactText}>{order.co2Saved.toFixed(1)} kg CO2 saved</Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>

      {order.status !== "cancelled" ? (
        <Button label="Order Again" icon={RotateCcw} variant="secondary" small onPress={onReorder} />
      ) : null}
    </Pressable>
  );
}

const statusPresentation: Record<OrderStatus, { label: string; icon: typeof Clock3; color: string; background: string }> = {
  ready: { label: "Ready for pickup", icon: PackageCheck, color: colors.info, background: colors.infoLight },
  delivered: { label: "Completed", icon: CheckCircle2, color: colors.primary[700], background: colors.successLight },
  cancelled: { label: "Cancelled", icon: XCircle, color: colors.danger, background: colors.dangerLight }
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  back: { width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.neutral[0], ...shadows.sm },
  headerText: { flex: 1 },
  title: { ...type.displayMd, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500] },
  filters: { flexDirection: "row", padding: spacing.xs, gap: spacing.xs, borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  filter: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center", borderRadius: radius.sm },
  filterActive: { backgroundColor: colors.neutral[0], ...shadows.sm },
  filterText: { ...type.bodyMd, color: colors.neutral[500], fontFamily: "Inter_600SemiBold" },
  filterTextActive: { color: colors.primary[700] },
  orders: { gap: spacing.md },
  card: { gap: spacing.md, padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  cardPressed: { transform: [{ scale: 0.98 }], ...shadows.sm },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm },
  orderId: { ...type.headingSm, color: colors.neutral[800] },
  date: { ...type.bodySm, color: colors.neutral[500], marginTop: spacing.xs },
  status: { flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.full },
  statusText: { ...type.badge },
  itemSummary: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  imageStack: { flexDirection: "row", paddingLeft: 8 },
  itemImage: { width: 48, height: 48, marginLeft: -8, borderRadius: radius.md, borderWidth: 2, borderColor: colors.neutral[0], backgroundColor: colors.neutral[100] },
  overlap: { marginLeft: -14 },
  itemText: { flex: 1 },
  itemNames: { ...type.bodyMd, color: colors.neutral[700], fontFamily: "Inter_600SemiBold" },
  itemCount: { ...type.bodySm, color: colors.neutral[500], marginTop: spacing.xs },
  impactRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.neutral[100] },
  impactText: { ...type.bodySm, color: colors.impact, flex: 1 },
  total: { ...type.headingSm, color: colors.neutral[900] }
});
