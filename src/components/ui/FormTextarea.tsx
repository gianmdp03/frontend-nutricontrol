import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const FormTextarea = ({ label, error, registration, ...props }: Props) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-gray-800">
        {label}
      </label>
      <textarea
        {...registration}
        {...props}
        className={`w-full border rounded-md p-2 transition-colors ${
          error
            ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormTextarea;
