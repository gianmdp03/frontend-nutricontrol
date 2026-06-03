import { ScheduleExceptionDetailDTO } from "@/types/ScheduleException";
import { ReactNode } from "react";

type Props = {
  scheduleException: ScheduleExceptionDetailDTO;
  children: ReactNode;
};

const ScheduleExceptionCard = ({ scheduleException, children }: Props) => {
  return (
    <div className="w-full sm:w-72 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>

      <div className="border-b border-gray-100 pb-3 mb-3 mt-1 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800 capitalize">
            {new Date(`${scheduleException.date}T12:00:00`).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>

          {scheduleException.reason && (
            <span className="inline-block mt-1.5 bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-md border border-amber-100 font-medium">
              {scheduleException.reason}
            </span>
          )}
        </div>

        <svg
          className="w-5 h-5 text-amber-500 shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 12v4m0 4h.01"
          ></path>
        </svg>
      </div>

      <div className="space-y-2 mb-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span>
            Desde:{" "}
            <span className="font-medium text-gray-900">
              {String(scheduleException.startTime)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span>
            Hasta:{" "}
            <span className="font-medium text-gray-900">
              {String(scheduleException.endTime)}
            </span>
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ScheduleExceptionCard;
