"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not render Sidebar on the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
