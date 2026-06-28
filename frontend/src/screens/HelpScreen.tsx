import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChevronDown, CircleHelp, Mail, MessageCircle, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfilePageHeader } from "@/components/ProfilePageHeader";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import type { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Help">;

const faqs = [
  {
    question: "How does a Reshelf rescue work?",
    answer: "Choose a discounted item, add it to your cart, and complete checkout. Your order details will show when and where to collect it."
  },
  {
    question: "Why are products discounted?",
    answer: "Products may be close to their best-before date, overstocked, or have imperfect packaging. Sellers explain the reason on each product page."
  },
  {
    question: "Can I cancel or change an order?",
    answer: "Contact the seller as soon as possible. Whether an order can be changed depends on its status and the seller’s pickup policy."
  },
  {
    question: "How is my environmental impact calculated?",
    answer: "Reshelf estimates avoided food waste and CO2 savings from the items you rescue. These figures are estimates designed to show your progress over time."
  }
];

export function HelpScreen({ navigation }: Props) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const emailSupport = () => {
    void Linking.openURL("mailto:support@reshelf.app?subject=Reshelf%20support");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfilePageHeader
          title="Help"
          subtitle="Answers for a smoother rescue"
          onBack={navigation.goBack}
        />

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <CircleHelp color={colors.primary[700]} size={30} strokeWidth={1.5} />
          </View>
          <View style={styles.heroBody}>
            <Text style={styles.heroTitle}>How can we help?</Text>
            <Text style={styles.heroText}>Find quick answers below or contact the Reshelf support team.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently asked questions</Text>
          <View style={styles.faqCard}>
            {faqs.map((faq, index) => {
              const isOpen = openQuestion === index;
              return (
                <Pressable
                  key={faq.question}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isOpen }}
                  onPress={() => setOpenQuestion(isOpen ? null : index)}
                  style={[styles.faqItem, index === faqs.length - 1 && styles.lastFaq]}
                >
                  <View style={styles.questionRow}>
                    <Text style={styles.question}>{faq.question}</Text>
                    <ChevronDown
                      color={colors.neutral[500]}
                      size={20}
                      style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
                    />
                  </View>
                  {isOpen ? <Text style={styles.answer}>{faq.answer}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More support</Text>
          <Pressable accessibilityRole="button" onPress={emailSupport} style={({ pressed }) => [styles.supportCard, pressed && styles.pressed]}>
            <View style={styles.supportIcon}>
              <Mail color={colors.primary[700]} size={22} strokeWidth={1.5} />
            </View>
            <View style={styles.supportBody}>
              <Text style={styles.supportTitle}>Email support</Text>
              <Text style={styles.supportText}>support@reshelf.app</Text>
            </View>
            <MessageCircle color={colors.neutral[400]} size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.tip}>
            <Sparkles color={colors.impact} size={18} strokeWidth={1.5} />
            <Text style={styles.tipText}>Include your order number when asking about a rescue.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"], gap: spacing.xl },
  hero: { flexDirection: "row", alignItems: "center", gap: spacing.base, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.primary[50] },
  heroIcon: { width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: radius.full, backgroundColor: colors.neutral[0] },
  heroBody: { flex: 1 },
  heroTitle: { ...type.headingMd, color: colors.primary[900] },
  heroText: { ...type.bodyMd, color: colors.primary[800], marginTop: spacing.xs },
  section: { gap: spacing.md },
  sectionTitle: { ...type.headingSm, color: colors.neutral[900] },
  faqCard: { borderRadius: radius.lg, backgroundColor: colors.neutral[0], overflow: "hidden", ...shadows.md },
  faqItem: { padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  lastFaq: { borderBottomWidth: 0 },
  questionRow: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: spacing.md },
  question: { flex: 1, ...type.bodyLg, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  answer: { ...type.bodyMd, color: colors.neutral[600], marginTop: spacing.md, paddingRight: spacing.xl },
  supportCard: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  pressed: { opacity: 0.75 },
  supportIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: radius.full, backgroundColor: colors.primary[50] },
  supportBody: { flex: 1 },
  supportTitle: { ...type.bodyLg, color: colors.neutral[800], fontFamily: "Inter_600SemiBold" },
  supportText: { ...type.bodyMd, color: colors.neutral[500] },
  tip: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.sm },
  tipText: { flex: 1, ...type.bodySm, color: colors.neutral[500] }
});
