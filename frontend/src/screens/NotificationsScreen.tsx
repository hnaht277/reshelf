import { Bell, BellRing, CheckCheck, CircleDollarSign, Leaf, PackageCheck, Tag, Trash2 } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { colors, radius, shadows, spacing, type } from "@/constants/theme";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useToastStore } from "@/store/useToastStore";
import type { AppNotification, NotificationType } from "@/types";

export function NotificationsScreen() {
  const notifications = useNotificationStore((state) => state.notifications);
  const loading = useNotificationStore((state) => state.loading);
  const fetch = useNotificationStore((state) => state.fetch);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const dismiss = useNotificationStore((state) => state.dismiss);
  const restore = useNotificationStore((state) => state.restore);
  const unreadCount = useNotificationStore((state) => state.unreadCount());
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);

  const dismissWithUndo = (notification: AppNotification) => {
    const index = notifications.findIndex((item) => item.id === notification.id);
    dismiss(notification.id);
    showToast("Notification deleted", notification.title, {
      label: "Undo",
      onPress: () => restore(notification, index)
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl tintColor={colors.primary[500]} refreshing={loading} onRefresh={fetch} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>{unreadCount} unread updates</Text>
          </View>
          {notifications.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              onPress={markAllRead}
              style={styles.markAll}
            >
              <CheckCheck color={colors.primary[700]} size={20} strokeWidth={1.5} />
              <Text style={styles.markAllText}>Mark read</Text>
            </Pressable>
          ) : null}
        </View>

        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="All caught up" message="New local deals and impact wins will show up here." />
        ) : (
          grouped.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.items.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                  onDismiss={() => dismissWithUndo(notification)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRow({
  notification,
  onRead,
  onDismiss
}: {
  notification: AppNotification;
  onRead: () => void;
  onDismiss: () => void;
}) {
  const Icon = notificationIcon[notification.type];
  const palette = notificationPalette[notification.type];

  return (
    <Swipeable
      containerStyle={styles.swipeable}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${notification.title}`}
          onPress={onDismiss}
          style={styles.deleteAction}
        >
          <Trash2 color={colors.neutral[0]} size={22} strokeWidth={1.75} />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={notification.title}
        onPress={onRead}
        style={[
          styles.notification,
          notification.read ? styles.read : styles.unread,
          !notification.read && { borderLeftColor: colors.primary[500] }
        ]}
      >
        <View style={[styles.notificationIcon, { backgroundColor: palette.bg }]}>
          <Icon color={palette.color} size={22} strokeWidth={1.5} />
        </View>
        <View style={styles.notificationBody}>
          <View style={styles.notificationTop}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.time}>{relativeTime(notification.createdAt)}</Text>
          </View>
          <Text style={styles.notificationText}>{notification.body}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

function groupNotifications(items: AppNotification[]) {
  const groups = [
    { title: "Today", items: [] as AppNotification[] },
    { title: "Yesterday", items: [] as AppNotification[] },
    { title: "Earlier", items: [] as AppNotification[] }
  ];

  items.forEach((item) => {
    const age = Date.now() - new Date(item.createdAt).getTime();
    if (age < 24 * 60 * 60 * 1000) groups[0].items.push(item);
    else if (age < 48 * 60 * 60 * 1000) groups[1].items.push(item);
    else groups[2].items.push(item);
  });

  return groups.filter((group) => group.items.length > 0);
}

function relativeTime(dateIso: string): string {
  const hours = Math.max(1, Math.round((Date.now() - new Date(dateIso).getTime()) / 3600000));
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const notificationIcon: Record<NotificationType, typeof BellRing> = {
  "new-listing": BellRing,
  "price-drop": Tag,
  "expiry-alert": CircleDollarSign,
  "order-update": PackageCheck,
  impact: Leaf
};

const notificationPalette: Record<NotificationType, { bg: string; color: string }> = {
  "new-listing": { bg: colors.successLight, color: colors.primary[700] },
  "price-drop": { bg: colors.infoLight, color: colors.info },
  "expiry-alert": { bg: colors.warningLight, color: colors.warning },
  "order-update": { bg: colors.impactLight, color: colors.impact },
  impact: { bg: colors.primary[50], color: colors.primary[700] }
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral[50]
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 112,
    gap: spacing.base
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.base
  },
  title: {
    ...type.displayMd,
    color: colors.neutral[900]
  },
  subtitle: {
    ...type.bodyMd,
    color: colors.neutral[500]
  },
  markAll: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  markAllText: {
    ...type.bodySm,
    color: colors.primary[700]
  },
  group: {
    gap: spacing.sm
  },
  groupTitle: {
    ...type.headingSm,
    color: colors.neutral[800],
    marginTop: spacing.sm
  },
  swipeable: {
    borderRadius: radius.md,
    ...shadows.md
  },
  notification: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 3
  },
  unread: {
    backgroundColor: colors.primary[50]
  },
  read: {
    backgroundColor: colors.neutral[0],
    borderLeftColor: "transparent"
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  notificationBody: {
    flex: 1,
    gap: spacing.xs
  },
  notificationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  notificationTitle: {
    flex: 1,
    ...type.bodyMd,
    fontFamily: "Inter_600SemiBold",
    color: colors.neutral[800]
  },
  time: {
    ...type.bodySm,
    color: colors.neutral[400]
  },
  notificationText: {
    ...type.bodySm,
    color: colors.neutral[600]
  },
  deleteAction: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.danger
  },
  deleteText: {
    ...type.badge,
    color: colors.neutral[0]
  }
});
