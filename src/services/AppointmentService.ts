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
    if (!response.ok) throw new Error("Error al obtener los turnos");
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
      throw new Error("Error al crear el turno");
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
      throw new Error("Error al obtener los turnos");
    }

    const data = await response.json();

    return data.content || [];
  },
};
