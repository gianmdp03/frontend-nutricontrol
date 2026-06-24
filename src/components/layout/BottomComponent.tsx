export default function BottomComponent() {
  return (
    <aside className="bg-gray-50 py-6 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 text-center sm:text-left">
        <div className="text-rose-500 shrink-0 mt-0.5 sm:mt-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-bold text-slate-700">Aviso médico:</span> Esta
          consulta virtual no sustituye una emergencia médica. Si presenta dolor
          en el pecho, dificultad para respirar, pérdida de conciencia, sangrado
          abundante o síntomas graves, acuda inmediatamente a emergencias.
        </p>
      </div>
    </aside>
  );
}
