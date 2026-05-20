"use client";
import { updateServiceAction } from "@/actions/serviceActions";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { ServiceService } from "@/services/ServiceService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const EditServicePage = () => {
  const params = useParams();
  const serviceId = String(params.id);
  const { data: session, status } = useSession();

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
    const token = session?.user?.backendToken;
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    await updateServiceAction(serviceId, data, token);
  };

  if (status === "loading") {
    return <p className="p-8">Cargando sesión...</p>;
  }

  if (!session?.user?.backendToken) {
    return <p className="p-8">Debes iniciar sesión</p>;
  }

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
