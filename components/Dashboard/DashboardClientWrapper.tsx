"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/sidebar";
import DashboardHeader from "@/components/Dashboard/header";
import RoleRouteGuard from "@/components/guards/RoleRouteGuard";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper for dashboard that handles client-side interactions
 * like sidebar toggle, while the parent layout remains server-side
 */
export default function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <RoleRouteGuard />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
