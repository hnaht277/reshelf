import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { products } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useSavedStore } from "@/store/useSavedStore";
import { useToastStore } from "@/store/useToastStore";
import type { Product, RootStackParamList } from "@/types";
import { formatCurrency, formatTimeLeft, getFreshnessStatus } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "SavedItems">;

export function SavedItemsScreen({ navigation }: Props) {
  const savedIds = useSavedStore((state) => state.productIds);
  const remove = useSavedStore((state) => state.remove);
  const add = useCartStore((state) => state.add);
  const showToast = useToastStore((state) => state.show);
  const savedProducts = savedIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));

  const addToCart = (product: Product) => {
    add(product);
    showToast("Added to cart", product.name);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={navigation.goBack} style={styles.back}>
            <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Saved Items</Text>
            <Text style={styles.subtitle}>{savedProducts.length} rescues saved for later</Text>
          </View>
        </View>

        {savedProducts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            message="Tap the heart on a product to keep it close for later."
            actionLabel="Explore products"
            onAction={() => navigation.navigate("MainTabs", { screen: "Explore" })}
          />
        ) : (
          <View style={styles.list}>
            {savedProducts.map((product) => (
              <SavedItem
                key={product.id}
                product={product}
                onOpen={() => navigation.navigate("ProductDetail", { productId: product.id })}
                onRemove={() => {
                  remove(product.id);
                  showToast("Removed from saved items", product.name);
                }}
                onAdd={() => addToCart(product)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedItem({ product, onOpen, onRemove, onAdd }: { product: Product; onOpen: () => void; onRemove: () => void; onAdd: () => void }) {
  return (
    <View style={styles.card}>
      <Pressable accessibilityLabel={`Open ${product.name}`} accessibilityRole="button" onPress={onOpen} style={styles.productRow}>
        <View>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          <View style={styles.discount}><Badge label={`-${product.discount}%`} tone="danger" /></View>
        </View>
        <View style={styles.body}>
          <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
          <Text numberOfLines={1} style={styles.seller}>{product.seller.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.original}>{formatCurrency(product.originalPrice)}</Text>
          </View>
          <Badge label={formatTimeLeft(product.expiryDate)} freshness={getFreshnessStatus(product.expiryDate)} />
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable accessibilityLabel={`Remove ${product.name} from saved items`} accessibilityRole="button" onPress={onRemove} style={styles.removeButton}>
          <Trash2 color={colors.neutral[500]} size={20} strokeWidth={1.5} />
        </Pressable>
        <Button label="Add to Cart" icon={ShoppingCart} small onPress={onAdd} style={styles.addButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  back: { width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.neutral[0], ...shadows.sm },
  headerText: { flex: 1 },
  title: { ...type.displayMd, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500] },
  list: { gap: spacing.md },
  card: { padding: spacing.md, gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  productRow: { flexDirection: "row", gap: spacing.md },
  image: { width: 112, height: 112, borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  discount: { position: "absolute", left: spacing.sm, top: spacing.sm },
  body: { flex: 1, gap: spacing.xs, alignItems: "flex-start" },
  productName: { ...type.headingSm, color: colors.neutral[800] },
  seller: { ...type.bodySm, color: colors.neutral[500] },
  priceRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  price: { ...type.headingMd, color: colors.primary[700], fontFamily: "Inter_700Bold" },
  original: { ...type.bodySm, color: colors.neutral[400], textDecorationLine: "line-through" },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.neutral[100] },
  removeButton: { width: 44, height: 40, alignItems: "center", justifyContent: "center", borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  addButton: { flex: 1 }
});
