import { redirect } from "next/navigation";
import { confirmPaymentAction } from "@/actions/appointmentActions";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ token?: string; PayerID?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  // ACÁ ESTÁ LA MAGIA QUE FALTABA: Next.js 15 requiere hacer 'await' a los searchParams
  const params = await searchParams;
  const paypalOrderId = params.token;

  if (!paypalOrderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Falta el ID del pago
        </h1>
        <p className="mt-4">No se pudo identificar la transacción de PayPal.</p>
        <Link
          href="/appointments"
          className="mt-6 text-blue-600 hover:underline"
        >
          Volver a turnos
        </Link>
      </div>
    );
  }

  // Llamamos a la Server Action para que el backend ejecute paymentService.confirmPaymentHold()
  const result = await confirmPaymentAction(paypalOrderId);

  if (result.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Error en la confirmación
        </h1>
        <p className="mt-4">{result.error}</p>
        <p className="mt-2 text-sm text-gray-500">
          Por favor, contáctate con soporte si ya se te descontó el dinero.
        </p>
        <Link
          href="/appointments"
          className="mt-6 text-blue-600 hover:underline"
        >
          Volver a turnos
        </Link>
      </div>
    );
  }

  // Si fue exitoso
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">¡Turno Confirmado!</h1>
        <p className="mt-4 text-gray-600">
          Tu pago ha sido procesado con éxito. Hemos enviado un comprobante a tu
          correo electrónico.
        </p>
        <div className="mt-8">
          <Link
            href="/appointments"
            className="w-full inline-block bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
