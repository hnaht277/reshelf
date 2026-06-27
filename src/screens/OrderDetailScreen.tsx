import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  Store,
  XCircle
} from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { orders } from "@/data/orders";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import type { Order, OrderStatus, RootStackParamList } from "@/types";
import { formatCurrency } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

export function OrderDetailScreen({ navigation, route }: Props) {
  const order = orders.find((candidate) => candidate.id === route.params.orderId);
  const add = useCartStore((state) => state.add);
  const showToast = useToastStore((state) => state.show);

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <ReceiptText color={colors.neutral[400]} size={44} strokeWidth={1.5} />
          <Text style={styles.sectionTitle}>Order not found</Text>
          <Button label="Back to orders" onPress={navigation.goBack} />
        </View>
      </SafeAreaView>
    );
  }

  const itemSubtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalSubtotal = order.items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const fees = Math.max(0, order.total - itemSubtotal);
  const presentation = statusPresentation[order.status];
  const StatusIcon = presentation.icon;
  const seller = order.items[0].product.seller;

  const reorder = () => {
    order.items.forEach((item) => add(item.product, item.quantity));
    showToast("Added to cart", `${order.items.length} products from ${order.id}`);
    navigation.navigate("MainTabs", { screen: "Cart" });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={styles.back}
          >
            <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Order Details</Text>
            <Text style={styles.subtitle}>Order {order.id}</Text>
          </View>
        </View>

        <View style={[styles.statusHero, { backgroundColor: presentation.background }]}>
          <View style={[styles.statusIcon, { backgroundColor: presentation.iconBackground }]}>
            <StatusIcon color={presentation.color} size={28} strokeWidth={1.5} />
          </View>
          <View style={styles.statusBody}>
            <Text style={[styles.statusTitle, { color: presentation.color }]}>{presentation.label}</Text>
            <Text style={styles.statusMessage}>{presentation.message}</Text>
          </View>
        </View>

        {order.status === "ready" ? (
          <View style={styles.pickupCode}>
            <Text style={styles.pickupEyebrow}>PICKUP CODE</Text>
            <Text style={styles.code}>{order.id.slice(-4)}</Text>
            <Text style={styles.codeHint}>Show this code to the store team</Text>
          </View>
        ) : null}

        <Section title="Order progress">
          <View style={styles.timeline}>
            <TimelineStep label="Order confirmed" detail={formatDateTime(order.placedAt)} complete />
            <TimelineStep
              label={order.status === "cancelled" ? "Order cancelled" : "Prepared by store"}
              detail={order.status === "cancelled" ? "The order was not fulfilled" : "Your rescue was packed with care"}
              complete
              last={order.status === "cancelled"}
              cancelled={order.status === "cancelled"}
            />
            {order.status !== "cancelled" ? (
              <TimelineStep
                label={order.status === "ready" ? "Ready for pickup" : "Order completed"}
                detail={order.status === "ready" ? "Collect before 7:00 PM today" : "Thanks for rescuing these items"}
                complete
                last
              />
            ) : null}
          </View>
        </Section>

        <Section title={`Items (${order.items.reduce((sum, item) => sum + item.quantity, 0)})`}>
          <View style={styles.items}>
            {order.items.map((item, index) => (
              <Pressable
                key={item.product.id}
                accessibilityLabel={`Open ${item.product.name}`}
                accessibilityRole="button"
                onPress={() => navigation.navigate("ProductDetail", { productId: item.product.id })}
                style={[styles.item, index > 0 && styles.itemBorder]}
              >
                <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
                <View style={styles.itemBody}>
                  <Text numberOfLines={2} style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.quantity}>Qty {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatCurrency(item.product.price * item.quantity)}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title={order.status === "delivered" ? "Fulfilled by" : "Pickup details"}>
          <View style={styles.storeRow}>
            <View style={styles.storeIcon}>
              <Store color={colors.primary[700]} size={22} strokeWidth={1.5} />
            </View>
            <View style={styles.storeBody}>
              <Text style={styles.storeName}>{seller.name}</Text>
              <View style={styles.addressRow}>
                <MapPin color={colors.neutral[400]} size={14} strokeWidth={1.5} />
                <Text style={styles.address}>128 Nguyễn Trãi, Quận 5 · cách {seller.distanceKm.toFixed(1)} km</Text>
              </View>
            </View>
          </View>
        </Section>

        <Section title="Payment summary">
          <SummaryRow label="Item subtotal" value={formatCurrency(itemSubtotal)} />
          {fees > 0 ? <SummaryRow label="Service fee" value={formatCurrency(fees)} /> : null}
          <View style={styles.divider} />
          <SummaryRow label="Total" value={formatCurrency(order.total)} emphasized />
          <View style={styles.savingsRow}>
            <Leaf color={colors.impact} size={18} strokeWidth={1.5} />
            <Text style={styles.savingsText}>
              You saved {formatCurrency(Math.max(0, originalSubtotal - itemSubtotal))} and {order.co2Saved.toFixed(1)} kg CO2
            </Text>
          </View>
        </Section>

        {order.status !== "cancelled" ? (
          <Button label="Order Again" icon={RotateCcw} variant="secondary" onPress={reorder} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function TimelineStep({
  label,
  detail,
  complete,
  last = false,
  cancelled = false
}: {
  label: string;
  detail: string;
  complete: boolean;
  last?: boolean;
  cancelled?: boolean;
}) {
  return (
    <View style={styles.timelineStep}>
      <View style={styles.timelineMarker}>
        <View style={[styles.timelineDot, cancelled && styles.cancelledDot]}>
          {cancelled ? (
            <XCircle color={colors.neutral[0]} size={16} strokeWidth={2} />
          ) : complete ? (
            <Check color={colors.neutral[0]} size={15} strokeWidth={2.5} />
          ) : null}
        </View>
        {!last ? <View style={styles.timelineLine} /> : null}
      </View>
      <View style={styles.timelineBody}>
        <Text style={styles.timelineLabel}>{label}</Text>
        <Text style={styles.timelineDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function SummaryRow({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, emphasized && styles.summaryEmphasis]}>{label}</Text>
      <Text style={[styles.summaryValue, emphasized && styles.summaryEmphasis]}>{value}</Text>
    </View>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

const statusPresentation: Record<
  OrderStatus,
  { label: string; message: string; icon: typeof Clock3; color: string; background: string; iconBackground: string }
> = {
  ready: {
    label: "Ready for pickup",
    message: "Your rescue is packed and waiting at the store.",
    icon: PackageCheck,
    color: colors.info,
    background: colors.infoLight,
    iconBackground: "#DBEAFE"
  },
  delivered: {
    label: "Order completed",
    message: "These items found a home instead of going to waste.",
    icon: CheckCircle2,
    color: colors.primary[700],
    background: colors.successLight,
    iconBackground: colors.primary[100]
  },
  cancelled: {
    label: "Order cancelled",
    message: "This order was cancelled and was not added to your impact.",
    icon: XCircle,
    color: colors.danger,
    background: colors.dangerLight,
    iconBackground: "#FEE2E2"
  }
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  back: { width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.neutral[0], ...shadows.sm },
  headerText: { flex: 1 },
  title: { ...type.displayMd, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500] },
  statusHero: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderRadius: radius.lg },
  statusIcon: { width: 52, height: 52, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  statusBody: { flex: 1 },
  statusTitle: { ...type.headingSm },
  statusMessage: { ...type.bodyMd, color: colors.neutral[600], marginTop: spacing.xs },
  pickupCode: { alignItems: "center", gap: spacing.xs, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.neutral[900], ...shadows.md },
  pickupEyebrow: { ...type.badge, color: colors.primary[300], letterSpacing: 1.5 },
  code: { ...type.displayLg, color: colors.neutral[0], letterSpacing: 8 },
  codeHint: { ...type.bodySm, color: colors.neutral[300] },
  section: { gap: spacing.md, padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  sectionTitle: { ...type.headingSm, color: colors.neutral[800] },
  timeline: { gap: 0 },
  timelineStep: { minHeight: 64, flexDirection: "row", gap: spacing.md },
  timelineMarker: { width: 24, alignItems: "center" },
  timelineDot: { width: 24, height: 24, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary[500] },
  cancelledDot: { backgroundColor: colors.danger },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.primary[200] },
  timelineBody: { flex: 1, paddingBottom: spacing.md },
  timelineLabel: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  timelineDetail: { ...type.bodySm, color: colors.neutral[500], marginTop: spacing.xs },
  items: { gap: 0 },
  item: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.neutral[100] },
  itemImage: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  itemBody: { flex: 1 },
  itemName: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  quantity: { ...type.bodySm, color: colors.neutral[500], marginTop: spacing.xs },
  itemPrice: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  storeRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  storeIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary[50] },
  storeBody: { flex: 1 },
  storeName: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  addressRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs },
  address: { flex: 1, ...type.bodySm, color: colors.neutral[500] },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  summaryLabel: { ...type.bodyMd, color: colors.neutral[600] },
  summaryValue: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  summaryEmphasis: { ...type.headingSm, color: colors.neutral[900] },
  divider: { height: 1, backgroundColor: colors.neutral[100] },
  savingsRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.impactLight },
  savingsText: { flex: 1, ...type.bodySm, color: colors.impact },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.base, padding: spacing.lg }
});
