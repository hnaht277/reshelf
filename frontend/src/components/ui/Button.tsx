import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, radius, spacing, type } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<{
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  icon?: LucideIcon;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  small = false,
  icon: Icon,
  accessibilityLabel,
  style
}: ButtonProps) {
  const palette = getPalette(variant, disabled);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : styles.standard,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: palette.borderWidth,
          opacity: disabled ? 0.8 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }]
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon color={palette.text} size={20} strokeWidth={1.5} /> : null}
          <Text style={[styles.label, small ? type.bodyMd : type.bodyLg, { color: palette.text }]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function getPalette(variant: ButtonVariant, disabled: boolean) {
  if (disabled) {
    return {
      bg: colors.neutral[200],
      text: colors.neutral[400],
      border: colors.neutral[200],
      borderWidth: 0
    };
  }
  switch (variant) {
    case "secondary":
      return {
        bg: "transparent",
        text: colors.primary[600],
        border: colors.primary[500],
        borderWidth: 1.5
      };
    case "ghost":
      return {
        bg: "transparent",
        text: colors.neutral[600],
        border: "transparent",
        borderWidth: 0
      };
    case "danger":
      return {
        bg: colors.danger,
        text: colors.neutral[0],
        border: colors.danger,
        borderWidth: 0
      };
    case "primary":
    default:
      return {
        bg: colors.primary[500],
        text: colors.neutral[0],
        border: colors.primary[500],
        borderWidth: 0
      };
  }
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing.base
  },
  standard: {
    height: 52
  },
  small: {
    height: 40
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  label: {
    fontFamily: "Inter_600SemiBold"
  }
});
