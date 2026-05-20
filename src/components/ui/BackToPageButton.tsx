import Link from "next/link";

const BackToPageButton = () => {
  return (
    <Link
      href="/"
      className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50/50 shadow-sm transition-all duration-300 hover:-translate-x-1 font-medium text-sm active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>Volver a la página principal</span>
    </Link>
  );
};

export default BackToPageButton;
