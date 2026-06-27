import { CheckCircle2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useToastStore } from "@/store/useToastStore";

const BOTTOM_BAR_HEIGHT = 72;

export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const clear = useToastStore((state) => state.clear);
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback((direction: "down" | "left" | "right" = "down") => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const exitX = direction === "left" ? -400 : direction === "right" ? 400 : 0;
    const exitY = direction === "down" ? 80 : 0;

    Animated.parallel([
      Animated.timing(translateX, { toValue: exitX, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: exitY, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) clear();
    });
  }, [clear, opacity, translateX, translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 4 ||
          (gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx)),
        onPanResponderMove: (_, gesture) => {
          const horizontalDistance = gesture.dx;
          const verticalDistance = Math.max(0, gesture.dy);
          translateX.setValue(horizontalDistance);
          translateY.setValue(verticalDistance);
          opacity.setValue(
            Math.max(0.35, 1 - Math.max(Math.abs(horizontalDistance), verticalDistance) / 160)
          );
        },
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) > 48 || Math.abs(gesture.vx) > 0.8) {
            dismiss(gesture.dx < 0 || gesture.vx < 0 ? "left" : "right");
            return;
          }

          if (gesture.dy > 48 || gesture.vy > 0.8) {
            dismiss();
            return;
          }

          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true })
          ]).start();
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true })
          ]).start();
        }
      }),
    [dismiss, opacity, translateX, translateY]
  );

  useEffect(() => {
    if (!toast) return;

    translateX.stopAnimation();
    translateY.stopAnimation();
    opacity.stopAnimation();
    translateX.setValue(0);
    translateY.setValue(24);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();

    timerRef.current = setTimeout(dismiss, 2500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dismiss, opacity, toast, translateX, translateY]);

  if (!toast) return null;

  const runAction = () => {
    toast.action?.onPress();
    clear();
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          bottom: insets.bottom + BOTTOM_BAR_HEIGHT + spacing.md,
          transform: [{ translateX }, { translateY }],
          opacity
        }
      ]}
    >
      <View style={styles.toast}>
        <CheckCircle2 color={colors.primary[400]} size={22} strokeWidth={1.5} />
        <View style={styles.copy}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
        </View>
        {toast.action ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={toast.action.label}
            hitSlop={8}
            onPress={runAction}
            style={styles.action}
          >
            <Text style={styles.actionText}>{toast.action.label}</Text>
          </Pressable>
        ) : null}
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
  },
  action: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  actionText: {
    ...type.bodyMd,
    fontFamily: "Inter_600SemiBold",
    color: colors.primary[400]
  }
});
