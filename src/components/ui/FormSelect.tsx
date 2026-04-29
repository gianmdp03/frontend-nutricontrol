import { SelectHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  options: { value: string; label: string }[];
}

const FormSelect = ({ label, error, registration, options, ...props }: Props) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-800">
        {label}
      </label>
      <select
        {...registration}
        {...props}
        className={`w-full border rounded-md p-2 bg-white transition-colors cursor-pointer ${
          error 
            ? "border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:ring-black"
        }`}
      >
        <option value="">Seleccione una opción...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;