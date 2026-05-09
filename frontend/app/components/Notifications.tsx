import { useNotificationStore } from "~/stores/useNotificationStore";

export default function Notifications() {
  const { notifications, dismiss } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg"
        >
          <span className="text-sm font-medium">{n.message}</span>
          <button
            onClick={() => dismiss(n.id)}
            className="ml-2 text-white/70 hover:text-white"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
