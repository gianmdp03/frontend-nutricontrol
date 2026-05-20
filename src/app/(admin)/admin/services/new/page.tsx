"use client";
import { createServiceAction } from "@/actions/serviceActions";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { useSession } from "next-auth/react";

const NewServicePage = () => {
  const { data: session, status } = useSession();

  const onSubmitCreate = async (data: ServiceFormValues) => {
    const token = session?.user?.backendToken;
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    const result = await createServiceAction(data, token);
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
      <ServiceForm title="Crear nuevo Servicio" onSubmit={onSubmitCreate} />
    </div>
  );
};

export default NewServicePage;
