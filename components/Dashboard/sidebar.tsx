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
  Plus,
  ChevronDown,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";
import Image from "next/image";
import Icons from "@/lib/configs/icons.config";
import { authService } from "@/lib/services/authService";
import { tokensService } from "@/lib/services/tokensService";
import { useState, useEffect } from "react";
import RoleSwitchOnboardingModal from "./RoleSwitchOnboardingModal";

type UserRole = userTypes.TALENT | userTypes.INDEPENDENT_RECRUITER | userTypes.ORGANISATION;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, updateUser, logout } = useCreateUserStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [targetRole, setTargetRole] = useState<'talent' | 'recruiter' | 'org_admin' | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Fetch token balance function
  const fetchBalance = async () => {
    if (!user?.token) {
      setLoadingBalance(false);
      return;
    }

    try {
      const balance = await tokensService.getBalance();
      console.log('[Sidebar] Token balance:', balance);
      // Extract from nested data structure
      const balanceAmount = balance?.data?.totalAvailable || balance?.data?.personal || balance?.balance || 0;
      setTokenBalance(balanceAmount);
    } catch (error) {
      console.error('[Sidebar] Failed to fetch token balance:', error);
      setTokenBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Fetch token balance on mount and when role changes
  useEffect(() => {
    fetchBalance();
  }, [user?.token, user?.active_role]);

  // Listen for balance update events from other components
  useEffect(() => {
    const handleBalanceUpdate = () => {
      console.log('[Sidebar] Balance update event received, refetching...');
      fetchBalance();
    };

    window.addEventListener('tokenBalanceUpdated', handleBalanceUpdate);

    return () => {
      window.removeEventListener('tokenBalanceUpdated', handleBalanceUpdate);
    };
  }, [user?.token]);

  // Safe defaults when user is null (not logged in)
  // Map backend activeRole to userTypes enum
  const mapRoleToUserType = (role?: 'talent' | 'recruiter' | 'org_admin'): UserRole => {
    if (role === 'recruiter') return userTypes.INDEPENDENT_RECRUITER;
    if (role === 'org_admin') return userTypes.ORGANISATION;
    return userTypes.TALENT;
  };

  const currentRole = mapRoleToUserType(user?.active_role);
  const displayName = user?.full_name || "Guest User";
  const displayEmail = user?.primary_email || user?.email || "No email set";

  // Role labels
  const roleLabels: Record<UserRole, string> = {
    [userTypes.TALENT]: "Talent",
    [userTypes.INDEPENDENT_RECRUITER]: "Independent Recruiter",
    [userTypes.ORGANISATION]: "Company Administrator",
  };

  // Menu items based on role — safe fallback
  const getMenuItems = () => {
    switch (currentRole) {
      case userTypes.TALENT:
        return [
          { icon: CreditCard, label: "Veritalent AI Card", href: "/dashboard/ai-card" },
          { icon: FileText, label: "Career Repository", href: "/dashboard/career-repository" },
          { icon: Briefcase, label: "Jobs & Opportunities", href: "/dashboard/jobs" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      case userTypes.INDEPENDENT_RECRUITER:
        return [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: Briefcase, label: "My Posted Jobs", href: "/dashboard/jobs" },
          { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
          { icon: ClipboardList, label: "Screened Results & Shortlisting", href: "/dashboard/screening" },
          { icon: FileCheck, label: "Recommendation Issuance", href: "/dashboard/recommendation" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      case userTypes.ORGANISATION:
        return [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
          { icon: Briefcase, label: "My Posted Jobs", href: "/dashboard/jobs" },
          { icon: FileText, label: "Post Job / Uploads", href: "/dashboard/postAJob" },
          { icon: ClipboardList, label: "Screened Results & Shortlisting", href: "/dashboard/screening" },
          { icon: ClipboardList, label: "Institutional LPI Agent", href: "/dashboard/lp-agent" },
          { icon: FileCheck, label: "References & Verifications", href: "/dashboard/references" },
          { icon: Settings, label: "Account Management", href: "/dashboard/account" },
          { icon: User, label: "Profile", href: "/dashboard/profile" },
        ];

      default:
        return []; // Fallback — empty menu
    }
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleRoleSwitch = async (newRole: 'talent' | 'recruiter' | 'org_admin') => {
    if (isSwitching) return;

    // Check if user already has this role in their roles array
    const alreadyHasRole = user?.roles?.includes(newRole) || false;

    console.log('[Sidebar] handleRoleSwitch called:', {
      newRole,
      currentRoles: user?.roles,
      alreadyHasRole
    });

    if (alreadyHasRole) {
      // Condition 1: User already has this role - switch directly without any form
      setIsSwitching(true);
      try {
        console.log('[Sidebar] Switching to role:', newRole);
        const switchResponse = await authService.switchRole({ role: newRole });
        console.log('[Sidebar] Switch response:', switchResponse);

        // Extract new token from response
        const newToken = switchResponse?.token || switchResponse?.access_token;
        
        console.log('[Sidebar] Has token in response:', !!newToken);

        // Update both active_role and user_type in store
        const user_type = mapRoleToUserType(newRole);
        
        console.log('[Sidebar] Updating store with:', {
          active_role: newRole,
          user_type,
          hasNewToken: !!newToken
        });
        
        updateUser({ 
          active_role: newRole,
          user_type,
          token: newToken || user?.token || '' // Use new token if available
        });
        
        console.log('[Sidebar] Store updated, closing role switcher');
        setShowRoleSwitcher(false);
        
        // Redirect to appropriate landing page for the new role
        if (newRole === 'talent') {
          router.push('/dashboard/ai-card');
        } else {
          router.push('/dashboard');
        }
        
        console.log('[Sidebar] Role switch complete, redirecting to appropriate page');
      } catch (error) {
        console.error('Role switch failed:', error);
        alert('Failed to switch role. Please try again.');
      } finally {
        setIsSwitching(false);
      }
    } else {
      // Condition 2: User doesn't have this role - show onboarding modal
      // Required info needs to be filled before switching
      setTargetRole(newRole);
      setShowOnboardingModal(true);
      setShowRoleSwitcher(false);
    }
  };

  const availableRoles = [
    { value: 'talent' as const, label: 'Talent', type: userTypes.TALENT },
    { value: 'recruiter' as const, label: 'Independent Recruiter', type: userTypes.INDEPENDENT_RECRUITER },
    { value: 'org_admin' as const, label: 'Company Administrator', type: userTypes.ORGANISATION },
  ].filter(role => {
    // Show all roles except the current active one
    // This allows users to add new roles they don't have yet
    return role.value !== user?.active_role;
  });

  const handleLogout = () => {
    logout();
    localStorage.removeItem('hasEverRegistered');
    router.push('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-900 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed lg:static z-9999 bg-white border-r w-64 h-screen flex flex-col overflow-y-auto transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-3 pl-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src={Icons.veritalentLogo} alt="VeriTalent logo" height={150} width={150} unoptimized />
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
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {roleLabels[currentRole]}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-1 font-medium text-gray-900">
              {displayName}
            </div>
            <div className="text-xs text-gray-500">
              {displayEmail}
            </div>
          </button>

          {/* Role Switcher Dropdown */}
          {showRoleSwitcher && (
            <div className="mt-3 bg-gray-50 rounded-lg p-2 space-y-1">
              {availableRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSwitch(role.value)}
                  disabled={isSwitching}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isSwitching ? 'animate-spin' : ''}`} />
                  Switch to {role.label}
                </button>
              ))}
            </div>
          )}
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

        {/* AI Points */}
        <Link
          href="/dashboard/points"
          className="m-4 px-4 py-2.5 flex justify-between items-center bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            AI Points
            <span className="text-md font-bold">
              {loadingBalance ? '...' : tokenBalance}
            </span>
          </div>
          <Plus className="w-4 h-4" />
        </Link>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Role Switch Onboarding Modal */}
      {targetRole && (
        <RoleSwitchOnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            setTargetRole(null);
          }}
          targetRole={targetRole}
          onComplete={() => {
            setShowOnboardingModal(false);
            setTargetRole(null);
          }}
        />
      )}
    </>
  );
}