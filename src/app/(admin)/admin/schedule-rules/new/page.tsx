"use client";

import { createScheduleRuleAction } from "@/actions/scheduleRuleActions";
import ScheduleRuleForm from "@/components/admin/schedule-rules/ScheduleRuleForm";
import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { useSession } from "next-auth/react";

const NewScheduleRulePage = () => {
  const { data: session, status } = useSession();

  const onSubmitCreate = async (data: ScheduleRuleFormValues) => {
    const token = session?.user?.backendToken;
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    const result = await createScheduleRuleAction(data, token);
    if (result?.error) {
      alert(result.error);
    }
  };

  if (status === "loading") {
    return <p className="p-8">Cargando sesión...</p>;
  }

  if (!session?.user?.backendToken) {
    return <p className="p-8">Debes iniciar sesión</p>;
  }

  return (
    <div className="p-8">
      <ScheduleRuleForm
        title="Crear nuevo dia de trabajo"
        onSubmit={onSubmitCreate}
      />
    </div>
  );
};

export default NewScheduleRulePage;
