import Link from "next/link";

export default function MedicalRecordBanner() {
  return (
    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white shadow-md relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="bg-white/20 p-2 rounded-lg shrink-0 hidden sm:block animate-pulse">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base tracking-wide">
                ¡Tu ficha médica está incompleta!
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-light mt-0.5 max-w-3xl">
                Completa tu peso, altura e historial clínico para que la Doctora
                tenga toda la información necesaria antes de tu próxima consulta.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/medical-record"
              className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 bg-white text-rose-600 hover:text-rose-700 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 duration-200 animate-pulse hover:animate-none"
            >
              Completar Ficha
              <svg
                className="w-4 h-4 ml-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
