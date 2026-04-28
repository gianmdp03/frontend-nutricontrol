import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="max-w-7xl w-full shrink-0 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
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
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">
            NutriControl
            <br />
            <span className="text-slate-600 font-medium">Familiar</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
            Consulta médica virtual
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
        <Link href="#hero" className="hover:text-rose-500">
          Inicio
        </Link>
        <Link href="#services" className="hover:text-rose-500">
          Servicios
        </Link>
        <Link href="#consultationInfo" className="hover:text-rose-500">
          Agenda tu consulta
        </Link>
        <Link href="#about" className="hover:text-rose-500">
          Sobre la doctora
        </Link>
      </div>

      <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        Reservar ahora
      </button>
    </nav>
  );
}
