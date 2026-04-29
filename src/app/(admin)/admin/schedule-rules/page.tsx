import { deleteScheduleRuleAction } from "@/actions/scheduleRuleActions";
import DeleteButton from "@/components/ui/DeleteButton";
import ScheduleRuleCard from "@/components/ui/ScheduleRuleCard";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { daysTranslation } from "@/utils/dictionaries";
import Link from "next/link";

const ScheduleRulesPage = async () => {
  const data = await ScheduleRuleService.get();
  return (
    <div>
      <h2 className="text-2xl font-bold">Dias de trabajo</h2>
      <Link className="btn btn-primary my-6" href={"/admin/schedule-rules/new"}>
        Crear nuevo día de trabajo
      </Link>

      <div className="flex flex-wrap gap-4 mt-6">
        {data.map((scheduleRule) => (
          <ScheduleRuleCard key={scheduleRule.id} scheduleRule={scheduleRule}>
            <div className="flex items-center justify-end gap-2 mt-auto pt-2 border-t border-gray-50">
              <Link
                href={`/admin/schedule-rules/edit/${scheduleRule.id}`}
                className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Editar
              </Link>

              <div className="[&>button]:text-sm [&>button]:font-medium [&>button]:text-red-600 [&>button]:bg-red-50 hover:[&>button]:bg-red-100 [&>button]:px-3 [&>button]:py-1.5 [&>button]:rounded-md [&>button]:transition-colors">
                <DeleteButton
                  action={deleteScheduleRuleAction}
                  id={scheduleRule.id}
                  name="día"
                >
                  Eliminar
                </DeleteButton>
              </div>
            </div>
          </ScheduleRuleCard>
        ))}
      </div>
    </div>
  );
};

export default ScheduleRulesPage;
