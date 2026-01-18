// sockets/socket.provider.tsx
import { useMySystemNotifications } from "@/hooks/data/useSystemNotifications";
import { getSocket, socket } from "@/sockets/socket";
import { useAppDispatch } from "@/store/hooks";
import { initializeNotifications, pushNotification } from "@/store/slices/notificationSlice";
import { createContext, useContext, useEffect } from "react";

const NotificationContext = createContext(socket);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: notifications } = useMySystemNotifications();
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on("system_notification", (data) => {
      dispatch(pushNotification(data));
    });
    // khi component bị unmount
  }, []);
  useEffect(() => {
    if (notifications) {
      dispatch(initializeNotifications(notifications));
    }
  }, [notifications, dispatch]);

  return <NotificationContext.Provider value={socket}>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => useContext(NotificationContext);
