import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
};

export function ProfilePageHeader({ title, subtitle, onBack }: Props) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
      </Pressable>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral[0],
    ...shadows.sm
  },
  pressed: { opacity: 0.7 },
  text: { flex: 1 },
  title: { ...type.displayMd, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500] }
});
