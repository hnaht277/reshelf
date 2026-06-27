import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Leaf,
  MapPin,
  ShoppingCart,
  Star
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { getProductById } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import type { Product, RootStackParamList } from "@/types";
import {
  formatCurrency,
  formatExactDate,
  formatTimeLeft,
  getFreshnessStatus,
  productSavings,
  shortDistance
} from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

export function ProductDetailScreen({ navigation, route }: Props) {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const add = useCartStore((state) => state.add);
  const showToast = useToastStore((state) => state.show);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProductById(route.params.productId).then((item) => {
      if (!mounted) return;
      setProduct(item);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [route.params.productId]);

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  const freshness = getFreshnessStatus(product.expiryDate);

  const handleAdd = () => {
    add(product, quantity);
    showToast("Added to cart", `${product.name} x ${quantity}`);
  };

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <View style={styles.hero}>
          <Image source={{ uri: product.imageUrl }} style={styles.heroImage} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.62)"]} style={styles.scrim} />
          <View style={[styles.heroTop, { top: insets.top + spacing.sm }]}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={styles.circleButton}
            >
              <ArrowLeft color={colors.neutral[900]} size={22} strokeWidth={1.5} />
            </Pressable>
            <Pressable
              accessibilityLabel="Save product"
              accessibilityRole="button"
              onPress={() => setSaved((current) => !current)}
              style={styles.circleButton}
            >
              <Heart
                color={saved ? colors.danger : colors.neutral[900]}
                fill={saved ? colors.danger : "transparent"}
                size={22}
                strokeWidth={1.5}
              />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <Badge label={`-${product.discount}%`} tone="danger" />
            <Text numberOfLines={2} style={styles.heroTitle}>
              {product.name}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Badge label={formatTimeLeft(product.expiryDate)} freshness={freshness} />
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.original}>{formatCurrency(product.originalPrice)}</Text>
            <Text style={styles.savings}>Save {formatCurrency(productSavings(product))}</Text>
          </View>
          <Text style={styles.exactDate}>Best before {formatExactDate(product.expiryDate)}</Text>

          <View style={styles.sellerCard}>
            <Image source={{ uri: product.seller.avatarUrl }} style={styles.avatar} />
            <View style={styles.sellerBody}>
              <View style={styles.verifiedRow}>
                <Text style={styles.sellerName}>{product.seller.name}</Text>
                {product.seller.verified ? <CheckCircle2 color={colors.primary[600]} size={16} /> : null}
              </View>
              <View style={styles.metaRow}>
                <Star size={14} color={colors.warning} fill={colors.warning} />
                <Text style={styles.meta}>{product.seller.rating.toFixed(1)}</Text>
                <MapPin size={14} color={colors.neutral[500]} />
                <Text style={styles.meta}>{shortDistance(product.seller.distanceKm)}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.quantityRow}>
            <View>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <Text style={styles.stock}>Only {product.stock} left</Text>
            </View>
            <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} />
          </View>

          <View style={styles.impactCard}>
            <Leaf color={colors.impact} size={24} strokeWidth={1.5} />
            <Text style={styles.impactText}>
              Buying this saves about {(product.co2Savings * quantity).toFixed(1)} kg CO2.
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Toggle why it is on Reshelf"
            accessibilityRole="button"
            onPress={() => setExpanded((current) => !current)}
            style={styles.collapsible}
          >
            <View style={styles.collapsibleHeader}>
              <Text style={styles.sectionLabel}>Why it is on Reshelf</Text>
              {expanded ? (
                <ChevronUp color={colors.neutral[600]} size={20} />
              ) : (
                <ChevronDown color={colors.neutral[600]} size={20} />
              )}
            </View>
            {expanded ? <Text style={styles.reason}>{product.reason}</Text> : null}
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button label="Add to Cart" onPress={handleAdd} icon={ShoppingCart} style={styles.actionButton} />
        <Button
          label="Buy Now"
          variant="secondary"
          style={styles.actionButton}
          onPress={() => {
            handleAdd();
            navigation.navigate("MainTabs", { screen: "Cart" });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral[50]
  },
  loading: {
    ...type.bodyLg,
    color: colors.neutral[600],
    padding: spacing.lg
  },
  content: {
    backgroundColor: colors.neutral[50]
  },
  hero: {
    height: 320,
    backgroundColor: colors.neutral[100]
  },
  heroImage: {
    width: "100%",
    height: "100%"
  },
  scrim: {
    ...StyleSheet.absoluteFillObject
  },
  heroTop: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    ...shadows.md
  },
  heroBottom: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    gap: spacing.sm
  },
  heroTitle: {
    ...type.headingLg,
    color: colors.neutral[0]
  },
  body: {
    padding: spacing.lg,
    gap: spacing.base
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  price: {
    ...type.priceLg,
    color: colors.primary[700]
  },
  original: {
    ...type.bodyMd,
    color: colors.neutral[400],
    textDecorationLine: "line-through",
    marginBottom: 4
  },
  savings: {
    ...type.bodySm,
    color: colors.primary[700],
    marginBottom: 5
  },
  exactDate: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.neutral[100]
  },
  sellerBody: {
    flex: 1,
    gap: spacing.xs
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  sellerName: {
    ...type.bodyLg,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[800]
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  meta: {
    ...type.bodySm,
    color: colors.neutral[500]
  },
  description: {
    ...type.bodyLg,
    color: colors.neutral[600]
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionLabel: {
    ...type.bodyLg,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[800]
  },
  stock: {
    ...type.bodySm,
    color: colors.danger
  },
  impactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.impactLight
  },
  impactText: {
    flex: 1,
    ...type.bodyMd,
    color: colors.neutral[700]
  },
  collapsible: {
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  collapsibleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  reason: {
    ...type.bodyMd,
    color: colors.neutral[600],
    marginTop: spacing.sm
  },
  actions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.xl
  },
  actionButton: {
    flex: 1
  }
});
