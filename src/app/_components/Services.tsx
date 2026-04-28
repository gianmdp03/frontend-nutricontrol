import ScrollAnimation from "@/components/ScrollAnimation";

const Services = () => {
  return (
    <ScrollAnimation>
      <section className="bg-gray-50/50 py-16" id="services">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-800">
            Servicios disponibles
          </h3>
          <p className="text-gray-500 mt-2">
            Elige el servicio que necesitas. Atención médica profesional y
            personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">
              Consulta médica virtual
            </h4>
            <p className="text-sm text-gray-500 mb-4 h-10">
              Evaluación general, orientación médica y seguimiento.
            </p>
            <a
              href="#"
              className="text-rose-500 text-sm font-medium hover:underline"
            >
              Ver detalles →
            </a>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">
              Control de peso
            </h4>
            <p className="text-sm text-gray-500 mb-4 h-10">
              Plan personalizado para bajar de peso de forma segura y
              sostenible.
            </p>
            <a
              href="#"
              className="text-rose-500 text-sm font-medium hover:underline"
            >
              Ver detalles →
            </a>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">
              Evaluación de laboratorios
            </h4>
            <p className="text-sm text-gray-500 mb-4 h-10">
              Interpretación clara de resultados y recomendaciones médicas.
            </p>
            <a
              href="#"
              className="text-rose-500 text-sm font-medium hover:underline"
            >
              Ver detalles →
            </a>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">
              Seguimiento médico
            </h4>
            <p className="text-sm text-gray-500 mb-4 h-10">
              Acompañamiento para pacientes en tratamiento o control.
            </p>
            <a
              href="#"
              className="text-rose-500 text-sm font-medium hover:underline"
            >
              Ver detalles →
            </a>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Services;
