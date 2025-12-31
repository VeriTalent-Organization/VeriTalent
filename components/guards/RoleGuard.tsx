'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

type AllowedRole = 'talent' | 'recruiter' | 'org_admin';

interface RoleGuardProps {
  allowedRoles: AllowedRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard component to protect routes based on user's active role.
 * Redirects users to appropriate page if they don't have the required role.
 */
export default function RoleGuard({ allowedRoles, children, redirectTo }: RoleGuardProps) {
  const { user } = useCreateUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user?.active_role) {
      // No active role, redirect to dashboard
      router.push('/dashboard');
      return;
    }

    if (!allowedRoles.includes(user.active_role)) {
      // User doesn't have permission, redirect based on their role
      const destination = redirectTo || getDefaultRouteForRole(user.active_role);
      router.push(destination);
    }
  }, [user?.active_role, allowedRoles, router, redirectTo]);

  // Don't render children if user doesn't have the required role
  if (!user?.active_role || !allowedRoles.includes(user.active_role)) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Helper function to get default route for each role
 */
function getDefaultRouteForRole(role: AllowedRole): string {
  switch (role) {
    case 'talent':
      return '/dashboard/ai-card';
    case 'recruiter':
    case 'org_admin':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
