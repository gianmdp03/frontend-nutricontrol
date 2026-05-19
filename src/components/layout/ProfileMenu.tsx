"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Props = {
  session: Session | null;
  theme?: "light" | "dark";
  align?: "left" | "right";
};

export default function ProfileMenu({ session, theme = "light", align = "right" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const userName = session.user?.name || "Usuario";
  const userRole =
    session.user?.role === "ROLE_ADMIN" ? "Administrador" : "Paciente";
  const nameParts = userName.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : userName.substring(0, 2).toUpperCase();

  const isDark = theme === "dark";
  const alignClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-1.5 rounded-full transition-all duration-200 ${
          isDark
            ? "hover:bg-slate-800 focus:ring-slate-700"
            : "hover:bg-slate-100 focus:ring-rose-500/20"
        } focus:outline-none focus:ring-2`}
      >
        <div className="text-right hidden sm:block">
          <p
            className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            {userName}
          </p>
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {userRole}
          </p>
        </div>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
          {initials}
        </div>

        {/* Chevron down */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${isDark ? "text-slate-400" : "text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute ${alignClass} mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden z-50 transform opacity-100 scale-100 transition-all duration-200`}>
          <div className="p-2 border-b border-slate-100 sm:hidden">
            <p className="text-sm font-bold text-slate-800 px-3 py-1.5 truncate">
              {userName}
            </p>
            <p className="text-xs text-slate-500 px-3 pb-1.5">{userRole}</p>
          </div>

          <div className="p-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Ver perfil
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
