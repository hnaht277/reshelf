import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Grid2X2,
  LayoutList,
  Leaf,
  LockKeyhole,
  LogOut,
  Tag,
  X
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfilePageHeader } from "@/components/ProfilePageHeader";
import { Button } from "@/components/ui/Button";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useToastStore } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";
import type { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const preferences = useUserStore((state) => state.preferences);
  const setLayout = useUserStore((state) => state.setLayout);
  const setPreference = useUserStore((state) => state.setPreference);
  const changePassword = useUserStore((state) => state.changePassword);
  const logout = useUserStore((state) => state.logout);
  const showToast = useToastStore((state) => state.show);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const signOut = () => {
    logout();
    showToast("Signed out", "You have been returned to the login screen.");
  };

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.cardList}>
            <Pressable
              accessibilityLabel="Change password"
              accessibilityRole="button"
              onPress={() => setPasswordModalVisible(true)}
              style={[styles.settingRow, styles.lastRow]}
            >
              <View style={styles.iconWrap}>
                <LockKeyhole color={colors.primary[700]} size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>Change password</Text>
                <Text style={styles.rowDescription}>Update your account password securely.</Text>
              </View>
              <ChevronRight color={colors.neutral[400]} size={20} strokeWidth={1.5} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable
            accessibilityLabel="Sign out"
            accessibilityRole="button"
            onPress={signOut}
            style={({ pressed }) => [styles.signOutCard, pressed && styles.signOutPressed]}
          >
            <View style={styles.signOutIcon}>
              <LogOut color={colors.danger} size={20} strokeWidth={1.5} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.signOutTitle}>Sign out</Text>
              <Text style={styles.rowDescription}>Leave this session and return to login.</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footnote}>
          These preferences apply to your current Reshelf session.
        </Text>
      </ScrollView>

      <ChangePasswordModal
        changePassword={changePassword}
        onClose={() => setPasswordModalVisible(false)}
        onSuccess={(message) => {
          setPasswordModalVisible(false);
          showToast("Password updated", message);
        }}
        visible={passwordModalVisible}
      />
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

function ChangePasswordModal({
  visible,
  onClose,
  onSuccess,
  changePassword
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<{ ok: boolean; message: string }>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setError("");
    setSecure(true);
    onClose();
  };

  const submit = async () => {
    setError("");
    if (nextPassword !== confirmPassword) {
      setError("New password confirmation does not match.");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, nextPassword);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setSecure(true);
    onSuccess(result.message);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalSafe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Change password</Text>
              <Text style={styles.modalSubtitle}>Use at least 8 characters for the new password.</Text>
            </View>
            <Pressable
              accessibilityLabel="Close change password"
              accessibilityRole="button"
              onPress={close}
              style={styles.closeButton}
            >
              <X color={colors.neutral[700]} size={22} strokeWidth={1.5} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <PasswordField
              label="Current password"
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              secure={secure}
              value={currentPassword}
            />
            <PasswordField
              label="New password"
              onChangeText={setNextPassword}
              placeholder="New password"
              secure={secure}
              value={nextPassword}
            />
            <PasswordField
              label="Confirm new password"
              onChangeText={setConfirmPassword}
              placeholder="Repeat new password"
              rightAction={
                <Pressable
                  accessibilityLabel={secure ? "Show passwords" : "Hide passwords"}
                  accessibilityRole="button"
                  onPress={() => setSecure((current) => !current)}
                >
                  {secure ? (
                    <Eye color={colors.neutral[400]} size={20} strokeWidth={1.5} />
                  ) : (
                    <EyeOff color={colors.neutral[400]} size={20} strokeWidth={1.5} />
                  )}
                </Pressable>
              }
              secure={secure}
              value={confirmPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button label="Cancel" variant="secondary" onPress={close} style={styles.modalAction} />
            <Button label="Save Password" loading={loading} onPress={() => void submit()} style={styles.modalAction} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  rightAction
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secure: boolean;
  rightAction?: React.ReactNode;
}) {
  return (
    <View style={styles.passwordField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <LockKeyhole color={colors.neutral[400]} size={20} strokeWidth={1.5} />
        <TextInput
          accessibilityLabel={label}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[300]}
          secureTextEntry={secure}
          style={styles.input}
          value={value}
        />
        {rightAction}
      </View>
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
  footnote: { ...type.bodySm, color: colors.neutral[400], textAlign: "center", paddingHorizontal: spacing.xl },
  modalSafe: { flex: 1, backgroundColor: colors.neutral[50] },
  keyboardView: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.base, padding: spacing.lg },
  modalTitle: { ...type.headingLg, color: colors.neutral[900] },
  modalSubtitle: { ...type.bodyMd, color: colors.neutral[500], marginTop: spacing.xs },
  closeButton: { width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.neutral[0], ...shadows.sm },
  modalContent: { flexGrow: 1, padding: spacing.lg, gap: spacing.base },
  passwordField: { gap: spacing.sm },
  fieldLabel: { ...type.bodySm, color: colors.neutral[700], fontFamily: "Inter_600SemiBold" },
  inputWrap: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.neutral[200], backgroundColor: colors.neutral[0] },
  input: { flex: 1, ...type.bodyMd, color: colors.neutral[800] },
  error: { ...type.bodySm, color: colors.danger },
  modalActions: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, backgroundColor: colors.neutral[0], ...shadows.xl },
  modalAction: { flex: 1 },
  signOutCard: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.base, borderRadius: radius.lg, backgroundColor: colors.neutral[0], ...shadows.md },
  signOutPressed: { opacity: 0.76 },
  signOutIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: radius.full, backgroundColor: colors.dangerLight },
  signOutTitle: { ...type.bodyLg, color: colors.danger, fontFamily: "Inter_600SemiBold" }
});
