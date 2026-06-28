import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
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
import { useUserStore } from "@/store/useUserStore";
import type { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "ResetPassword">;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const user = useUserStore((state) => state.user);
  const resetPassword = useUserStore((state) => state.resetPassword);
  const showToast = useToastStore((state) => state.show);
  const [email, setEmail] = useState(route.params?.email ?? user.email);
  const [code, setCode] = useState(route.params?.code ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, code, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast("Password reset", result.message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={styles.back}
          >
            <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
          </Pressable>

          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <LockKeyhole color={colors.primary[700]} size={34} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>Enter your reset code and choose a new password.</Text>

            <ResetField
              autoCapitalize="none"
              icon={Mail}
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <ResetField
              autoCapitalize="none"
              icon={KeyRound}
              keyboardType="number-pad"
              label="Reset code"
              onChangeText={setCode}
              placeholder="246810"
              value={code}
            />
            <ResetField
              icon={LockKeyhole}
              label="New password"
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              rightAction={
                <Pressable
                  accessibilityLabel={secure ? "Show password" : "Hide password"}
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
              secureTextEntry={secure}
              value={password}
            />
            <ResetField
              icon={LockKeyhole}
              label="Confirm password"
              onChangeText={setConfirmPassword}
              placeholder="Repeat new password"
              secureTextEntry={secure}
              value={confirmPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Reset Password" loading={loading} onPress={() => void submit()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ResetFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: typeof Mail;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoCapitalize?: "none" | "sentences";
  secureTextEntry?: boolean;
  rightAction?: React.ReactNode;
};

function ResetField({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  rightAction
}: ResetFieldProps) {
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
          secureTextEntry={secureTextEntry}
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
  keyboard: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, gap: spacing.xl, justifyContent: "center" },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral[0],
    ...shadows.sm
  },
  card: {
    gap: spacing.base,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius["2xl"],
    backgroundColor: colors.primary[50]
  },
  title: { ...type.headingLg, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500] },
  field: { gap: spacing.sm },
  fieldLabel: { ...type.bodySm, color: colors.neutral[700], fontFamily: "Inter_600SemiBold" },
  inputWrap: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50]
  },
  input: { flex: 1, ...type.bodyMd, color: colors.neutral[800] },
  error: { ...type.bodySm, color: colors.danger }
});
