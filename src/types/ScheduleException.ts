export interface ScheduleExceptionRequestDTO {
  date: Date;
  startTime: Date;
  endTime: Date;
  reason?: string;
}

export interface ScheduleExceptionDetailDTO extends ScheduleExceptionRequestDTO {
  id: string;
}

export type ScheduleExceptionUpdateDTO = Partial<ScheduleExceptionRequestDTO>;
