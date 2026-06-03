import { ApiError, handleResponseError } from "@/utils/ApiError";
import { Appointment } from "@/types/Appointment";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface AppointmentSlot {
  adminId: number;
  adminName: string;
  startTimeUTC: string;
}

export const AppointmentService = {
  getAvailableAppointments: async (
    token: string,
  ): Promise<AppointmentSlot[]> => {
    const response = await fetch(`${API_URL}/appointments/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) await handleResponseError(response);
    const data = await response.json();
    return data || [];
  },
  createAppointment: async (
    data: { startTime: string; adminId: string },
    token: string,
  ): Promise<{ paypalOrderId: string; approveLink: string }> => {
    const response = await fetch(`${API_URL}/appointments`, {
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

    return await response.json();
  },
  listAdminAppointments: async (token: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();

    return data.content || [];
  },
  listPatientAppointments: async (token: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || [];
  },
  cancelAdminAppointment: async (
    id: number,
    refund: boolean,
    token: string,
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/appointments/admin/${id}?refund=${refund}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) await handleResponseError(response);
  },
  getAppointmentById: async (id: number, token: string): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_URL}/appointments/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Failed fetching single appointment by admin endpoint, trying generic endpoint", e);
    }

    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Failed fetching generic appointment, falling back to list scan", e);
    }

    // Fallback: list all admin appointments and search by id
    const appointments = await AppointmentService.listAdminAppointments(token);
    const found = appointments.find((app) => app.id === id);
    if (!found) {
      throw new ApiError(404, `No se encontró el turno con ID ${id}`);
    }
    return found;
  },
  startAppointment: async (id: number, token: string): Promise<Appointment> => {
    const response = await fetch(`${API_URL}/appointments/${id}/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  completeAppointment: async (id: number, token: string): Promise<Appointment> => {
    const response = await fetch(`${API_URL}/appointments/${id}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
};
