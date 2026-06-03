import { NutritionalPlanDetailDTO, NutritionalPlanRequestDTO } from "@/types/NutritionalPlan";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const NutritionalPlanService = {
  createNutritionalPlan: async (
    data: NutritionalPlanRequestDTO,
    token: string,
  ): Promise<NutritionalPlanDetailDTO> => {
    const response = await fetch(`${API_URL}/nutritional-plans`, {
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

  createManualNutritionalPlan: async (
    data: NutritionalPlanRequestDTO,
    token: string,
  ): Promise<NutritionalPlanDetailDTO> => {
    const response = await fetch(`${API_URL}/nutritional-plans/admin/manual`, {
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

  getPatientNutritionalPlans: async (token: string): Promise<NutritionalPlanDetailDTO[]> => {
    const response = await fetch(`${API_URL}/nutritional-plans/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || data || [];
  },

  adminGetUserNutritionalPlans: async (
    userId: number,
    token: string,
  ): Promise<NutritionalPlanDetailDTO[]> => {
    const response = await fetch(`${API_URL}/nutritional-plans/admin/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || data || [];
  },

  getManualNutritionalPlans: async (token: string): Promise<NutritionalPlanDetailDTO[]> => {
    const response = await fetch(`${API_URL}/nutritional-plans/admin/manual`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || data || [];
  },
};
