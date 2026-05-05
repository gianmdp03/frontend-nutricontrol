"use client";

import { updateScheduleRuleAction } from "@/actions/scheduleRuleActions";
import ScheduleRuleForm from "@/components/admin/schedule-rules/ScheduleRuleForm";
import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditScheduleRulePage = () => {
  const params = useParams();
  const scheduleRuleId = String(params.id);

  const [initialData, setInitialData] = useState<
    ScheduleRuleFormValues | undefined
  >();

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const data = await ScheduleRuleService.getById(scheduleRuleId);
        setInitialData(data);
      } catch (error) {
        console.error("Error al cargar el dia de trabajo:", error);
      }
    };
    fetchCurrentData();
  }, [scheduleRuleId]);

  const onSubmitEdit = async (data: ScheduleRuleFormValues) => {
    await updateScheduleRuleAction(scheduleRuleId, data);
  };

  if (!initialData)
    return <p className="p-8">Cargando datos del día de trabajo...</p>;

  return (
    <div className="p-8">
      <ScheduleRuleForm
        onSubmit={onSubmitEdit}
        initialData={initialData}
        title="Editar día de trabajo"
      />
    </div>
  );
};

export default EditScheduleRulePage;
