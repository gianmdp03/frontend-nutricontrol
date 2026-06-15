import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

interface FormTimePickerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  error?: string;
  placeholder?: string;
}

const FormTimePicker = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  placeholder = "00:00",
}: FormTimePickerProps<TFieldValues>) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Flatpickr
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                disableMobile: true,
                defaultDate: field.value,
              }}
              placeholder={placeholder}
              onChange={([selectedDate]) => {
                if (selectedDate instanceof Date) {
                  const hours = String(selectedDate.getHours()).padStart(2, "0");
                  const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
                  field.onChange(`${hours}:${minutes}`);
                } else {
                  field.onChange("");
                }
              }}
              className={`w-full border rounded-md p-2 transition-colors bg-white text-gray-900 ${
                error
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-black"
              }`}
            />
          );
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormTimePicker;
