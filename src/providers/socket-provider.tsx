"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { getSocket } from "@/config/socket";
import type { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProviderClient");
  }
  return context.socket;
};

export default function SocketProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  const socket = useMemo(() => {
    const socketInstance = getSocket();
    return socketInstance.connect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
