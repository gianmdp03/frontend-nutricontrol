"use client";

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
  return (
    <nav className="max-w-7xl w-full shrink-0 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Logo white={false} />
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
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ProfileMenu session={session} theme="light" />
          </div>
        ) : (
          <div className="flex gap-2">
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
      </div>
    </nav>
  );
};

export default HomeNavbar;
