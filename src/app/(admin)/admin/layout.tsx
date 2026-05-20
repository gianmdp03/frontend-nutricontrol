import AdminNavbar from "@/components/layout/AdminNavbar";
import Navbar from "@/components/layout/Navbar";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}
export default function AdminLayout({
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
