"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/components/layout/NotificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </SessionProvider>
  );
}