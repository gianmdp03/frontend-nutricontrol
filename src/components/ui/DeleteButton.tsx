"use client";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  action: (id: string, token: string) => Promise<{ success: boolean; message?: string; errors?: unknown; error?: string } | void>;
  id: string | number;
  name: string;
  token: string;
};

const DeleteButton = ({ children, action, id, name, token}: Props) => {
  return (
    <button
      onClick={() => {
        if (confirm(`Estas seguro de que deseas eliminar este ${name}?`)) {
          action(id.toString(), token);
        }
      }}
      className="btn btn-secondary"
    >
      {children}
    </button>
  );
};

export default DeleteButton;
