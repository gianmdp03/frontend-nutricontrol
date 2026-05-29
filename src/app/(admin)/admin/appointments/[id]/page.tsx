import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppointmentService } from "@/services/AppointmentService";
import { notFound, redirect } from "next/navigation";
import AdminAppointmentDetailClient from "@/components/admin/AdminAppointmentDetailClient";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAppointmentDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ROLE_ADMIN") {
    redirect("/profile");
  }

  const { id } = await params;
  const appointmentId = parseInt(id, 10);

  if (isNaN(appointmentId)) {
    notFound();
  }

  const token = session.user.backendToken || "";
  let appointment = null;

  try {
    appointment = await AppointmentService.getAppointmentById(appointmentId, token);
  } catch (error) {
    console.error("Error fetching appointment detail page:", error);
    notFound();
  }

  if (!appointment) {
    notFound();
  }

  return <AdminAppointmentDetailClient appointment={appointment} />;
}
