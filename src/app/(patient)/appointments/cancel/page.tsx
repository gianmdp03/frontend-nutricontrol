import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200 animate-fadeIn">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pago Cancelado</h1>
        <p className="mt-4 text-gray-600">
          El proceso de pago de PayPal fue cancelado. Tu turno no ha sido reservado y no se ha realizado ningún cargo.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Si deseas reservar tu turno nuevamente, por favor regresa al calendario de reservas.
        </p>
        <div className="mt-8 space-y-3">
          <Link
            href="/appointments"
            className="w-full inline-block bg-rose-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors shadow-md shadow-rose-100 text-center"
          >
            Volver a Reservar Turno
          </Link>
          <Link
            href="/"
            className="w-full inline-block bg-gray-100 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
