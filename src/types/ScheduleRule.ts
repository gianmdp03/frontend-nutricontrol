export interface ScheduleRuleRequestDTO {
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
}

export interface ScheduleRuleDetailDTO extends ScheduleRuleRequestDTO {
  id: string;
}

export type ScheduleRuleUpdateDTO = Partial<ScheduleRuleRequestDTO>;

enum DayOfWeek {
  MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}
