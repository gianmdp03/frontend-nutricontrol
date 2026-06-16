import ScrollAnimation from "@/components/ui/ScrollAnimation";

const ConsultationInfo = () => {
  return (
    <ScrollAnimation>
      <section id="consultationInfo" className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-12">
            ¿Cómo agendar tu consulta?
          </h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            {/* Línea horizontal en escritorio */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-gray-200 -z-10" />
            
            {/* Línea vertical en móvil */}
            <div className="block md:hidden absolute top-4 bottom-4 left-4 w-0.5 bg-gray-200 -z-10" />

            {/* Paso 1 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/5 mb-8 md:mb-0 bg-transparent md:bg-slate-50 relative gap-4 md:gap-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 md:mb-4">
                1
              </div>
              <div className="flex-1 md:flex md:flex-col md:items-center">
                <div className="text-teal-600 mb-2">
                  <svg
                    className="w-8 h-8 md:mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">
                  Elige tu servicio
                </h5>
                <p className="text-xs text-gray-500 md:px-2">
                  Selecciona el tipo de consulta que necesitas.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/5 mb-8 md:mb-0 bg-transparent md:bg-slate-50 relative gap-4 md:gap-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 md:mb-4">
                2
              </div>
              <div className="flex-1 md:flex md:flex-col md:items-center">
                <div className="text-teal-600 mb-2">
                  <svg
                    className="w-8 h-8 md:mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">
                  Selecciona fecha y hora
                </h5>
                <p className="text-xs text-gray-500 md:px-2">
                  Elige el día y la hora que mejor se adapte a ti.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/5 mb-8 md:mb-0 bg-transparent md:bg-slate-50 relative gap-4 md:gap-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 md:mb-4">
                3
              </div>
              <div className="flex-1 md:flex md:flex-col md:items-center">
                <div className="text-teal-600 mb-2">
                  <svg
                    className="w-8 h-8 md:mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">
                  Completa tus datos
                </h5>
                <p className="text-xs text-gray-500 md:px-2">
                  Llena tu información médica de forma segura.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/5 mb-8 md:mb-0 bg-transparent md:bg-slate-50 relative gap-4 md:gap-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 md:mb-4">
                4
              </div>
              <div className="flex-1 md:flex md:flex-col md:items-center">
                <div className="text-teal-600 mb-2">
                  <svg
                    className="w-8 h-8 md:mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">
                  Realiza el pago
                </h5>
                <p className="text-xs text-gray-500 md:px-2">
                  Paga en línea con total seguridad.
                </p>
              </div>
            </div>

            {/* Paso 5 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/5 bg-transparent md:bg-slate-50 relative gap-4 md:gap-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 md:mb-4">
                5
              </div>
              <div className="flex-1 md:flex md:flex-col md:items-center">
                <div className="text-teal-600 mb-2">
                  <svg
                    className="w-8 h-8 md:mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">
                  Recibe tu enlace
                </h5>
                <p className="text-xs text-gray-500 md:px-2">
                  Te enviaremos el enlace de tu consulta por correo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default ConsultationInfo;
