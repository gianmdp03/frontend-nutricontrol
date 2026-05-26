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

const AdminNavbar = ({ session, isAuthenticated }: Props) => {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
      <nav className="space-y-4">
        <Link href="/admin" className="block w-fit hover:scale-[1.02] hover:opacity-90 active:scale-98 transition-all duration-200">
          <Logo white={true} />
        </Link>
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
        <Link href="/admin/appointments" className="block hover:text-rose-300">
          Gestionar turnos
        </Link>
        <Link href="/admin/reviews" className="block hover:text-rose-300">
          Ver Reseñas
        </Link>
        <hr className="border-slate-700" />
        <Link href="/" className="block text-sm text-gray-400 hover:text-white">
          Volver a la Web
        </Link>
      </nav>
    </aside>
  );
};

export default AdminNavbar;
