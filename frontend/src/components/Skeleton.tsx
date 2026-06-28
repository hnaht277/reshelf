import { StyleSheet, View, type DimensionValue } from "react-native";
import { colors, radius } from "@/constants/theme";

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
  rounded?: number;
};

export function Skeleton({ width = "100%", height, rounded = radius.md }: SkeletonProps) {
  return <View style={[styles.base, { width, height, borderRadius: rounded }]} />;
}

export function ProductSkeletonGrid() {
  return (
    <View style={styles.card}>
      <Skeleton height={120} rounded={radius.xl} />
      <Skeleton height={20} width="85%" />
      <Skeleton height={14} width="65%" />
      <Skeleton height={28} width="55%" />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.neutral[100]
  },
  card: {
    flex: 1,
    gap: 10,
    padding: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0]
  }
});
