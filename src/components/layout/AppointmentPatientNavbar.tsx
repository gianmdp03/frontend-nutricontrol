"use client";

import { useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";

type Props = {
  session: Session | null;
  isAuthenticated: boolean;
};

const AppointmentPatientNavbar = ({ session, isAuthenticated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative max-w-7xl w-full shrink-0 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center z-50">
      <div className="flex items-center gap-2">
        <Logo white={false} />
      </div>

      {/* Menú de escritorio */}
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-rose-500 transition">
          Inicio
        </Link>
        <Link href="/my-appointments" className="hover:text-rose-500 transition">
          Mis turnos
        </Link>
        <Link href="/appointments" className="hover:text-rose-500 transition">
          Agendar un turno
        </Link>

        {/* Solo mostrar Administrador si el rol es ADMIN */}
        {session?.user?.role === "ROLE_ADMIN" && (
          <Link
            href="/admin"
            className="hover:text-rose-500 font-bold text-rose-600 transition"
          >
            Panel Administrador
          </Link>
        )}
      </div>

      {/* Sección del Perfil / Botón de Login */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ProfileMenu session={session} theme="light" />
          </div>
        ) : (
          <div className="hidden sm:flex gap-2">
            <Link
              href="/login"
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-md font-medium text-sm transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}

        {/* Botón de Hamburguesa para Móviles */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-rose-500 hover:bg-rose-50 focus:outline-none transition duration-200"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Abrir menú principal</span>
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl z-50 p-4 mt-2 space-y-2 flex flex-col transition-all duration-300 ease-in-out">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Inicio
          </Link>
          <Link
            href="/my-appointments"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Mis turnos
          </Link>
          <Link
            href="/appointments"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Agendar un turno
          </Link>

          {session?.user?.role === "ROLE_ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition"
            >
              Panel Administrador
            </Link>
          )}

          {/* Mostrar botones de auth en móviles si no están autenticados */}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default AppointmentPatientNavbar;
