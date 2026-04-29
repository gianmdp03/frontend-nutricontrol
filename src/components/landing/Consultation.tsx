import ScrollAnimation from "@/components/ui/ScrollAnimation";

const Consultation = () => {
  return (
    <ScrollAnimation>
      <section id="consultation" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800">
              Elige tu tipo de consulta
            </h3>
            <p className="text-gray-500 mt-2">
              Opciones flexibles para adaptarnos a tus necesidades.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative bg-white border-2 border-rose-100 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="absolute -top-3 left-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                  Más elegida
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="text-rose-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Consulta única</h4>
                    <p className="text-xs text-gray-500">
                      Para evaluación médica general.
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 flex-1 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Evaluación completa
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Diagnóstico y plan de tratamiento
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Recomendaciones médicas
                  </li>
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-rose-600 font-bold text-lg">
                    USD 45.00
                  </span>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Reservar
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-rose-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Consulta de seguimiento
                    </h4>
                    <p className="text-xs text-gray-500">
                      Para pacientes que ya iniciaron tratamiento.
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 flex-1 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Revisión de progreso
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Ajustes de tratamiento
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Acompañamiento médico
                  </li>
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-rose-600 font-bold text-lg">
                    USD 35.00
                  </span>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Reservar
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-rose-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Programa de control de peso
                    </h4>
                    <p className="text-xs text-gray-500">
                      Plan estructurado para pérdida de peso.
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 flex-1 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Evaluación completa
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Plan nutricional personalizado
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-slate-800 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>{" "}
                    Seguimiento continuo
                  </li>
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-rose-600 font-bold text-lg">
                    USD 120.00
                  </span>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-1/4 bg-slate-50 border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-4 text-slate-800">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Pago seguro</h4>
              <p className="text-sm text-gray-500 mb-6">
                Tus datos y pagos están protegidos con tecnología segura.
              </p>
              <div className="flex gap-4">
                <span className="font-bold text-blue-800 italic">VISA</span>
                <span className="font-bold text-blue-500 italic">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Consultation;
