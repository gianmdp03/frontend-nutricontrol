import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-slate-50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          &copy; {currentYear} Tu Médico RD. Todos los derechos reservados.
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Desarrollado por</span>
          <Link
            href="https://gianmdp03.github.io/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-500 hover:text-emerald-600 transition-colors duration-200"
          >
            Gianluca Castorina
          </Link>
        </div>
      </div>
    </footer>
  );
}
