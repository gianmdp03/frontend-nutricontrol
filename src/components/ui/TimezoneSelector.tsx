"use client";

import { useState, useEffect, useMemo } from "react";
import Select, { type SingleValue } from "react-select";
import { getAllTimezones } from "countries-and-timezones";

interface TimezoneOption {
  value: string; // IANA timezone ID, e.g., "America/Santo_Domingo"
  label: string; // Visual format: "(UTC-04:00) Santo Domingo"
  offsetMinutes: number;
}

interface TimezoneSelectorProps {
  label?: string;
  error?: string;
  value?: string; // Controlled value from parent form (IANA string)
  onChange?: (timezone: { value: string; label: string }) => void;
}

/**
 * Calculates the current real-time UTC offset for a specific IANA timezone.
 * Handles Daylight Saving Time (DST) transitions dynamically based on the current date.
 */
function getTimezoneOffsetNow(timeZone: string): { offsetMinutes: number; offsetStr: string } {
  try {
    const date = new Date();
    // Format current date parts in the target timezone
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      hourCycle: "h23",
    }).formatToParts(date);

    const p: Record<string, string> = {};
    for (const part of parts) {
      p[part.type] = part.value;
    }

    const year = parseInt(p.year, 10);
    const month = parseInt(p.month, 10) - 1; // 0-indexed month
    const day = parseInt(p.day, 10);
    const hour = parseInt(p.hour, 10);
    const minute = parseInt(p.minute, 10);
    const second = parseInt(p.second, 10);

    // Create target timestamp in UTC from the localized parts
    const targetDate = Date.UTC(year, month, day, hour, minute, second);
    
    // Difference in minutes between target timezone and actual UTC
    const diffMinutes = Math.round((targetDate - date.getTime()) / 60000);

    const sign = diffMinutes >= 0 ? "+" : "-";
    const absDiff = Math.abs(diffMinutes);
    const hours = String(Math.floor(absDiff / 60)).padStart(2, "0");
    const mins = String(absDiff % 60).padStart(2, "0");

    return {
      offsetMinutes: diffMinutes,
      offsetStr: `${sign}${hours}:${mins}`,
    };
  } catch (error) {
    // Return UTC fallback if timezone is unsupported or calculation fails
    return { offsetMinutes: 0, offsetStr: "+00:00" };
  }
}

export default function TimezoneSelector({
  label = "Zona horaria",
  error,
  value,
  onChange,
}: TimezoneSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const [localTimezone, setLocalTimezone] = useState<string>("");

  // 3. Iterar sobre las zonas de countries-and-timezones y calcular el offset de UTC REAL y actual
  const options = useMemo<TimezoneOption[]>(() => {
    try {
      const allTz = getAllTimezones();
      
      const tzOptions = Object.keys(allTz).map((tzName) => {
        const { offsetMinutes, offsetStr } = getTimezoneOffsetNow(tzName);
        
        // 4. Formato visual de cada opción (etiqueta limpia y amigable)
        // Extraemos solo la región/ciudad final (ej. America/Argentina/Buenos_Aires -> Buenos Aires)
        const nameParts = tzName.split("/");
        const displayCity = nameParts[nameParts.length - 1].replace(/_/g, " ");

        return {
          value: tzName,
          label: `(UTC${offsetStr}) ${displayCity}`,
          offsetMinutes,
        };
      });

      // 7. Ordenar de Oeste a Este según su offset
      return tzOptions.sort((a, b) => {
        if (a.offsetMinutes !== b.offsetMinutes) {
          return a.offsetMinutes - b.offsetMinutes;
        }
        return a.label.localeCompare(b.label);
      });
    } catch (err) {
      console.error("Error generating timezone options:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // 5. Detectar automáticamente la zona horaria del navegador
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalTimezone(detectedTz);

    // Si hay un callback de onChange y no se pasó un valor controlado desde el exterior,
    // notificamos la zona horaria detectada al formulario.
    if (onChange && !value) {
      const matchedOpt = options.find((opt) => opt.value === detectedTz);
      if (matchedOpt) {
        onChange({ value: matchedOpt.value, label: matchedOpt.label });
      } else {
        onChange({ value: detectedTz, label: detectedTz.replace(/_/g, " ") });
      }
    }
  }, [onChange, value, options]);

  const handleTimezoneChange = (selected: SingleValue<TimezoneOption>) => {
    if (selected && onChange) {
      // 6. Retornar el objeto con valor de IANA string para el backend
      onChange({ value: selected.value, label: selected.label });
    }
  };

  // Evitar problemas de hidratación en Next.js (SSR vs CSR)
  if (!mounted) {
    return (
      <div className="w-full mb-4 animate-pulse">
        {label && (
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
      </div>
    );
  }

  const selectedValue = options.find((opt) => opt.value === (value || localTimezone)) || null;

  // Estilos de react-select adaptados para verse premium y limpios con Tailwind
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "0.5rem", // rounded-lg
      borderColor: error ? "#ef4444" : state.isFocused ? "#f43f5e" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(244, 63, 94, 0.2)"
        : "none",
      minHeight: "44px",
      fontSize: "0.875rem",
      backgroundColor: "white",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: error ? "#ef4444" : state.isFocused ? "#f43f5e" : "#a1a1aa",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#f43f5e"
        : state.isFocused
        ? "#ffe4e6"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      fontSize: "0.875rem",
      cursor: "pointer",
      padding: "10px 12px",
      "&:active": {
        backgroundColor: "#f43f5e",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#1f2937",
    }),
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <Select<TimezoneOption>
          value={selectedValue}
          onChange={handleTimezoneChange}
          options={options}
          isSearchable={true} // 2. Búsquedas activadas
          styles={customStyles}
          placeholder="Selecciona una zona horaria..."
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
