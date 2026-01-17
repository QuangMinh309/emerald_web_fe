// sockets/socket.provider.tsx
import { useAuth } from "@/contexts/AuthContext";
import { getStoredUser } from "@/lib/auth-storage";
import { connectSocket, disconnectSocket, socket } from "@/sockets/socket";
import { createContext, useContext, useEffect } from "react";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = getStoredUser();
  useEffect(() => {
    console.log("SocketProvider useEffect - user:", user);
    if (user) connectSocket();

    return () => {
      disconnectSocket();
    };
    // khi component bị unmount
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
