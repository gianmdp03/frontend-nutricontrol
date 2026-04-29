"use client";
import { updateServiceAction } from "@/actions/serviceActions";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { ServiceFormValues } from "@/schemas/ServiceSchema";
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
      const response = await fetch(
        `${process.env.API_URL}/services/${serviceId}`,
      );
      const data = await response.json();
      setInitialData(data);
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
