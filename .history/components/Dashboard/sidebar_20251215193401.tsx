"use client";

import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  FileCheck,
  CreditCard,
  Briefcase,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";

// Define user role type
type UserRole =
  | userTypes.TALENT
  | userTypes.INDEPENT_RECRUITER
  | userTypes.ORGANISATION;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useCreateUserStore();

  // Map user types to display labels
  const roleLabels: Record<UserRole, string> = {
    [userTypes.TALENT]: "Talent",
    [userTypes.INDEPENT_RECRUITER]: "Independent Recruiter",
    [userTypes.ORGANISATION]: "Company Administrator",
  };

  // Menu items based on role
  const getMenuItems = () => {
    switch (user.user_type) {
      case userTypes.TALENT:
        return [
          { icon: CreditCard, label: "Veritalent AI Card", href: "/dashboard/ai-card" },
          { icon: FileText, label: "Career Repository", href: "/dashboard/career-repository" },
          { icon: Briefcase, label: "Jobs & Opportunities", href: "/dashboard/jobs" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      case userTypes.INDEPENT_RECRUITER:
        return [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
          { icon: ClipboardList, label: "Screening Interface", href: "/dashboard/screening" },
          { icon: FileCheck, label: "Recommendation Issuance", href: "/dashboard/recommendation" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      case userTypes.ORGANISATION:
        return [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
          { icon: ClipboardList, label: "Screening Interface", href: "/dashboard/screening" },
          { icon: FileCheck, label: "References & Verifications", href: "/dashboard/references" },
          { icon: Settings, label: "Account Management", href: "/dashboard/account" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Determine active route
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-9999 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div 
        className={`fixed lg:static z-9999 bg-white border-r w-64 h-full max-h-dvh transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 flex justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L5 15L20 25L35 15L20 5Z" fill="#0D7490" />
              <path d="M5 25L20 35L35 25" stroke="#0D7490" strokeWidth="2" />
            </svg>
            <span className="text-xl font-bold text-gray-800">VeriTalent</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 pb-6 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            {roleLabels[user.user_type as UserRole]}
          </div>
          <div className="mt-1 font-medium text-gray-900">
            {user.full_name || "Guest User"}
          </div>
          <div className="text-xs text-gray-500">
            {user.email || "No email set"}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
