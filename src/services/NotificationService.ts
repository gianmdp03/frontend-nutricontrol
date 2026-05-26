import { NotificationDetailDTO } from "@/types/Notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface PaginatedNotifications {
  content: NotificationDetailDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const NotificationService = {
  // GET /api/notifications/unread
  getUnreadNotifications: async (
    token: string,
    page: number = 0,
    size: number = 50,
  ): Promise<PaginatedNotifications> => {
    const response = await fetch(
      `${API_URL}/notifications/unread?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las notificaciones no leídas");
    }

    return response.json();
  },

  // PATCH /api/notifications/{id}/read
  markAsRead: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al marcar la notificación como leída");
    }
  },

  // PATCH /api/notifications/read-all
  markAllAsRead: async (token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al marcar todas las notificaciones como leídas");
    }
  },

  // DELETE /api/notifications/{id}
  deleteNotification: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la notificación");
    }
  },

  // DELETE /api/notifications/delete-all
  deleteAllNotifications: async (token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/notifications/delete-all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al vaciar las notificaciones");
    }
  },
};
