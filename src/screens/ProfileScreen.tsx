import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Award, ChevronRight, CircleHelp, Heart, History, Leaf, Settings, ShieldCheck, Sparkles, UserRound, type LucideIcon } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/utils/format";
import type { RootStackParamList } from "@/types";

const quickLinks: Array<{
  label: string;
  icon: LucideIcon;
  route?: "OrderHistory" | "SavedItems";
}> = [
  { label: "Order History", icon: History, route: "OrderHistory" as const },
  { label: "Saved Items", icon: Heart, route: "SavedItems" as const },
  { label: "Settings", icon: Settings },
  { label: "Help", icon: CircleHelp },
  { label: "About Reshelf", icon: Leaf }
];

const badges = [
  { label: "First Rescue", icon: Sparkles, earned: true },
  { label: "Weekly Warrior", icon: Award, earned: true },
  { label: "100 Meals Saved", icon: ShieldCheck, earned: false }
];

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);
  const impact = useUserStore((state) => state.impact);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View style={styles.userBody}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.member}>Member since {user.memberSince}</Text>
          </View>
          <View style={styles.profileIcon}>
            <UserRound color={colors.primary[700]} size={22} strokeWidth={1.5} />
          </View>
        </View>

        <LinearGradient
          colors={[colors.impact, "#6D28D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.impactCard}
        >
          <View style={styles.impactTitleRow}>
            <Leaf color={colors.neutral[0]} size={26} strokeWidth={1.5} />
            <Text style={styles.impactTitle}>Your Impact</Text>
          </View>
          <View style={styles.statsGrid}>
            <StatTile value={`${impact.mealsRescued}`} label="Meals Rescued" />
            <StatTile value={`${impact.co2SavedKg.toFixed(1)}kg`} label="CO2 Saved" />
            <StatTile value={formatCurrency(impact.moneySaved)} label="Money Saved" />
            <StatTile value={`${impact.streakDays}`} label="Day Streak" />
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eco Badges</Text>
          <View style={styles.badges}>
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <View key={badge.label} style={[styles.badge, !badge.earned && styles.badgeLocked]}>
                  <Icon
                    color={badge.earned ? colors.primary[700] : colors.neutral[400]}
                    size={24}
                    strokeWidth={1.5}
                  />
                  <Text style={[styles.badgeLabel, !badge.earned && styles.lockedText]}>
                    {badge.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.links}>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Pressable
                  key={link.label}
                  accessibilityLabel={link.label}
                  accessibilityRole="button"
                  onPress={() => {
                    if (link.route) navigation.navigate(link.route);
                  }}
                  style={styles.link}
                >
                  <View style={styles.linkIcon}>
                    <Icon color={colors.primary[700]} size={20} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.linkLabel}>{link.label}</Text>
                  <ChevronRight color={colors.neutral[400]} size={20} strokeWidth={1.5} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    gap: spacing.xl
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.neutral[100]
  },
  userBody: {
    flex: 1
  },
  name: {
    ...type.headingMd,
    color: colors.neutral[900]
  },
  member: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50]
  },
  impactCard: {
    gap: spacing.base,
    padding: spacing.lg,
    borderRadius: radius.xl
  },
  impactTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  impactTitle: {
    ...type.headingMd,
    color: colors.neutral[0]
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  statTile: {
    width: "47%",
    minHeight: 96,
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: spacing.md
  },
  statValue: {
    ...type.displayLg,
    color: colors.neutral[0]
  },
  statLabel: {
    ...type.bodySm,
    color: "rgba(255,255,255,0.78)"
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    ...type.headingMd,
    color: colors.neutral[900]
  },
  badges: {
    flexDirection: "row",
    gap: spacing.md
  },
  badge: {
    flex: 1,
    minHeight: 104,
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primary[50],
    padding: spacing.sm
  },
  badgeLocked: {
    backgroundColor: colors.neutral[100]
  },
  badgeLabel: {
    ...type.bodySm,
    color: colors.primary[800],
    textAlign: "center"
  },
  lockedText: {
    color: colors.neutral[500]
  },
  links: {
    gap: spacing.sm
  },
  link: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[0],
    ...shadows.sm
  },
  linkIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary[50]
  },
  linkLabel: {
    flex: 1,
    ...type.bodyLg,
    color: colors.neutral[800]
  }
});
