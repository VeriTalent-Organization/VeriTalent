"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client component that guards dashboard routes and ensures user is authenticated
 * Redirects to home page if no token is found after hydration
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useCreateUserStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand persist to hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 150); // 150ms for persistence to complete

    return () => clearTimeout(timer);
  }, []);

  // Compute authorization state based on hydration and user
  const isAuthorized = useMemo(() => {
    if (!isHydrated) return false;
    if (user?.is_switching_role) return true;
    return !!(user && user.token);
  }, [isHydrated, user]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isHydrated) return;

    // Don't redirect if user is currently switching roles
    if (user?.is_switching_role) {
      console.log('[AuthGuard] Role switch in progress, skipping redirect check');
      return;
    }

    // Check if user has token
    if (!user || !user.token) {
      console.log('[AuthGuard] No token found, redirecting to login');
      router.replace("/");
    }
  }, [isHydrated, user, router]);

  // Show loading while hydrating or checking auth
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
