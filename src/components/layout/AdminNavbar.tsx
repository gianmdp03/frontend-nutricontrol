"use client";

import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-admin-sidebar", handleToggle);
    };
  }, []);

  return (
    <>
      {/* Backdrop para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar de administración */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block w-fit hover:scale-[1.02] hover:opacity-90 active:scale-98 transition-all duration-200"
          >
            <Logo white={true} />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-4" onClick={() => setIsOpen(false)}>
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
          <div className="space-y-2 py-1">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Generar Documentos
            </span>
            <div className="space-y-1.5 pl-2 border-l border-slate-700">
              <Link
                href="/admin/documents/certificate"
                className="block text-sm text-slate-300 hover:text-rose-300 transition-colors"
              >
                • Certificado Médico
              </Link>
              <Link
                href="/admin/documents/prescription"
                className="block text-sm text-slate-300 hover:text-rose-300 transition-colors"
              >
                • Receta Médica
              </Link>
              <Link
                href="/admin/documents/nutritional-plan"
                className="block text-sm text-slate-300 hover:text-rose-300 transition-colors"
              >
                • Plan Nutricional
              </Link>
            </div>
          </div>
          <hr className="border-slate-700" />
          <Link href="/" className="block text-sm text-gray-400 hover:text-white">
            Volver a la Web
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default AdminNavbar;
