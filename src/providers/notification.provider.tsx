// sockets/socket.provider.tsx
import { useMySystemNotifications } from "@/hooks/data/useSystemNotifications";
import { getSocket, socket } from "@/sockets/socket";
import { useAppDispatch } from "@/store/hooks";
import { initializeNotifications, pushNotification } from "@/store/slices/notificationSlice";
import type { SystemNotification } from "@/types/system-notification";
import { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";

const NotificationContext = createContext(socket);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: notifications } = useMySystemNotifications();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("system_notification", (data: SystemNotification) => {
      console.log("Received system notification in provider:", data);

      // Show toast based on notification type
      const toastOptions = {
        description: data.content,
        duration: data.priority === "URGENT" ? 10000 : 5000,
      };

      switch (data.type) {
        case "SUCCESS":
          toast.success(data.title, toastOptions);
          break;
        case "WARNING":
          toast.warning(data.title, toastOptions);
          break;
        case "ERROR":
          toast.error(data.title, toastOptions);
          break;
        case "INFO":
        case "SYSTEM":
        default:
          toast.info(data.title, toastOptions);
          break;
      }

      dispatch(pushNotification(data));
    });

    return () => {
      socket.off("system_notification");
    };
  }, [dispatch]);

  useEffect(() => {
    if (notifications) {
      dispatch(initializeNotifications(notifications));
    }
  }, [notifications, dispatch]);

  return <NotificationContext.Provider value={socket}>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => useContext(NotificationContext);
