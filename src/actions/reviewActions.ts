"use server";

import { ReviewService } from "@/services/ReviewService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";
import { ReviewRequestDTO } from "@/types/Review";

export async function addReviewAction(data: ReviewRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado. Por favor, inicia sesión.", error: "No estás autenticado. Por favor, inicia sesión." };
  }

  try {
    const response = await ReviewService.addReview(data, token);
    revalidatePath("/admin/reviews");
    revalidatePath("/my-appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in addReviewAction:", error);
    return { success: false, message: "Hubo un problema al enviar tu reseña.", error: "Hubo un problema al enviar tu reseña." };
  }
}

export async function listAdminReviewsAction(page: number = 0, size: number = 20) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session?.user?.role !== "ROLE_ADMIN") {
    return { success: false, message: "Acceso no autorizado. Se requieren permisos de administrador.", error: "Acceso no autorizado. Se requieren permisos de administrador." };
  }

  try {
    const data = await ReviewService.listAdminReviews(token, page, size);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in listAdminReviewsAction:", error);
    return { success: false, message: "Error al obtener la lista de reseñas.", error: "Error al obtener la lista de reseñas." };
  }
}
