"use client";

import { Session } from "next-auth";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

type Props = {
  session: Session | null;
  isAuthenticated: boolean;
};

const AdminNavbar = ({ session, isAuthenticated }: Props) => {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
      <h2 className="text-xl font-bold mb-8 text-rose-400">NutriControl</h2>
      <nav className="space-y-4">
        <Link href="/admin/services" className="block hover:text-rose-300">
          Gestionar servicios
        </Link>
        <Link
          href="/admin/schedule-rules"
          className="block hover:text-rose-300"
        >
          Gestionar días de trabajo
        </Link>
        <Link
          href="/admin/schedule-exceptions"
          className="block hover:text-rose-300"
        >
          Gestionar excepciones
        </Link>
        <Link
          href="/admin/appointments"
          className="block hover:text-rose-300"
        >
          Gestionar turnos
        </Link>
        <hr className="border-slate-700" />
        <Link href="/" className="block text-sm text-gray-400 hover:text-white">
          Volver a la Web
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <ProfileMenu session={session} theme="dark" align="left" />
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
    </aside>
  );
};

export default AdminNavbar;
