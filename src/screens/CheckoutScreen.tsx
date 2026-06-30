import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Check,
  Leaf,
  MapPin,
  Phone,
  Store,
  Tag
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { checkout } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useToastStore } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";
import type { CheckoutResult, RootStackParamList } from "@/types";
import { formatCurrency } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;
type Coupon = "RESCUE20" | "GREEN10";

const SERVICE_FEE = 15_000;
const ECO_DISCOUNT = 5_000;

export function CheckoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const savings = useCartStore((state) => state.savings());
  const itemCount = useCartStore((state) => state.itemCount());
  const clear = useCartStore((state) => state.clear);
  const addOrder = useOrderStore((state) => state.addOrder);
  const recordCheckout = useUserStore((state) => state.recordCheckout);
  const showToast = useToastStore((state) => state.show);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | undefined>();
  const [couponError, setCouponError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState<CheckoutResult>();

  const couponDiscount = coupon === "RESCUE20" ? Math.min(20_000, subtotal * 0.2) : coupon === "GREEN10" ? 10_000 : 0;
  const total = Math.max(0, subtotal + SERVICE_FEE - ECO_DISCOUNT - couponDiscount);
  const pickupSellers = useMemo(
    () => items.map((item) => item.product.seller).filter((seller, index, sellers) => sellers.findIndex((candidate) => candidate.id === seller.id) === index),
    [items]
  );

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase();
    if (normalized === "RESCUE20" || normalized === "GREEN10") {
      setCoupon(normalized);
      setCouponInput(normalized);
      setCouponError("");
      return;
    }
    setCoupon(undefined);
    setCouponError("That coupon is not valid. Try RESCUE20.");
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    setPlacingOrder(true);
    try {
      const orderedItems = items.map((item) => ({ ...item }));
      const result = await checkout(items);
      addOrder({
        id: result.orderId,
        placedAt: new Date().toISOString(),
        status: "ready",
        items: orderedItems,
        total,
        co2Saved: result.co2Saved
      });
      recordCheckout(result.itemsRescued, result.co2Saved, savings + couponDiscount + ECO_DISCOUNT);
      clear();
      setSuccess({ ...result, total });
      showToast("Order confirmed", `${result.itemsRescued} items rescued`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const viewOrderHistory = () => {
    setSuccess(undefined);
    navigation.replace("OrderHistory");
  };

  const continueShopping = () => {
    setSuccess(undefined);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs", params: { screen: "Home" } }]
    });
  };

  if (items.length === 0 && !success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Leaf color={colors.primary[700]} size={36} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyBody}>Add a rescue item before starting checkout.</Text>
          <Button label="Return to cart" onPress={() => navigation.navigate("MainTabs", { screen: "Cart" })} style={styles.emptyButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={navigation.goBack} style={styles.iconButton}>
            <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.8} />
          </Pressable>
          <Text style={styles.title}>Checkout</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <SectionHeader title={pickupSellers.length === 1 ? "Pickup location" : "Pickup locations"} />
          <View style={styles.card}>
            {pickupSellers.map((seller, index) => (
              <View key={seller.id} style={[styles.pickupRow, index > 0 && styles.rowDivider]}>
                <View style={styles.pickupIcon}>
                  <Store color={colors.primary[700]} size={20} strokeWidth={1.7} />
                </View>
                <View style={styles.pickupBody}>
                  <Text style={styles.pickupName}>{seller.name}</Text>
                  {seller.address ? (
                    <View style={styles.pickupDetail}>
                      <MapPin color={colors.neutral[400]} size={14} strokeWidth={1.5} />
                      <Text style={styles.pickupDetailText}>{seller.address}</Text>
                    </View>
                  ) : null}
                  {seller.phone ? (
                    <View style={styles.pickupDetail}>
                      <Phone color={colors.neutral[400]} size={14} strokeWidth={1.5} />
                      <Text style={styles.pickupDetailText}>{seller.phone}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <SectionHeader title={`Your products (${itemCount})`} action="Edit cart" onAction={navigation.goBack} />
          <View style={styles.card}>
            {items.map((item, index) => (
              <View key={item.product.id} style={[styles.productRow, index > 0 && styles.rowDivider]}>
                <Image source={{ uri: item.product.imageUrl }} style={styles.productImage} />
                <View style={styles.productBody}>
                  <Text numberOfLines={2} style={styles.productName}>{item.product.name}</Text>
                  <Text style={styles.productMeta}>{item.product.seller.name}</Text>
                  <Text style={styles.productQty}>Qty {item.quantity}</Text>
                </View>
                <Text style={styles.productPrice}>{formatCurrency(item.product.price * item.quantity)}</Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Coupon" />
          <View style={styles.cardPadding}>
            <View style={styles.couponRow}>
              <View style={styles.couponInputWrap}>
                <Tag color={coupon ? colors.primary[600] : colors.neutral[400]} size={19} />
                <TextInput
                  accessibilityLabel="Coupon code"
                  autoCapitalize="characters"
                  onChangeText={(value) => { setCouponInput(value); setCouponError(""); }}
                  onSubmitEditing={applyCoupon}
                  placeholder="Enter coupon code"
                  placeholderTextColor={colors.neutral[400]}
                  style={styles.couponInput}
                  value={couponInput}
                />
              </View>
              <Pressable accessibilityRole="button" onPress={applyCoupon} style={styles.applyButton}>
                <Text style={styles.applyText}>Apply</Text>
              </Pressable>
            </View>
            {coupon ? (
              <View style={styles.couponSuccess}>
                <Check color={colors.primary[700]} size={16} strokeWidth={2.5} />
                <Text style={styles.couponSuccessText}>{coupon} applied — you saved {formatCurrency(couponDiscount)}</Text>
              </View>
            ) : couponError ? <Text style={styles.couponError}>{couponError}</Text> : <Text style={styles.couponHint}>Try RESCUE20 for 20% off, up to {formatCurrency(20_000)}.</Text>}
          </View>

          <SectionHeader title="Payment summary" />
          <View style={styles.summaryCard}>
            <SummaryRow label="Item subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow label="Service fee" value={formatCurrency(SERVICE_FEE)} />
            <SummaryRow label="Eco discount" value={`−${formatCurrency(ECO_DISCOUNT)}`} accent />
            {couponDiscount > 0 ? <SummaryRow label={`Coupon (${coupon})`} value={`−${formatCurrency(couponDiscount)}`} accent /> : null}
            <View style={styles.summaryDivider} />
            <SummaryRow label="Total" value={formatCurrency(total)} total />
            <View style={styles.impactRow}>
              <Leaf color={colors.impact} size={16} />
              <Text style={styles.impactText}>You save {formatCurrency(savings + ECO_DISCOUNT + couponDiscount)} with this rescue</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.base) }]}>
          <View>
            <Text style={styles.footerLabel}>Total payment</Text>
            <Text style={styles.footerTotal}>{formatCurrency(total)}</Text>
          </View>
          <Button label="Place order" onPress={placeOrder} loading={placingOrder} disabled={items.length === 0} style={styles.placeButton} />
        </View>
      </KeyboardAvoidingView>

      <Modal visible={Boolean(success)} transparent animationType="fade" onRequestClose={() => undefined}>
        <View style={styles.modalBackdrop}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}><Check color={colors.neutral[0]} size={36} strokeWidth={2.5} /></View>
            <Text style={styles.successTitle}>Order placed!</Text>
            <Text style={styles.successBody}>Your rescue order {success?.orderId} is confirmed and saved. Check Order History for pickup details.</Text>
            <View style={styles.successTotalRow}>
              <Text style={styles.successTotalLabel}>Paid</Text>
              <Text style={styles.successTotal}>{formatCurrency(success?.total ?? 0)}</Text>
            </View>
            <Button label="View order history" onPress={viewOrderHistory} style={styles.successButton} />
            <Pressable accessibilityRole="button" onPress={continueShopping}>
              <Text style={styles.continueText}>Continue shopping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Pressable accessibilityRole="button" onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>;
}

function SummaryRow({ label, value, accent, total }: { label: string; value: string; accent?: boolean; total?: boolean }) {
  return <View style={styles.summaryRow}><Text style={[styles.summaryLabel, total && styles.summaryTotalLabel]}>{label}</Text><Text style={[styles.summaryValue, accent && styles.summaryAccent, total && styles.summaryTotalValue]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  flex: { flex: 1 },
  header: { height: 60, paddingHorizontal: spacing.base, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.neutral[0], borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { ...type.headingMd, color: colors.neutral[900] },
  content: { padding: spacing.base, paddingBottom: spacing.xl, gap: spacing.md },
  sectionHeader: { marginTop: spacing.xs, minHeight: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { ...type.headingSm, color: colors.neutral[900] },
  sectionAction: { ...type.bodyMd, color: colors.primary[700], fontFamily: "Inter_600SemiBold" },
  card: { backgroundColor: colors.neutral[0], borderRadius: radius.lg, paddingHorizontal: spacing.base, ...shadows.sm },
  cardPadding: { backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.base, gap: spacing.md, ...shadows.sm },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.neutral[100] },
  pickupRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, paddingVertical: spacing.base },
  pickupIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primary[50], alignItems: "center", justifyContent: "center" },
  pickupBody: { flex: 1 },
  pickupName: { ...type.bodyLg, color: colors.neutral[900], fontFamily: "Inter_700Bold" },
  pickupDetail: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs, marginTop: spacing.xs },
  pickupDetailText: { flex: 1, ...type.bodySm, color: colors.neutral[500] },
  productRow: { minHeight: 92, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  productImage: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  productBody: { flex: 1, gap: 2 },
  productName: { ...type.bodyMd, color: colors.neutral[900], fontFamily: "Inter_600SemiBold" },
  productMeta: { ...type.bodySm, color: colors.neutral[500] },
  productQty: { ...type.bodySm, color: colors.neutral[700] },
  productPrice: { ...type.bodyMd, color: colors.neutral[900], fontFamily: "Inter_700Bold" },
  couponRow: { flexDirection: "row", gap: spacing.sm },
  couponInputWrap: { flex: 1, height: 48, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.neutral[200], flexDirection: "row", alignItems: "center", gap: spacing.sm },
  couponInput: { flex: 1, ...type.bodyMd, color: colors.neutral[900], paddingVertical: 0 },
  applyButton: { height: 48, paddingHorizontal: spacing.base, borderRadius: radius.md, backgroundColor: colors.primary[50], alignItems: "center", justifyContent: "center" },
  applyText: { ...type.bodyMd, color: colors.primary[700], fontFamily: "Inter_700Bold" },
  couponHint: { ...type.bodySm, color: colors.neutral[500] },
  couponError: { ...type.bodySm, color: colors.danger },
  couponSuccess: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  couponSuccessText: { flex: 1, ...type.bodySm, color: colors.primary[700] },
  summaryCard: { backgroundColor: colors.neutral[0], borderRadius: radius.lg, padding: spacing.base, gap: spacing.md, ...shadows.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { ...type.bodyMd, color: colors.neutral[600] },
  summaryValue: { ...type.bodyMd, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  summaryAccent: { color: colors.primary[700] },
  summaryDivider: { height: 1, backgroundColor: colors.neutral[200] },
  summaryTotalLabel: { ...type.headingSm, color: colors.neutral[900] },
  summaryTotalValue: { ...type.priceLg, color: colors.neutral[900] },
  impactRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.impactLight },
  impactText: { flex: 1, ...type.bodySm, color: colors.impact },
  footer: { paddingHorizontal: spacing.base, paddingTop: spacing.md, backgroundColor: colors.neutral[0], borderTopWidth: 1, borderTopColor: colors.neutral[100], flexDirection: "row", alignItems: "center", gap: spacing.base, ...shadows.lg },
  footerLabel: { ...type.bodySm, color: colors.neutral[500] },
  footerTotal: { ...type.headingMd, color: colors.neutral[900] },
  placeButton: { flex: 1 },
  empty: { flex: 1, padding: spacing.xl, alignItems: "center", justifyContent: "center", gap: spacing.md },
  emptyIcon: { width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.primary[50], alignItems: "center", justifyContent: "center" },
  emptyTitle: { ...type.headingLg, color: colors.neutral[900] },
  emptyBody: { ...type.bodyMd, color: colors.neutral[500], textAlign: "center" },
  emptyButton: { alignSelf: "stretch", marginTop: spacing.sm },
  modalBackdrop: { flex: 1, padding: spacing.lg, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(23,23,23,0.48)" },
  successModal: { width: "100%", padding: spacing.xl, borderRadius: radius["2xl"], backgroundColor: colors.neutral[0], alignItems: "center", gap: spacing.base, ...shadows.xl },
  successIcon: { width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.primary[500], alignItems: "center", justifyContent: "center" },
  successTitle: { ...type.headingLg, color: colors.neutral[900] },
  successBody: { ...type.bodyMd, color: colors.neutral[600], textAlign: "center" },
  successTotalRow: { alignSelf: "stretch", padding: spacing.base, borderRadius: radius.md, backgroundColor: colors.neutral[50], flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  successTotalLabel: { ...type.bodyMd, color: colors.neutral[600] },
  successTotal: { ...type.headingSm, color: colors.neutral[900] },
  successButton: { alignSelf: "stretch" },
  continueText: { ...type.bodyMd, color: colors.primary[700], fontFamily: "Inter_600SemiBold" }
});
