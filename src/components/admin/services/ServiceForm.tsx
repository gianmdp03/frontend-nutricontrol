import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import { ServiceFormValues, serviceSchema } from "@/schemas/ServiceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
  initialData?: ServiceFormValues;
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  title: string;
};

const ServiceForm = ({ initialData, onSubmit, title }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    values: initialData || { name: "", description: "" },
  });
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-xl"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

      <FormInput
        label="Nombre del Servicio"
        registration={register("name")}
        error={errors.name?.message}
      />

      <FormTextarea
        label="Descripción"
        registration={register("description")}
        error={errors.description?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-black text-white font-medium py-2.5 px-4 rounded-md hover:bg-gray-800 disabled:opacity-60 transition-all"
      >
        {isSubmitting ? "Procesando..." : initialData ? "Actualizar Servicio" : "Crear Servicio"}
      </button>
    </form>
  );
};

export default ServiceForm;
