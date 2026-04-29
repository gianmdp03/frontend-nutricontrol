import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const FormInput = ({ label, error, registration, ...props }: Props) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...registration}
        {...props}
        className={`w-full border rounded-md p-2 transition-colors ${
          error
            ? "border-red-500 focus:outline-red-500"
            : "border-gray-300 focus:outline-black"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
