// sockets/socket.provider.tsx
import { getStoredUser } from "@/lib/auth-storage";
import { connectSocket, disconnectSocket, getSocket, socket } from "@/sockets/socket";
import { useAppDispatch } from "@/store/hooks";
import { pushNotification } from "@/store/slices/notificationSlice";
import { createContext, useContext, useEffect } from "react";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const user = getStoredUser();
  useEffect(() => {
    if (user) connectSocket();
    const socket = getSocket();
    if (!socket) return;

    socket.on("system_notification", (data) => {
      dispatch(pushNotification(data));
    });
    return () => {
      disconnectSocket();
    };
    // khi component bị unmount
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
