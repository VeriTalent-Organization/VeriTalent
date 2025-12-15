"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/sidebar";
import DashboardHeader from "@/components/Dashboard/header";
import { useIsMobile } from "@/lib/configs/use-mobile";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
       <div className="flex-1 overflow-auto">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)}/>
        {children}
      </div>
    </div>
  );
}
