import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Grid2X2, LayoutList, Leaf } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/Skeleton";
import { SearchBar } from "@/components/SearchBar";
import { categories, colors, radius, shadows, spacing, type } from "@/constants/theme";
import { products as allProducts } from "@/data/products";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductStore } from "@/store/useProductStore";
import { useUserStore } from "@/store/useUserStore";
import type { Product, RootStackParamList } from "@/types";
import { daysUntil } from "@/utils/format";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { width } = useWindowDimensions();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const user = useUserStore((state) => state.user);
  const impact = useUserStore((state) => state.impact);
  const layout = useUserStore((state) => state.preferences.layout);
  const setLayout = useUserStore((state) => state.setLayout);
  const {
    products,
    category,
    loading,
    refreshing,
    hasMore,
    recentSearches,
    setQuery,
    setCategory,
    fetchFirstPage,
    fetchNextPage,
    refresh
  } = useProductStore();

  useEffect(() => {
    setQuery(debouncedSearch);
    void fetchFirstPage();
  }, [category, debouncedSearch, fetchFirstPage, setQuery]);

  const expiringToday = useMemo(
    () => allProducts.filter((product) => daysUntil(product.expiryDate) === 0),
    []
  );

  const numColumns = layout === "grid" && width >= 720 ? 3 : layout === "grid" ? 2 : 1;
  const showSkeletons = loading && products.length === 0;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <FlatList
        key={`${layout}-${numColumns}`}
        data={showSkeletons ? [] : products}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        columnWrapperStyle={layout === "grid" ? styles.gridRow : undefined}
        refreshControl={
          <RefreshControl
            tintColor={colors.primary[500]}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        onEndReached={() => {
          if (hasMore) void fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <Header
            userName={user.firstName}
            meals={impact.mealsRescued}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            recentSearches={recentSearches}
            category={category}
            setCategory={setCategory}
            expiringToday={expiringToday}
            layout={layout}
            setLayout={setLayout}
            openProduct={(productId) => navigation.navigate("ProductDetail", { productId })}
          />
        }
        ListEmptyComponent={
          showSkeletons ? (
            <View style={layout === "grid" ? styles.gridRow : styles.skeletonList}>
              {Array.from({ length: numColumns * 3 }).map((_, index) => (
                <ProductSkeletonGrid key={index} />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={Leaf}
              title="No rescues found"
              message="Try a different search or category to uncover nearby deals."
              actionLabel="Reset filters"
              onAction={() => {
                setSearchInput("");
                setCategory("All");
              }}
            />
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            mode={layout}
            onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
          />
        )}
        ListFooterComponent={loading && products.length > 0 ? <Text style={styles.loading}>Loading more rescues...</Text> : null}
      />
    </SafeAreaView>
  );
}

type HeaderProps = {
  userName: string;
  meals: number;
  searchInput: string;
  setSearchInput: (value: string) => void;
  recentSearches: string[];
  category: string;
  setCategory: (category: (typeof categories)[number]) => void;
  expiringToday: Product[];
  layout: "grid" | "list";
  setLayout: (layout: "grid" | "list") => void;
  openProduct: (productId: string) => void;
};

function Header({
  userName,
  meals,
  searchInput,
  setSearchInput,
  recentSearches,
  category,
  setCategory,
  expiringToday,
  layout,
  setLayout,
  openProduct
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.greetingCard}>
        <View>
          <Text style={styles.eyebrow}>Fresh rescues nearby</Text>
          <Text style={styles.title}>Hi {userName}</Text>
          <Text style={styles.subtitle}>You have rescued {meals} meals so far.</Text>
        </View>
        <View style={styles.impactPill}>
          <Leaf color={colors.primary[700]} size={22} strokeWidth={1.5} />
          <Text style={styles.impactText}>{meals}</Text>
        </View>
      </View>

      <SearchBar value={searchInput} onChange={setSearchInput} />
      {searchInput.length === 0 ? (
        <View style={styles.recentRow}>
          <Text style={styles.recentLabel}>Recent</Text>
          {recentSearches.map((term) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Search ${term}`}
              key={term}
              onPress={() => setSearchInput(term)}
            >
              <Text style={styles.recentTerm}>{term}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
        contentContainerStyle={styles.chips}
      >
        {categories.map((item) => (
          <Chip
            key={item}
            label={item}
            active={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </ScrollView>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Expiring Today</Text>
        <Text style={styles.sectionHint}>Calm urgency, real savings</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
        contentContainerStyle={styles.carousel}
      >
        {expiringToday.map((product) => (
          <View key={product.id} style={styles.carouselCard}>
            <ProductCard product={product} onPress={() => openProduct(product.id)} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>All Products</Text>
        <View style={styles.layoutToggle}>
          <Pressable
            accessibilityLabel="Grid layout"
            accessibilityRole="button"
            onPress={() => setLayout("grid")}
            style={[styles.toggleButton, layout === "grid" && styles.toggleActive]}
          >
            <Grid2X2 size={18} color={layout === "grid" ? colors.primary[700] : colors.neutral[500]} />
          </Pressable>
          <Pressable
            accessibilityLabel="List layout"
            accessibilityRole="button"
            onPress={() => setLayout("list")}
            style={[styles.toggleButton, layout === "list" && styles.toggleActive]}
          >
            <LayoutList size={18} color={layout === "list" ? colors.primary[700] : colors.neutral[500]} />
          </Pressable>
        </View>
      </View>
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
    gap: spacing.md
  },
  header: {
    gap: spacing.base,
    marginBottom: spacing.sm
  },
  greetingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: colors.primary[50]
  },
  eyebrow: {
    ...type.bodySm,
    color: colors.primary[700]
  },
  title: {
    ...type.displayMd,
    color: colors.neutral[900]
  },
  subtitle: {
    ...type.bodyMd,
    color: colors.neutral[600]
  },
  impactPill: {
    minWidth: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  impactText: {
    ...type.badge,
    color: colors.primary[700]
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  recentLabel: {
    ...type.bodySm,
    color: colors.neutral[500]
  },
  recentTerm: {
    ...type.bodySm,
    color: colors.primary[700],
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full
  },
  chips: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  horizontalList: {
    marginHorizontal: -spacing.lg
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  sectionTitle: {
    ...type.headingMd,
    color: colors.neutral[800]
  },
  sectionHint: {
    ...type.bodySm,
    color: colors.neutral[500]
  },
  carousel: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs
  },
  carouselCard: {
    width: 190
  },
  layoutToggle: {
    height: 40,
    flexDirection: "row",
    padding: 3,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[100]
  },
  toggleButton: {
    width: 44,
    height: 34,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleActive: {
    backgroundColor: colors.neutral[0],
    ...shadows.sm
  },
  gridRow: {
    gap: spacing.md
  },
  skeletonList: {
    gap: spacing.md
  },
  loading: {
    ...type.bodySm,
    color: colors.neutral[500],
    textAlign: "center",
    padding: spacing.base
  }
});
