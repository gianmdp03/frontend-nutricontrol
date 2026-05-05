"use client";

import { createScheduleExceptionAction } from "@/actions/scheduleExceptionActions";
import ScheduleExceptionForm from "@/components/admin/schedule-exceptions/ScheduleExceptionForm";
import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";

const NewScheduleExceptionPage = () => {
  const onSubmitCreate = async (data: ScheduleExceptionFormValues) => {
    const response = await createScheduleExceptionAction(data);
    if (response?.error) {
      alert(response.error);
    }
  };
  return (
    <div className="p-8">
      <ScheduleExceptionForm title="Crear nuevo dia de trabajo" onSubmit={onSubmitCreate} />
    </div>
  );
};

export default NewScheduleExceptionPage;
