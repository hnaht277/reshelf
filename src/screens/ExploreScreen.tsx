import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Compass, SlidersHorizontal } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Chip } from "@/components/ui/Chip";
import { categories, colors, spacing, type } from "@/constants/theme";
import { products } from "@/data/products";
import { useDebounce } from "@/hooks/useDebounce";
import type { Category, Product, RootStackParamList } from "@/types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function ExploreScreen() {
  const navigation = useNavigation<Navigation>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [refreshing, setRefreshing] = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!refreshing) return;
    const timer = setTimeout(() => setRefreshing(false), 450);
    return () => clearTimeout(timer);
  }, [refreshing]);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return products
      .filter((product) => category === "All" || product.category === category)
      .filter(
        (product) =>
          term.length === 0 ||
          product.name.toLowerCase().includes(term) ||
          product.seller.name.toLowerCase().includes(term)
      )
      .sort((a, b) => a.seller.distanceKm - b.seller.distanceKm);
  }, [category, debounced]);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Product>
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            tintColor={colors.primary[500]}
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Explore</Text>
                <Text style={styles.subtitle}>Nearby sellers with rescue-ready inventory.</Text>
              </View>
              <SlidersHorizontal color={colors.primary[700]} size={28} strokeWidth={1.5} />
            </View>
            <SearchBar value={query} onChange={setQuery} placeholder="Search nearby deals..." />
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => (
                <Chip label={item} active={category === item} onPress={() => setCategory(item)} />
              )}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            mode="list"
            onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon={Compass}
            title="Nothing nearby yet"
            message="Try widening the category or search term for more local rescue options."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral[50]
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 112
  },
  header: {
    gap: spacing.base,
    marginBottom: spacing.base
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.base
  },
  title: {
    ...type.displayMd,
    color: colors.neutral[900]
  },
  subtitle: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  chips: {
    gap: spacing.sm
  },
  separator: {
    height: spacing.md
  }
});
