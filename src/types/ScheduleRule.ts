export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleRuleDetailDTO {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}