import { StyleSheet, Text, View } from "react-native";
import { colors, freshnessStyles, radius, spacing, type } from "@/constants/theme";
import type { FreshnessStatus } from "@/types";

type BadgeProps = {
  label: string;
  tone?: "danger" | "success" | "info" | "impact" | "neutral";
  freshness?: FreshnessStatus;
};

export function Badge({ label, tone = "neutral", freshness }: BadgeProps) {
  const palette = freshness ? freshnessStyles[freshness] : tonePalette(tone);

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

function tonePalette(tone: NonNullable<BadgeProps["tone"]>) {
  switch (tone) {
    case "danger":
      return { bg: colors.danger, text: colors.neutral[0], border: colors.danger };
    case "success":
      return { bg: colors.successLight, text: colors.primary[700], border: colors.primary[200] };
    case "info":
      return { bg: colors.infoLight, text: colors.info, border: colors.infoLight };
    case "impact":
      return { bg: colors.impactLight, text: colors.impact, border: colors.impactLight };
    case "neutral":
    default:
      return { bg: colors.neutral[100], text: colors.neutral[600], border: colors.neutral[200] };
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  label: {
    ...type.badge
  }
});
