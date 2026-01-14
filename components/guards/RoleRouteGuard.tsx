'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { userTypes } from '@/types/user_type';

/**
 * Route configuration for each role
 * Each role has a list of allowed routes and a default/first route
 */
const roleRoutes = {
  [userTypes.TALENT]: {
    allowedRoutes: [
      '/dashboard/ai-card',
      '/dashboard/career-repository',
      '/dashboard/jobs',
      '/dashboard/notifications',
      '/dashboard/profile',
      '/dashboard/points', // Shared route
    ],
    defaultRoute: '/dashboard/ai-card',
  },
  [userTypes.INDEPENDENT_RECRUITER]: {
    allowedRoutes: [
      '/dashboard',
      '/dashboard/jobs',
      '/dashboard/postAJob',
      '/dashboard/screening',
      '/dashboard/recommendation',
      '/dashboard/notifications',
      '/dashboard/profile',
      '/dashboard/points', // Shared route
    ],
    defaultRoute: '/dashboard',
  },
  [userTypes.ORGANISATION]: {
    allowedRoutes: [
      '/dashboard',
      '/dashboard/jobs',
      '/dashboard/postAJob',
      '/dashboard/screening',
      '/dashboard/lp-agent',
      '/dashboard/references',
      '/dashboard/account',
      '/dashboard/profile',
      '/dashboard/points', // Shared route
    ],
    defaultRoute: '/dashboard',
  },
};

/**
 * RoleRouteGuard component protects dashboard routes based on user's role
 * Redirects to role-specific default route if user tries to access unauthorized route
 */
export default function RoleRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, _hasHydrated } = useCreateUserStore();
  const isRedirecting = useRef(false);
  const lastCheckedPath = useRef<string | null>(null);
  const lastUserType = useRef<userTypes | null>(null);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Wait for store to hydrate before checking routes
    if (!_hasHydrated || !user?.user_type || !pathname) {
      console.log('[RoleRouteGuard] Waiting:', { _hasHydrated, user_type: user?.user_type, pathname });
      return;
    }
    
    // Skip if currently redirecting
    if (isRedirecting.current) {
      console.log('[RoleRouteGuard] Redirect in progress, skipping check');
      return;
    }
    
    // Skip if we already checked this exact pathname for this user type
    if (lastCheckedPath.current === pathname && lastUserType.current === user.user_type) {
      console.log('[RoleRouteGuard] Already checked:', { pathname, user_type: user.user_type });
      return;
    }

    // Clear any pending redirect timer
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }

    const userRoleConfig = roleRoutes[user.user_type];
    
    if (!userRoleConfig) {
      console.warn('[RoleRouteGuard] Unknown user role:', user.user_type);
      return;
    }

    // Check if current route is allowed for this role
    const isAllowedRoute = userRoleConfig.allowedRoutes.some((allowedRoute) => {
      // Exact match or starts with the allowed route (for nested routes)
      return pathname === allowedRoute || pathname.startsWith(`${allowedRoute}/`);
    });

    // If route is not allowed, redirect to default route for this role
    if (!isAllowedRoute) {
      console.log('[RoleRouteGuard] Unauthorized route access:', {
        role: user.user_type,
        attemptedRoute: pathname,
        redirectingTo: userRoleConfig.defaultRoute,
      });
      
      // Mark as redirecting immediately
      isRedirecting.current = true;
      lastCheckedPath.current = userRoleConfig.defaultRoute;
      lastUserType.current = user.user_type;
      
      // Perform redirect
      router.replace(userRoleConfig.defaultRoute);
      
      // Reset redirect flag after delay
      redirectTimer.current = setTimeout(() => {
        isRedirecting.current = false;
      }, 1500);
    } else {
      // Route is allowed, update tracking
      lastCheckedPath.current = pathname;
      lastUserType.current = user.user_type;
    }
  }, [pathname, user?.user_type, _hasHydrated]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
