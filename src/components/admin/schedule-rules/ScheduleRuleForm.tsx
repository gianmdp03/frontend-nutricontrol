import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTimePicker from "@/components/ui/FormTimePicker";
import {
  dayOfWeekEnum,
  ScheduleRuleFormValues,
  scheduleRuleSchema,
} from "@/schemas/ScheduleRuleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  initialData?: ScheduleRuleFormValues;
  onSubmit: (data: ScheduleRuleFormValues) => Promise<void>;
  title: string;
}

const ScheduleRuleForm = ({ initialData, onSubmit, title }: Props) => {
  const dayOfWeekOptions = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleRuleFormValues>({
    resolver: zodResolver(scheduleRuleSchema),
    values: initialData || { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-xl"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

      <FormSelect
        label="Día de la semana"
        registration={register("dayOfWeek")}
        error={errors.dayOfWeek?.message}
        options={dayOfWeekOptions}
      />

      <FormTimePicker
        label="Hora de comienzo"
        name="startTime"
        control={control}
        error={errors.startTime?.message}
      />

      <FormTimePicker
        label="Hora de fin"
        name="endTime"
        control={control}
        error={errors.endTime?.message}
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

export default ScheduleRuleForm;
