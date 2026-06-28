import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Bell, Grid2X2, LayoutList, Leaf, Tag } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfilePageHeader } from "@/components/ProfilePageHeader";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useUserStore } from "@/store/useUserStore";
import type { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const preferences = useUserStore((state) => state.preferences);
  const setLayout = useUserStore((state) => state.setLayout);
  const setPreference = useUserStore((state) => state.setPreference);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfilePageHeader
          title="Settings"
          subtitle="Make Reshelf work your way"
          onBack={navigation.goBack}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browsing</Text>
          <View style={styles.card}>
            <Text style={styles.rowTitle}>Product layout</Text>
            <Text style={styles.rowDescription}>Choose how products appear on Home.</Text>
            <View style={styles.segmentedControl}>
              <LayoutOption
                active={preferences.layout === "grid"}
                icon={Grid2X2}
                label="Grid"
                onPress={() => setLayout("grid")}
              />
              <LayoutOption
                active={preferences.layout === "list"}
                icon={LayoutList}
                label="List"
                onPress={() => setLayout("list")}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.cardList}>
            <SettingToggle
              icon={Tag}
              title="Price drop alerts"
              description="Know when a saved item gets cheaper."
              value={preferences.priceDropAlerts}
              onValueChange={(value) => setPreference("priceDropAlerts", value)}
            />
            <SettingToggle
              icon={Bell}
              title="Expiry reminders"
              description="Get a reminder before saved food expires."
              value={preferences.expiryReminders}
              onValueChange={(value) => setPreference("expiryReminders", value)}
            />
            <SettingToggle
              icon={Leaf}
              title="Impact updates"
              description="Receive milestones and weekly rescue summaries."
              value={preferences.impactUpdates}
              onValueChange={(value) => setPreference("impactUpdates", value)}
              last
            />
          </View>
        </View>

        <Text style={styles.footnote}>
          These preferences apply to your current Reshelf session.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Icon = typeof Bell;

function LayoutOption({ active, icon: Icon, label, onPress }: { active: boolean; icon: Icon; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.layoutOption, active && styles.layoutOptionActive]}
    >
      <Icon color={active ? colors.primary[700] : colors.neutral[500]} size={18} />
      <Text style={[styles.layoutLabel, active && styles.layoutLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function SettingToggle({ icon: Icon, title, description, value, onValueChange, last = false }: { icon: Icon; title: string; description: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.settingRow, last && styles.lastRow]}>
      <View style={styles.iconWrap}>
        <Icon color={colors.primary[700]} size={20} strokeWidth={1.5} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        onValueChange={onValueChange}
        thumbColor={colors.neutral[0]}
        trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.xl },
  section: { gap: spacing.md },
  sectionTitle: { ...type.headingSm, color: colors.neutral[900] },
  card: { padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  cardList: { borderRadius: radius.lg, backgroundColor: colors.neutral[0], overflow: "hidden", ...shadows.md },
  rowTitle: { ...type.bodyLg, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  rowDescription: { ...type.bodyMd, color: colors.neutral[500], marginTop: 2 },
  segmentedControl: { flexDirection: "row", gap: spacing.sm, padding: spacing.xs, marginTop: spacing.base, borderRadius: radius.md, backgroundColor: colors.neutral[100] },
  layoutOption: { flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderRadius: radius.sm },
  layoutOptionActive: { backgroundColor: colors.neutral[0], ...shadows.sm },
  layoutLabel: { ...type.bodyMd, color: colors.neutral[500], fontFamily: "Inter_600SemiBold" },
  layoutLabelActive: { color: colors.primary[700] },
  settingRow: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  lastRow: { borderBottomWidth: 0 },
  iconWrap: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: radius.full, backgroundColor: colors.primary[50] },
  rowBody: { flex: 1 },
  footnote: { ...type.bodySm, color: colors.neutral[400], textAlign: "center", paddingHorizontal: spacing.xl }
});
