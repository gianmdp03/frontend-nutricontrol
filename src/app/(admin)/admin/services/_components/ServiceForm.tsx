"use client";

import { useActionState } from "react";
import { createOrUpdateServiceAction } from "../action";
import SubmitButton from "./SubmitButton";

// Definimos qué datos esperamos para editar
interface ServiceInitialData {
  id?: string;
  name?: string;
  description?: string;
}

export default function ServiceForm({
  initialData,
}: {
  initialData?: ServiceInitialData;
}) {
  const [state, formAction] = useActionState(createOrUpdateServiceAction, {
    message: null,
  });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-lg shadow-md"
    >
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      <div>
        <label className="label">Nombre del Servicio</label>
        <input
          type="text"
          name="name"
          defaultValue={initialData?.name || ""}
          className={`input input-bordered bg-gray-50 w-full ${state.errors?.name ? "input-error" : ""}`}
        />
        {state.errors?.name && (
          <span className="text-red-500 text-sm">{state.errors.name[0]}</span>
        )}
      </div>

      <div>
        <label className="label">Descripción</label>
        <textarea
          name="description"
          defaultValue={initialData?.description || ""}
          className={`textarea textarea-bordered w-full bg-gray-50 ${state.errors?.description ? "textarea-error" : ""}`}
        />
        {state.errors?.description && (
          <span className="text-red-500 text-sm">
            {state.errors.description[0]}
          </span>
        )}
      </div>

      <SubmitButton
        label={initialData ? "Actualizar Servicio" : "Crear Servicio"}
      />
    </form>
  );
}
