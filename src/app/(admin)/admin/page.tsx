export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Turnos de hoy</p>
        <h3 className="text-3xl font-bold">12</h3>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Pacientes nuevos</p>
        <h3 className="text-3xl font-bold">4</h3>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Ingresos estimados</p>
        <h3 className="text-3xl font-bold text-green-600">$150.00</h3>
      </div>
    </div>
  );
}