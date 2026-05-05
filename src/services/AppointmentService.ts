const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const AppointmentService = {
  getAvailableAppointments: async (): Promise<Record<string, string[]>> => {
    const response = await fetch(`${API_URL}/appointments/available`);
    if (!response.ok) throw new Error("Error al obtener los turnos");
    const data = await response.json();
    return data || {};
  },
};
