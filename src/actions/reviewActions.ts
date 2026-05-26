"use server";

import { ReviewService } from "@/services/ReviewService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function addReviewAction(data: { score: number; comment: string }) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado. Por favor, inicia sesión." };
  }

  try {
    const response = await ReviewService.addReview(data, token);
    revalidatePath("/admin/reviews");
    revalidatePath("/my-appointments");
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error in addReviewAction:", error);
    return { error: error.message || "Hubo un problema al enviar tu reseña." };
  }
}

export async function listAdminReviewsAction(page: number = 0, size: number = 20) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  if (session?.user?.role !== "ROLE_ADMIN") {
    return { error: "Acceso no autorizado. Se requieren permisos de administrador." };
  }

  try {
    const data = await ReviewService.listAdminReviews(token, page, size);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in listAdminReviewsAction:", error);
    return { error: "Error al obtener la lista de reseñas." };
  }
}
