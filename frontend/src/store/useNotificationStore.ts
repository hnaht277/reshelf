import { create } from "zustand";
import { getNotifications } from "@/services/api";
import type { AppNotification } from "@/types";

type NotificationStore = {
  notifications: AppNotification[];
  loading: boolean;
  unreadCount: () => number;
  fetch: () => Promise<void>;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  restore: (notification: AppNotification, index: number) => void;
  markAsRead: (id: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,
  unreadCount: () => get().notifications.filter((notification) => !notification.read).length,
  fetch: async () => {
    set({ loading: true });
    const items = await getNotifications();
    set({ notifications: items, loading: false });
  },
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true }))
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id)
    })),
  restore: (notification, index) =>
    set((state) => {
      if (state.notifications.some((item) => item.id === notification.id)) return state;

      const notifications = [...state.notifications];
      const restoredIndex = Math.max(0, Math.min(index, notifications.length));
      notifications.splice(restoredIndex, 0, notification);
      return { notifications };
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }))
}));
