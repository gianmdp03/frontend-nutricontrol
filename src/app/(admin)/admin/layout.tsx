import AdminNavbar from "@/components/layout/AdminNavbar";
import Navbar from "@/components/layout/Navbar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
interface Props {
  session: Session | null;
  isAuthenticated: boolean;
  children: ReactNode;
}
export default function AdminLayout({
  session,
  isAuthenticated,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar variant="ADMIN" />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
