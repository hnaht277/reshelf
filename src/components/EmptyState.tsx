import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, type } from "@/constants/theme";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon color={colors.primary[600]} size={40} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing["2xl"],
    gap: spacing.md
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50]
  },
  title: {
    ...type.headingMd,
    color: colors.neutral[800],
    textAlign: "center"
  },
  message: {
    ...type.bodyMd,
    color: colors.neutral[500],
    textAlign: "center"
  }
});
