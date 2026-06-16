"use client";

export default function AdminSidebarToggle() {
  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-admin-sidebar"));
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
      aria-label="Abrir menú de navegación"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
