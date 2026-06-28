import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, type } from "@/constants/theme";

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityLabel={`Filter ${label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.primary[50] : colors.neutral[0],
          borderColor: active ? colors.primary[300] : colors.neutral[200],
          transform: [{ scale: pressed ? 0.97 : 1 }]
        }
      ]}
    >
      <Text style={[styles.label, { color: active ? colors.primary[700] : colors.neutral[600] }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    minWidth: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    ...type.badge
  }
});
