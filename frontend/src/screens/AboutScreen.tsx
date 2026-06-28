import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HeartHandshake, Leaf, Recycle, ShieldCheck, Users } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfilePageHeader } from "@/components/ProfilePageHeader";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import type { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfilePageHeader
          title="About Reshelf"
          subtitle="Good food deserves another chance"
          onBack={navigation.goBack}
        />

        <View style={styles.brandCard}>
          <View style={styles.logo}>
            <Leaf color={colors.neutral[0]} size={38} strokeWidth={1.75} />
          </View>
          <Text style={styles.brandName}>Reshelf</Text>
          <Text style={styles.tagline}>Rescue more. Waste less.</Text>
          <View style={styles.versionPill}>
            <Text style={styles.version}>Version 0.1.0</Text>
          </View>
        </View>

        <View style={styles.storyCard}>
          <Text style={styles.sectionTitle}>Why we exist</Text>
          <Text style={styles.body}>
            Reshelf connects people with quality products that might otherwise go to waste. Every rescue helps local sellers recover value, helps shoppers save money, and keeps useful goods in circulation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What guides us</Text>
          <View style={styles.valuesCard}>
            <ValueRow
              icon={Recycle}
              title="Less waste"
              description="Make rescuing surplus products simple and rewarding."
            />
            <ValueRow
              icon={Users}
              title="Stronger communities"
              description="Connect neighbors with the local sellers around them."
            />
            <ValueRow
              icon={ShieldCheck}
              title="Clear choices"
              description="Show freshness, pricing, and rescue details upfront."
              last
            />
          </View>
        </View>

        <View style={styles.closingCard}>
          <HeartHandshake color={colors.impact} size={26} strokeWidth={1.5} />
          <Text style={styles.closingText}>Built for people who believe small choices can add up to meaningful change.</Text>
        </View>

        <Text style={styles.copyright}>© 2026 Reshelf</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type ValueIcon = typeof Leaf;

function ValueRow({ icon: Icon, title, description, last = false }: { icon: ValueIcon; title: string; description: string; last?: boolean }) {
  return (
    <View style={[styles.valueRow, last && styles.lastRow]}>
      <View style={styles.valueIcon}>
        <Icon color={colors.primary[700]} size={22} strokeWidth={1.5} />
      </View>
      <View style={styles.valueBody}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.xl },
  brandCard: { alignItems: "center", padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.primary[50] },
  logo: { width: 76, height: 76, alignItems: "center", justifyContent: "center", borderRadius: radius["2xl"], backgroundColor: colors.primary[600], ...shadows.md },
  brandName: { ...type.displayLg, color: colors.primary[900], marginTop: spacing.md },
  tagline: { ...type.bodyLg, color: colors.primary[700] },
  versionPill: { paddingHorizontal: spacing.md, paddingVertical: 6, marginTop: spacing.md, borderRadius: radius.full, backgroundColor: colors.neutral[0] },
  version: { ...type.badge, color: colors.neutral[500] },
  storyCard: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  section: { gap: spacing.md },
  sectionTitle: { ...type.headingSm, color: colors.neutral[900] },
  body: { ...type.bodyLg, color: colors.neutral[600] },
  valuesCard: { borderRadius: radius.lg, backgroundColor: colors.neutral[0], overflow: "hidden", ...shadows.md },
  valueRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  lastRow: { borderBottomWidth: 0 },
  valueIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: radius.full, backgroundColor: colors.primary[50] },
  valueBody: { flex: 1 },
  valueTitle: { ...type.bodyLg, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  valueDescription: { ...type.bodyMd, color: colors.neutral[500], marginTop: 2 },
  closingCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.impactLight },
  closingText: { flex: 1, ...type.bodyMd, color: colors.neutral[700] },
  copyright: { ...type.bodySm, color: colors.neutral[400], textAlign: "center" }
});
