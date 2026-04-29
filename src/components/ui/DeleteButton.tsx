"use client";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  action: (id: string) => Promise<void>;
  id: string;
  name: string;
};

const DeleteButton = ({ children, action, id, name}: Props) => {
  return (
    <button
      onClick={() => {
        if (confirm(`Estas seguro de que deseas eliminar este ${name}?`)) {
          action(id);
        }
      }}
      className="btn btn-secondary"
    >
      {children}
    </button>
  );
};

export default DeleteButton;
