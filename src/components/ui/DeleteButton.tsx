"use client";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  action: (id: string, token:string) => Promise<any>;
  id: string
  name: string
  token: string
};

const DeleteButton = ({ children, action, id, name, token}: Props) => {
  return (
    <button
      onClick={() => {
        if (confirm(`Estas seguro de que deseas eliminar este ${name}?`)) {
          action(id, token);
        }
      }}
      className="btn btn-secondary"
    >
      {children}
    </button>
  );
};

export default DeleteButton;
