"use client";

import { useSession } from "next-auth/react";
import HomeNavbar from "./HomeNavbar";
import AdminNavbar from "./AdminNavbar";
import AppointmentPatientNavbar from "./AppointmentPatientNavbar";

type Props = {
  variant: "HOME" | "ADMIN" | "APPOINTMENT_PATIENT";
};

export default function Navbar({ variant }: Props) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (variant === "HOME") {
    return <HomeNavbar session={session} isAuthenticated={isAuthenticated} />;
  } else if (variant === "ADMIN") {
    return <AdminNavbar session={session} isAuthenticated={isAuthenticated} />;
  } else if (variant === "APPOINTMENT_PATIENT") {
    return <AppointmentPatientNavbar session={session} isAuthenticated={isAuthenticated} />
  }
}
