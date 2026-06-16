"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNotification } from "./NotificationProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    isConnected,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateVal?: any) => {
    if (!dateVal) return "";
    try {
      const parseDateSafe = (dateVal: any): Date => {
        if (!dateVal) return new Date(0);
        if (dateVal instanceof Date) return dateVal;
        if (typeof dateVal === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateVal)) {
          const [datePart, timePart = ""] = dateVal.split(" ");
          const [day, month, year] = datePart.split("/").map(Number);
          const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(":").map(Number) : [];
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (Array.isArray(dateVal)) {
          const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (typeof dateVal === "object") {
          const year = dateVal.year || dateVal.yearValue || 0;
          const month = dateVal.monthValue || dateVal.month || 1;
          const day = dateVal.dayOfMonth || dateVal.day || 1;
          const hour = dateVal.hour || dateVal.hours || 0;
          const minute = dateVal.minute || dateVal.minutes || 0;
          const second = dateVal.second || dateVal.seconds || 0;
          if (year > 0) {
            let monthIndex = 0;
            if (typeof month === "number") {
              monthIndex = month - 1;
            } else if (typeof month === "string") {
              const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
              const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
              const mLower = month.toLowerCase();
              const idx = months.indexOf(mLower);
              if (idx !== -1) monthIndex = idx;
              else {
                const idxShort = shortMonths.indexOf(mLower.substring(0, 3));
                if (idxShort !== -1) monthIndex = idxShort;
              }
            }
            return new Date(year, monthIndex, day, hour, minute, second);
          }
        }
        const parsed = new Date(dateVal);
        if (isNaN(parsed.getTime())) {
          const fallback = new Date(`${dateVal}T12:00:00`);
          return isNaN(fallback.getTime()) ? parsed : fallback;
        }
        return parsed;
      };

      const parsedDate = parseDateSafe(dateVal);
      return parsedDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Botón de la Campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-rose-500 rounded-full hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-95"
        aria-label="Notificaciones"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "scale-110" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Indicador de número no leído */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(244,63,94,0.3)] animate-pulse"
            >
              {unreadCount > 9 ? "+9" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown elegante de Notificaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100/80 z-50 overflow-hidden"
          >
            {/* Header del dropdown */}
            <div className="px-5 py-4 bg-linear-to-r from-rose-50 to-orange-50/30 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Notificaciones</h3>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                    }`}
                    title={isConnected ? "Conectado en tiempo real" : "Reconectando con el servidor..."}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {unreadCount > 0
                    ? `Tienes ${unreadCount} alertas sin leer`
                    : "No tienes alertas pendientes"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Marcar todo leído
                </button>
              )}
            </div>

            {/* Listado de notificaciones */}
            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
              <AnimatePresence initial={false}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 flex items-start gap-3 hover:bg-slate-50/80 transition-colors group relative"
                    >
                      {/* Icono decorativo según tipo */}
                      <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      {/* Mensaje */}
                      <div className="flex-1 min-w-0 pr-8">
                        <p className="text-xs text-slate-700 font-medium leading-relaxed break-words">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-1 block">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>

                      {/* Botones de acción rápidos (Marcar leído / Eliminar) */}
                      <div className="absolute right-3 top-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 hover:bg-slate-200 text-slate-400 hover:text-emerald-600 rounded-full transition-colors"
                          title="Marcar como leída"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-700 text-xs sm:text-sm">Bandeja de entrada vacía</h4>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                      Las alertas automáticas o mensajes en tiempo real aparecerán aquí cuando estén disponibles.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer del dropdown */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={deleteAllNotifications}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  Eliminar todo el historial
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
