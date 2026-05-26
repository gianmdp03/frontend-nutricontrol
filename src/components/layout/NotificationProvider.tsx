"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { NotificationDetailDTO } from "@/types/Notification";
import { NotificationService } from "@/services/NotificationService";
import { Client } from "@stomp/stompjs";

interface NotificationContextProps {
  notifications: NotificationDetailDTO[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe usarse dentro de un NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<NotificationDetailDTO[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  const token = session?.user?.backendToken;
  const isAuthenticated = status === "authenticated" && !!token;

  // 1. Cargar notificaciones iniciales por REST
  const loadInitialNotifications = async () => {
    if (!token) return;
    try {
      const res = await NotificationService.getUnreadNotifications(token);
      setNotifications(res.content || []);
    } catch (error) {
      console.error("Error al cargar notificaciones iniciales:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, token]);

  // 2. Establecer conexión WebSocket
  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Si el usuario se desloguea, desconectar WS
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    let active = true;
    let client: Client | null = null;

    const establishWebSocket = async () => {
      try {
        // Importación dinámica de SockJS para evitar errores de SSR (window is not defined)
        const SockJS = (await import("sockjs-client")).default;

        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const wsUrl = baseApiUrl.replace("/api", "/ws");

        // Construir cliente STOMP
        client = new Client({
          webSocketFactory: () => {
            // Pasamos el token en query param como capa extra de seguridad para interceptores de handshake
            return new SockJS(`${wsUrl}?token=${encodeURIComponent(token)}`);
          },
          connectHeaders: {
            Authorization: `Bearer ${token}`, // Token en cabeceras estándar
          },
          debug: (str) => {
            if (process.env.NODE_ENV === "development") {
              console.log("[STOMP]:", str);
            }
          },
          reconnectDelay: 5000, // Reconexión automática cada 5 segundos
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
          if (!active) return;
          console.log("Conectado exitosamente al servidor STOMP");
          setIsConnected(true);

          // Suscribirse al canal de notificaciones del usuario
          client?.subscribe("/user/queue/notifications", (message) => {
            try {
              const newNotif: NotificationDetailDTO = JSON.parse(message.body);
              console.log("Nueva notificación recibida en tiempo real:", newNotif);
              
              setNotifications((prev) => {
                // Evitar duplicados
                if (prev.some((n) => n.id === newNotif.id)) return prev;
                return [newNotif, ...prev];
              });
            } catch (err) {
              console.error("Error al parsear notificación en tiempo real:", err);
            }
          });
        };

        client.onDisconnect = () => {
          console.log("Desconectado de WebSockets");
          setIsConnected(false);
        };

        client.onStompError = (frame) => {
          console.error("Error de STOMP:", frame.headers["message"]);
          console.error("Detalles:", frame.body);
        };

        client.activate();
        stompClientRef.current = client;
      } catch (error) {
        console.error("Error al configurar el cliente WebSocket:", error);
      }
    };

    establishWebSocket();

    return () => {
      active = false;
      if (client) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, token]);

  // 3. Mutaciones REST
  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await NotificationService.markAsRead(id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await NotificationService.markAllAsRead(token);
      setNotifications([]);
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    if (!token) return;
    try {
      await NotificationService.deleteNotification(id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const deleteAllNotifications = async () => {
    if (!token) return;
    try {
      await NotificationService.deleteAllNotifications(token);
      setNotifications([]);
    } catch (error) {
      console.error("Error al vaciar notificaciones:", error);
    }
  };

  const unreadCount = notifications.length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
