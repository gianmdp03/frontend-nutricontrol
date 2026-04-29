"use client"

import { createScheduleRuleAction } from "@/actions/scheduleRuleActions"
import ScheduleRuleForm from "@/components/admin/schedule-rules/ScheduleRuleForm"
import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema"

const NewScheduleRulePage = () => {
    const onSubmitCreate = async (data: ScheduleRuleFormValues) => {
        const result = await createScheduleRuleAction(data);
        if(result?.error){
            alert(result.error);
        }
    }

  return (
    <div className="p-8">
        <ScheduleRuleForm title="Crear nuevo dia de trabajo" onSubmit={onSubmitCreate} />
    </div>
  )
}

export default NewScheduleRulePage