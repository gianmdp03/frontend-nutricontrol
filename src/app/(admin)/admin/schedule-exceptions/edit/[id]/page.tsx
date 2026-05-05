"use client";
import { updateScheduleExceptionAction } from "@/actions/scheduleExceptionActions";
import ScheduleExceptionForm from "@/components/admin/schedule-exceptions/ScheduleExceptionForm";
import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const exceptionId = String(params.id);

  const [initialData, setInitialData] = useState<
    ScheduleExceptionFormValues | undefined
  >();

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const data = await ScheduleExceptionService.getById(exceptionId);
        setInitialData(data);
      } catch (error) {
        console.error("Error al cargar la excepción:", error);
      }
    };
    fetchCurrentData();
  }, [exceptionId]);

  const onSubmitEdit = async (data: ScheduleExceptionFormValues) => {
    await updateScheduleExceptionAction(exceptionId, data);
  };

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
