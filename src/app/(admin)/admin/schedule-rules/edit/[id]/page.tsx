"use client";

import { updateScheduleRuleAction } from "@/actions/scheduleRuleActions";
import ScheduleRuleForm from "@/components/admin/schedule-rules/ScheduleRuleForm";
import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const EditScheduleRulePage = () => {
  const params = useParams();
  const scheduleRuleId = String(params.id);
  const { data: session, status } = useSession();
  const token = session?.user?.backendToken;

  const [initialData, setInitialData] = useState<
    ScheduleRuleFormValues | undefined
  >();

  useEffect(() => {
    const fetchCurrentData = async () => {
      if (!token) return;
      try {
        const data = await ScheduleRuleService.getById(scheduleRuleId, token);
        setInitialData(data);
      } catch (error) {
        console.error("Error al cargar el dia de trabajo:", error);
      }
    };
    if (status !== "loading") {
      fetchCurrentData();
    }
  }, [scheduleRuleId, token, status]);

  const onSubmitEdit = async (data: ScheduleRuleFormValues) => {
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    await updateScheduleRuleAction(scheduleRuleId, data, token);
  };

  if (status === "loading") {
    return <p className="p-8">Cargando sesión...</p>;
  }

  if (!session?.user?.backendToken) {
    return <p className="p-8">Debes iniciar sesión</p>;
  }

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
