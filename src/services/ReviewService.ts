import { ReviewDetailDTO } from "@/types/Review";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface PaginatedReviews {
  content: ReviewDetailDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const ReviewService = {
  // POST /api/reviews
  addReview: async (
    data: { score: number; comment: string },
    token: string,
  ): Promise<ReviewDetailDTO> => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return response.json();
  },

  // GET /api/reviews/admin
  listAdminReviews: async (
    token: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PaginatedReviews> => {
    const response = await fetch(
      `${API_URL}/reviews/admin?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      await handleResponseError(response);
    }

    return response.json();
  },
};
