import { ScheduleRuleDetailDTO } from "@/types/ScheduleRule";
import { daysTranslation } from "@/utils/dictionaries";
import { ReactNode } from "react";

type Props = {
  scheduleRule: ScheduleRuleDetailDTO;
  children: ReactNode;
};

const ScheduleRuleCard = ({ scheduleRule, children }: Props) => {
  return (
    <div className="w-full sm:w-72 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 capitalize">
          {daysTranslation[scheduleRule.dayOfWeek]}
        </h3>
        <svg
          className="w-5 h-5 text-gray-400"
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
        </svg>
      </div>

      <div className="space-y-2 mb-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>
            Apertura:{" "}
            <span className="font-medium text-gray-900">
              {String(scheduleRule.startTime)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span>
            Cierre:{" "}
            <span className="font-medium text-gray-900">
              {String(scheduleRule.endTime)}
            </span>
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ScheduleRuleCard;
