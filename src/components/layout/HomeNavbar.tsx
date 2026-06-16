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

const HomeNavbar = ({ session, isAuthenticated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative max-w-7xl w-full shrink-0 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center z-50">
      <Logo white={false} />
      
      {/* Menú de escritorio */}
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
        <Link href="/#hero" className="hover:text-rose-500 transition">
          Inicio
        </Link>
        <Link href="/#services" className="hover:text-rose-500 transition">
          Servicios
        </Link>
        <Link href="/#consultationInfo" className="hover:text-rose-500 transition">
          Agenda tu consulta
        </Link>
        <Link href="/#about" className="hover:text-rose-500 transition">
          Sobre la doctora
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
            <Link
              href="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium text-sm transition"
            >
              Registrarse
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
            href="/#hero"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Inicio
          </Link>
          <Link
            href="/#services"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Servicios
          </Link>
          <Link
            href="/#consultationInfo"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Agenda tu consulta
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-rose-500 hover:bg-rose-50/50 transition"
          >
            Sobre la doctora
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
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
