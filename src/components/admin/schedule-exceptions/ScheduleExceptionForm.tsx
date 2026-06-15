import FormInput from "@/components/ui/FormInput";
import FormTimePicker from "@/components/ui/FormTimePicker";
import {
  ScheduleExceptionFormValues,
  scheduleExceptionSchema,
} from "@/schemas/ScheduleExceptionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  initialData?: ScheduleExceptionFormValues;
  onSubmit: (data: ScheduleExceptionFormValues) => Promise<void>;
  title: string;
}

const ScheduleExceptionForm = ({ initialData, onSubmit, title }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleExceptionFormValues>({
    resolver: zodResolver(scheduleExceptionSchema),
    values: initialData || { date: "", startTime: "", endTime: "", reason: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-xl"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

      <FormInput
        type="date"
        label="Fecha"
        registration={register("date")}
        error={errors.startTime?.message}
      />

      <FormTimePicker
        label="Hora de comienzo"
        name="startTime"
        control={control}
        error={errors.startTime?.message}
      />

      <FormTimePicker
        label="Hora de finalización"
        name="endTime"
        control={control}
        error={errors.endTime?.message}
      />

      <FormInput
        type="input"
        label="Razón"
        registration={register("reason")}
        error={errors.reason?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-black text-white font-medium py-2.5 px-4 rounded-md hover:bg-gray-800 disabled:opacity-60 transition-all"
      >
        {isSubmitting
          ? "Procesando..."
          : initialData
            ? "Actualizar día de trabajo"
            : "Crear día de trabajo"}
      </button>
    </form>
  );
};

export default ScheduleExceptionForm;
