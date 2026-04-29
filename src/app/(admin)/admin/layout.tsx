export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar lateral fijo */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-rose-400">NutriControl</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-rose-300">Dashboard</a>
          <a href="/admin/servicios" className="block hover:text-rose-300">Gestionar Servicios</a>
          <a href="/admin/turnos" className="block hover:text-rose-300">Agenda</a>
          <hr className="border-slate-700" />
          <a href="/" className="block text-sm text-gray-400 hover:text-white">Volver a la Web</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
            Hola, Dra. Zully
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}