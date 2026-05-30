import { create } from "zustand";
import { api } from "@/lib/api";
import { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{ success: boolean; data: Notification[] }>(
        "notifications"
      );
      set({ notifications: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get<{
        success: boolean;
        data: { count: number };
      }>("notifications/unread-count");
      set({ unreadCount: res.data.count });
    } catch {
      // silently fail
    }
  },

  markRead: async (id: string) => {
    try {
      await api.patch(`notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // silently fail
    }
  },

  markAllRead: async () => {
    try {
      await api.patch("notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch {
      // silently fail
    }
  },
}));
