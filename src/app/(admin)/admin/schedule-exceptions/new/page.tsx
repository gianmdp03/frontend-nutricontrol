"use client";

import { createScheduleExceptionAction } from "@/actions/scheduleExceptionActions";
import ScheduleExceptionForm from "@/components/admin/schedule-exceptions/ScheduleExceptionForm";
import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { useSession } from "next-auth/react";

const NewScheduleExceptionPage = () => {
  const { data: session, status } = useSession();

  const onSubmitCreate = async (data: ScheduleExceptionFormValues) => {
    const token = session?.user?.backendToken;
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    const response = await createScheduleExceptionAction(data, token);
    if (response?.error) {
      alert(response.error);
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
      <ScheduleExceptionForm title="Crear nuevo dia de trabajo" onSubmit={onSubmitCreate} />
    </div>
  );
};

export default NewScheduleExceptionPage;
