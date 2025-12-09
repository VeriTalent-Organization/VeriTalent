"use client";

import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  FileCheck, 
  Bell, 
  User, 
  LogOut 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", href: "/dashboard" },
    { icon: FileText, label: "Post Job/CV Upload/VeriTalent IDs Upload", id: "post-job", href: "/dashboard/postAJob" },
    { icon: ClipboardList, label: "Screening Interface", id: "screening", href: "/dashboard/screening" },
    { icon: FileCheck, label: "Recommendation Issuance", id: "recommendation", href: "/dashboard/recommendation" },
    { icon: Bell, label: "Notifications", id: "notifications", href: "/dashboard/notifications" },
    { icon: User, label: "Profile", id: "profile", href: "/dashboard/profile" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L5 15L20 25L35 15L20 5Z" fill="#0D7490" />
            <path d="M5 25L20 35L35 25" stroke="#0D7490" strokeWidth="2" />
          </svg>
          <span className="text-xl font-bold text-gray-800">VeriTalent</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Mike Oparaji</div>
            <div className="text-xs text-gray-500">Independent Recruiter</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
