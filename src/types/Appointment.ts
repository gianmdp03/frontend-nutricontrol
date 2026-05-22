interface Admin {
  id: number;
  name: string;
  lastname: string;
  profilePicture: string | null;
  email: string;
  timezone: string;
}

interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  admin: Admin;
  appointmentStatus:
    | "CONFIRMED"
    | "CANCELLED"
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED_REFUND"
    | "CANCELLED_WITHOUT_REFUND";
  meetingLink?: string;
}
