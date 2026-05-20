"use client";
import { updateScheduleExceptionAction } from "@/actions/scheduleExceptionActions";
import ScheduleExceptionForm from "@/components/admin/schedule-exceptions/ScheduleExceptionForm";
import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const page = () => {
  const params = useParams();
  const exceptionId = String(params.id);
  const { data: session, status } = useSession();
  const token = session?.user?.backendToken;

  const [initialData, setInitialData] = useState<
    ScheduleExceptionFormValues | undefined
  >();

  useEffect(() => {
    const fetchCurrentData = async () => {
      if (!token) return;
      try {
        const data = await ScheduleExceptionService.getById(exceptionId, token);
        setInitialData(data);
      } catch (error) {
        console.error("Error al cargar la excepción:", error);
      }
    };
    if (status !== "loading") {
      fetchCurrentData();
    }
  }, [exceptionId, token, status]);

  const onSubmitEdit = async (data: ScheduleExceptionFormValues) => {
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    await updateScheduleExceptionAction(exceptionId, data, token);
  };

  if (status === "loading") {
    return <p className="p-8">Cargando sesión...</p>;
  }

  if (!session?.user?.backendToken) {
    return <p className="p-8">Debes iniciar sesión</p>;
  }

  if (!initialData)
    return <p className="p-8">Cargando datos de la excepciones...</p>;

  return (
    <div className="p-8">
      <ScheduleExceptionForm
        onSubmit={onSubmitEdit}
        initialData={initialData}
        title="Editar día de trabajo"
      />
    </div>
  );
};

export default page;
