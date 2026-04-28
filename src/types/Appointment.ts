import { AdminDetailDTO } from "./User";

export interface AppointmentRequestDTO {
  date: Date;
  startTime: Date;
  adminId: string;
}

export interface AppointmentDetailDTO extends Omit<
  AppointmentRequestDTO,
  "adminId"
> {
  id: string;
  endTime: string;
  admin: AdminDetailDTO;
  appointmentStatus: AppointmentStatus;
}

enum AppointmentStatus {
  CONFIRMED,
  CANCELLED,
  PENDING,
  COMPLETED,
}
