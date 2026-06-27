import { Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, type } from "@/constants/theme";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({ value, min = 1, max, onChange }: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
        style={[styles.button, !canDecrease && styles.disabled]}
      >
        <Minus size={16} color={canDecrease ? colors.primary[600] : colors.neutral[400]} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
        style={[styles.button, !canIncrease && styles.disabled]}
      >
        <Plus size={16} color={canIncrease ? colors.primary[600] : colors.neutral[400]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
    overflow: "hidden",
    backgroundColor: colors.primary[50]
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  disabled: {
    backgroundColor: colors.neutral[100]
  },
  value: {
    minWidth: 34,
    textAlign: "center",
    color: colors.neutral[800],
    ...type.bodyMd,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: spacing.xs
  }
});
