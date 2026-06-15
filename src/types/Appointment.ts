import { UserDetailDTO } from "./User";

export type AppointmentType = "NUTRITIONAL" | "CONSULTATION";

export interface Admin {
  id: number;
  name: string;
  lastname: string;
  profilePicture: string | null;
  email: string;
  timezone: string;
}

export interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  admin: Admin;
  user?: UserDetailDTO;
  appointmentStatus:
    | "CONFIRMED"
    | "CANCELLED"
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED_REFUND"
    | "CANCELLED_WITHOUT_REFUND"
    | "IN_PROGRESS"
    | "FINISHED"
    | "USER_DIDNT_COME";
  meetingLink?: string;
  appointmentType: AppointmentType;
}
