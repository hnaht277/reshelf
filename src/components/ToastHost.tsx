import { CheckCircle2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useToastStore } from "@/store/useToastStore";

export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const clear = useToastStore((state) => state.clear);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -24, duration: 180, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true })
      ]).start(clear);
    }, 2500);

    return () => clearTimeout(timer);
  }, [clear, opacity, toast, translateY]);

  if (!toast) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { top: insets.top + spacing.sm, transform: [{ translateY }], opacity }
      ]}
    >
      <View style={styles.toast}>
        <CheckCircle2 color={colors.primary[400]} size={22} strokeWidth={1.5} />
        <View style={styles.copy}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: "rgba(23,23,23,0.95)",
    padding: spacing.base,
    ...shadows.xl
  },
  copy: {
    flex: 1
  },
  title: {
    ...type.bodyMd,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[0]
  },
  message: {
    ...type.bodySm,
    color: colors.neutral[200]
  }
});
