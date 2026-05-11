const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface AppointmentSlot {
  adminId: number;
  adminName: string;
  startTimeUTC: string;
}

export const AppointmentService = {
  getAvailableAppointments: async (): Promise<AppointmentSlot[]> => {
    const response = await fetch(`${API_URL}/appointments/available`);
    if (!response.ok) throw new Error("Error al obtener los turnos");
    const data = await response.json();
    return data || [];
  },
};
