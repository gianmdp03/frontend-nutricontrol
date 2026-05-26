"use server";

import { NotificationService } from "@/services/NotificationService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getUnreadNotificationsAction(page: number = 0, size: number = 50) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  try {
    const data = await NotificationService.getUnreadNotifications(token, page, size);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in getUnreadNotificationsAction:", error);
    return { error: "Error al obtener las notificaciones." };
  }
}

export async function markAsReadAction(id: number) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  try {
    await NotificationService.markAsRead(id, token);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error in markAsReadAction:", error);
    return { error: "Error al marcar la notificación como leída." };
  }
}

export async function markAllAsReadAction() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  try {
    await NotificationService.markAllAsRead(token);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error in markAllAsReadAction:", error);
    return { error: "Error al marcar todas las notificaciones como leídas." };
  }
}

export async function deleteNotificationAction(id: number) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  try {
    await NotificationService.deleteNotification(id, token);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteNotificationAction:", error);
    return { error: "Error al eliminar la notificación." };
  }
}

export async function deleteAllNotificationsAction() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  try {
    await NotificationService.deleteAllNotifications(token);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteAllNotificationsAction:", error);
    return { error: "Error al vaciar las notificaciones." };
  }
}
