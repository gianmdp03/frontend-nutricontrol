import { DayOfWeek } from "./ScheduleRule";

export interface DailyMenu {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface NutritionalPlanRequestDTO {
  patientName: string;
  age: string;
  weeklyMenu: Record<DayOfWeek, DailyMenu>;
  textareaTexto: string;
  userId?: number | null;
}

export interface NutritionalPlanDetailDTO {
  id: number;
  patientName: string;
  age: string;
  weeklyMenu: Record<DayOfWeek, DailyMenu>;
  textareaTexto: string;
  adminName?: string;
  specialty?: string;
  exequatur?: string;
  date?: string;
  dateTime?: string;
}
