"use client";

import { useFormStatus } from "react-dom";
import React from "react";

type Props = {
  label: string; // Ej: "Crear", "Guardar Cambios", etc.
};

export default function SubmitButton({ label }: Props) {
  // Este hook extrae mágicamente el estado del formulario padre
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full mt-4"
      disabled={pending} // Se bloquea solo para evitar doble click
    >
      {pending ? (
        <>
          {/* El spinner de DaisyUI para que quede fachero mientras carga */}
          <span className="loading loading-spinner loading-sm"></span>
          Guardando...
        </>
      ) : (
        label
      )}
    </button>
  );
}