import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Award,
  Calendar,
  Camera,
  ChevronRight,
  CircleHelp,
  Heart,
  History,
  Leaf,
  Mail,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  type LucideIcon
} from "lucide-react-native";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useToastStore } from "@/store/useToastStore";
import { type Gender, useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/utils/format";
import type { RootStackParamList } from "@/types";

const quickLinks: Array<{
  label: string;
  icon: LucideIcon;
  route: "OrderHistory" | "SavedItems" | "Settings" | "Help" | "About";
}> = [
  { label: "Order History", icon: History, route: "OrderHistory" as const },
  { label: "Saved Items", icon: Heart, route: "SavedItems" as const },
  { label: "Settings", icon: Settings, route: "Settings" },
  { label: "Help", icon: CircleHelp, route: "Help" },
  { label: "About Reshelf", icon: Leaf, route: "About" }
];

const badges = [
  { label: "First Rescue", icon: Sparkles, earned: true },
  { label: "Weekly Warrior", icon: Award, earned: true },
  { label: "100 Meals Saved", icon: ShieldCheck, earned: false }
];

const genderOptions: Gender[] = ["Female", "Male", "Other", "Prefer not to say"];

type ProfileDraft = {
  fullName: string;
  birthDate: string;
  gender: Gender;
  avatarUrl: string;
  phone: string;
  email: string;
};

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);
  const impact = useUserStore((state) => state.impact);
  const updateUser = useUserStore((state) => state.updateUser);
  const showToast = useToastStore((state) => state.show);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(() => ({
    fullName: user.fullName,
    birthDate: user.birthDate,
    gender: user.gender,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    email: user.email
  }));

  const openEditor = () => {
    setDraft({
      fullName: user.fullName,
      birthDate: user.birthDate,
      gender: user.gender,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      email: user.email
    });
    setEditing(true);
  };

  const saveProfile = () => {
    updateUser({
      fullName: draft.fullName.trim() || user.fullName,
      birthDate: draft.birthDate.trim(),
      gender: draft.gender,
      avatarUrl: draft.avatarUrl.trim() || user.avatarUrl,
      phone: draft.phone.trim(),
      email: draft.email.trim()
    });
    setEditing(false);
    showToast("Profile updated", "Your personal details were saved");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityLabel="Edit profile information"
          accessibilityRole="button"
          onPress={openEditor}
          style={({ pressed }) => [styles.userCard, pressed && styles.userCardPressed]}
        >
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View style={styles.userBody}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.member}>Member since {user.memberSince}</Text>
            <Text style={styles.userMeta}>{user.email}</Text>
          </View>
          <View style={styles.profileIcon}>
            <ChevronRight color={colors.primary[700]} size={22} strokeWidth={1.5} />
          </View>
        </Pressable>

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
                    navigation.navigate(link.route);
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
      <EditProfileModal
        draft={draft}
        visible={editing}
        onCancel={() => setEditing(false)}
        onChange={setDraft}
        onSave={saveProfile}
      />
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

function EditProfileModal({
  draft,
  visible,
  onCancel,
  onChange,
  onSave
}: {
  draft: ProfileDraft;
  visible: boolean;
  onCancel: () => void;
  onChange: (draft: ProfileDraft) => void;
  onSave: () => void;
}) {
  const updateField = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    onChange({ ...draft, [key]: value });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.modalSafe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          style={styles.keyboardView}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Text style={styles.modalSubtitle}>Keep your pickup details accurate.</Text>
            </View>
            <Pressable
              accessibilityLabel="Close edit profile"
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.closeButton}
            >
              <X color={colors.neutral[700]} size={22} strokeWidth={1.5} />
            </Pressable>
          </View>

          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.formContent}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.avatarEditor}>
              <Image source={{ uri: draft.avatarUrl }} style={styles.editAvatar} />
              <View style={styles.avatarCopy}>
                <Text style={styles.avatarTitle}>Profile photo</Text>
                <Text style={styles.avatarHint}>Avatar changes are not available in this prototype.</Text>
              </View>
              <View style={styles.cameraIcon}>
                <Camera color={colors.primary[700]} size={20} strokeWidth={1.5} />
              </View>
            </View>

            <FormField
              label="Full name"
              value={draft.fullName}
              onChangeText={(value) => updateField("fullName", value)}
              placeholder="Your name"
              icon={UserRound}
              returnKeyType="next"
            />
            <FormField
              label="Date of birth"
              value={draft.birthDate}
              onChangeText={(value) => updateField("birthDate", value)}
              placeholder="YYYY-MM-DD"
              icon={Calendar}
              returnKeyType="next"
            />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderGrid}>
                {genderOptions.map((option) => {
                  const active = draft.gender === option;
                  return (
                    <Pressable
                      key={option}
                      accessibilityLabel={`Select ${option}`}
                      accessibilityRole="button"
                      onPress={() => updateField("gender", option)}
                      style={[styles.genderOption, active && styles.genderOptionActive]}
                    >
                      <Text style={[styles.genderText, active && styles.genderTextActive]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <FormField
              label="Phone number"
              value={draft.phone}
              onChangeText={(value) => updateField("phone", value)}
              placeholder="+1 555 000 0000"
              keyboardType="phone-pad"
              icon={Phone}
              returnKeyType="next"
            />
            <FormField
              label="Email"
              value={draft.email}
              onChangeText={(value) => updateField("email", value)}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={Mail}
              returnKeyType="done"
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.modalAction} />
            <Button label="Save Changes" onPress={onSave} style={styles.modalAction} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
  returnKeyType = "next"
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: LucideIcon;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <Icon color={colors.neutral[400]} size={20} strokeWidth={1.5} />
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[300]}
          returnKeyType={returnKeyType}
          style={styles.input}
          value={value}
        />
      </View>
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
  userCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
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
  userMeta: {
    ...type.bodySm,
    color: colors.neutral[400],
    marginTop: 2
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
  },
  modalSafe: {
    flex: 1,
    backgroundColor: colors.neutral[50]
  },
  keyboardView: {
    flex: 1
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    backgroundColor: colors.neutral[50]
  },
  modalTitle: {
    ...type.headingLg,
    color: colors.neutral[900]
  },
  modalSubtitle: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral[0],
    ...shadows.sm
  },
  formContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing["4xl"],
    gap: spacing.base
  },
  avatarEditor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  editAvatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.neutral[100]
  },
  avatarCopy: {
    flex: 1
  },
  avatarTitle: {
    ...type.bodyLg,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[800]
  },
  avatarHint: {
    ...type.bodySm,
    color: colors.neutral[500]
  },
  cameraIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary[50]
  },
  field: {
    gap: spacing.sm
  },
  fieldLabel: {
    ...type.bodySm,
    color: colors.neutral[700],
    fontFamily: "Inter_600SemiBold"
  },
  inputWrap: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[0]
  },
  input: {
    flex: 1,
    ...type.bodyMd,
    color: colors.neutral[800]
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  genderOption: {
    minHeight: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  genderOptionActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50]
  },
  genderText: {
    ...type.bodySm,
    color: colors.neutral[600]
  },
  genderTextActive: {
    color: colors.primary[700],
    fontFamily: "Inter_600SemiBold"
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    ...shadows.xl
  },
  modalAction: {
    flex: 1
  }
});
