"use client";
import { updateServiceAction } from "@/actions/serviceActions";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { ServiceService } from "@/services/ServiceService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditServicePage = () => {
  const params = useParams();
  const serviceId = String(params.id);

  const [initialData, setInitialData] = useState<
    ServiceFormValues | undefined
  >();

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const data = await ServiceService.getById(serviceId);
        setInitialData(data);
      } catch (error) {
        console.error("Error al cargar el servicio:", error);
      }
    };
    fetchCurrentData();
  }, [serviceId]);

  const onSubmitEdit = async (data: ServiceFormValues) => {
    await updateServiceAction(serviceId, data);
  };
  if (!initialData)
    return <p className="p-8">Cargando datos del servicio...</p>;

  return (
    <div className="p-8">
      <ServiceForm
        title="Editar Servicio"
        initialData={initialData}
        onSubmit={onSubmitEdit}
      />
    </div>
  );
};

export default EditServicePage;
