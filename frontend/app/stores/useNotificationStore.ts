import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Notification {
  id: string;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  show: (message: string) => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      show: (message) => {
        console.log('perry: before');
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;        console.log('perry: after: id: ', id);
        set(
          (state) => ({ notifications: [...state.notifications, { id, message }] }),
          false,
          "show"
        );
        setTimeout(() => {
          set(
            (state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }),
            false,
            "dismiss"
          );
        }, 7000);
      },
      dismiss: (id) =>
        set(
          (state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }),
          false,
          "dismiss"
        ),
    }),
    { name: "NotificationStore" }
  )
);
