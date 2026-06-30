import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, KeyRound, Mail } from "lucide-react-native";
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

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const user = useUserStore((state) => state.user);
  const requestPasswordReset = useUserStore((state) => state.requestPasswordReset);
  const showToast = useToastStore((state) => state.show);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast("Reset code sent", `Prototype code: ${result.code ?? "246810"}`);
    navigation.navigate("ResetPassword", { email, code: result.code });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityLabel="Back to login"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={styles.back}
          >
            <ArrowLeft color={colors.neutral[800]} size={22} strokeWidth={1.5} />
          </Pressable>

          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <KeyRound color={colors.primary[700]} size={34} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we will send a mock reset code for this prototype.
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <Mail color={colors.neutral[400]} size={20} strokeWidth={1.5} />
                <TextInput
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.neutral[300]}
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Send Reset Code" loading={loading} onPress={() => void submit()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
