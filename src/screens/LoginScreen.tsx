import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff, Leaf, LockKeyhole, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
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

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const showToast = useToastStore((state) => state.show);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("reshelf123");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast("Signed in", result.message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.primary[500], colors.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.logo}>
              <Leaf color={colors.primary[700]} size={34} strokeWidth={1.7} />
            </View>
            <Text style={styles.brand}>Reshelf</Text>
            <Text style={styles.heroText}>Rescue more. Waste less.</Text>
          </LinearGradient>

          <View style={styles.card}>
            <View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to continue rescuing local deals.</Text>
            </View>

            <AuthField
              autoCapitalize="none"
              icon={Mail}
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <AuthField
              icon={LockKeyhole}
              label="Password"
              onChangeText={setPassword}
              placeholder="Your password"
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityLabel="Forgot password"
              accessibilityRole="button"
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Button label="Sign In" loading={loading} onPress={() => void submit()} />

            <View style={styles.demoHint}>
              <Image source={{ uri: user.avatarUrl }} style={styles.demoAvatar} />
              <Text style={styles.demoText}>
                Prototype account: {user.email} / reshelf123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: typeof Mail;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  secureTextEntry?: boolean;
  rightAction?: React.ReactNode;
};

function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  rightAction
}: AuthFieldProps) {
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
  hero: {
    minHeight: 210,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    ...shadows.lg
  },
  logo: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius["2xl"],
    backgroundColor: colors.neutral[0]
  },
  brand: { ...type.displayLg, color: colors.neutral[0] },
  heroText: { ...type.bodyLg, color: colors.primary[50] },
  card: {
    gap: spacing.base,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.neutral[0],
    ...shadows.md
  },
  title: { ...type.headingLg, color: colors.neutral[900] },
  subtitle: { ...type.bodyMd, color: colors.neutral[500], marginTop: spacing.xs },
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
  forgot: { alignSelf: "flex-end", minHeight: 32, justifyContent: "center" },
  forgotText: { ...type.bodyMd, color: colors.primary[700], fontFamily: "Inter_600SemiBold" },
  error: { ...type.bodySm, color: colors.danger },
  demoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary[50]
  },
  demoAvatar: { width: 34, height: 34, borderRadius: radius.full },
  demoText: { flex: 1, ...type.bodySm, color: colors.primary[800] }
});
