import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminNavbar from "@/components/layout/AdminNavbar";
import ProfileMenu from "@/components/layout/ProfileMenu";
import NotificationBell from "@/components/layout/NotificationBell";
import AdminSidebarToggle from "@/components/layout/AdminSidebarToggle";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración",
  robots: {
    index: false,
    follow: false,
  },
};


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar de navegación izquierda para escritorio */}
      <AdminNavbar session={session} isAuthenticated={!!session} />
      
      {/* Área del Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Cabecera superior moderna */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          {/* Logo en versión móvil (cuando se oculta la sidebar) */}
          <div className="md:hidden flex items-center gap-2">
            <AdminSidebarToggle />
          </div>
          <div className="hidden md:block">
            {/* Espacio vacío para balancear el diseño en escritorio */}
          </div>
          
          {/* Controles de Perfil y Notificaciones */}
          <div className="flex items-center gap-4">
            {session && (
              <>
                <NotificationBell />
                <ProfileMenu session={session} theme="light" />
              </>
            )}
          </div>
        </header>

        {/* Contenido del Dashboard */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
