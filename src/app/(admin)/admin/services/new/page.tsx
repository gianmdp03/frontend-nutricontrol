"use client";
import { createServiceAction } from "@/actions/serviceActions";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { ServiceFormValues } from "@/schemas/ServiceSchema";

const NewServicePage = () => {
  const onSubmitCreate = async (data: ServiceFormValues) => {
    const result = await createServiceAction(data);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <div className="p-8">
      <ServiceForm title="Crear nuevo Servicio" onSubmit={onSubmitCreate} />
    </div>
  );
};

export default NewServicePage;
