import { deleteScheduleExceptionAction } from "@/actions/scheduleExceptionActions";
import DeleteButton from "@/components/ui/DeleteButton";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { ScheduleExceptionDetailDTO } from "@/types/ScheduleException";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ScheduleExceptionCard from "@/components/admin/schedule-exceptions/ScheduleExceptionCard";

const ScheduleExceptionsPage = async () => {
  const token = (await getServerSession(authOptions))?.user?.backendToken;
  if (!token) {
    return <p className="p-8">Debes iniciar sesión para continuar</p>;
  }

  const data: ScheduleExceptionDetailDTO[] =
    await ScheduleExceptionService.get(token);
  return (
    <div>
      <h2 className="text-2xl font-bold">Excepciones de horarios</h2>
      <Link
        className="btn btn-primary my-6"
        href={"/admin/schedule-exceptions/new"}
      >
        Crear nueva excepción
      </Link>

      <div className="flex flex-wrap gap-4 mt-6">
        {data.map((exception) => (
          <ScheduleExceptionCard
            key={exception.id}
            scheduleException={exception}
          >
            <div className="flex items-center justify-end gap-2 mt-auto pt-2 border-t border-gray-50">
              <Link
                href={`/admin/schedule-exceptions/edit/${exception.id}`}
                className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Editar
              </Link>

              <div className="[&>button]:text-sm [&>button]:font-medium [&>button]:text-red-600 [&>button]:bg-red-50 hover:[&>button]:bg-red-100 [&>button]:px-3 [&>button]:py-1.5 [&>button]:rounded-md [&>button]:transition-colors">
                <DeleteButton
                  action={deleteScheduleExceptionAction}
                  id={exception.id}
                  name="excepción"
                  token={token}
                >
                  Eliminar
                </DeleteButton>
              </div>
            </div>
          </ScheduleExceptionCard>
        ))}
      </div>
    </div>
  );
};
export default ScheduleExceptionsPage;
