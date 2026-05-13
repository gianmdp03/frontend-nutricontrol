"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="max-w-7xl w-full shrink-0 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-rose-500">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">
            NutriControl
            <br />
            <span className="text-slate-600 font-medium">Familiar</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
            Consulta médica virtual
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
        <Link href="/#hero" className="hover:text-rose-500">
          Inicio
        </Link>
        <Link href="/#services" className="hover:text-rose-500">
          Servicios
        </Link>
        <Link href="/#consultationInfo" className="hover:text-rose-500">
          Agenda tu consulta
        </Link>
        <Link href="/#about" className="hover:text-rose-500">
          Sobre la doctora
        </Link>

        {/* Solo mostrar Administrador si el rol es ADMIN */}
        {session?.user?.role === "ROLE_ADMIN" && (
          <Link
            href="/admin"
            className="hover:text-rose-500 font-bold text-rose-600"
          >
            Panel Administrador
          </Link>
        )}
      </div>

      {/* Sección del Perfil / Botón de Login */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">
                {session.user.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-500">
                {session.user.role === "ROLE_ADMIN"
                  ? "Administrador"
                  : "Paciente"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-md font-medium text-sm transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
