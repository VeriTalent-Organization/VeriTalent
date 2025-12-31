"use client";

import { useEffect } from "react";
import { useCreateUserStore, type User } from "@/lib/stores/form_submission_store";
import { syncTokenToCookie } from "@/lib/utils/cookieUtils";
import { userTypes } from "@/types/user_type";
import type { UserMeResponseDto } from "@/lib/services/usersService";

interface StoreHydrationProps {
  userData: UserMeResponseDto | null;
}

// Type for talent profile
type TalentProfile = NonNullable<User['talentProfile']>;

/**
 * Map backend role to userTypes enum
 */
function mapRoleToUserType(role: string): userTypes {
  switch (role) {
    case 'talent':
      return userTypes.TALENT;
    case 'recruiter':
      return userTypes.INDEPENDENT_RECRUITER;
    case 'org_admin':
      return userTypes.ORGANISATION;
    default:
      console.warn('[StoreHydration] Unknown role:', role);
      return userTypes.TALENT; // fallback
  }
}

/**
 * Client component that hydrates the Zustand store with server-fetched user data
 * This runs once on mount to sync server data with client state
 * Also syncs token to cookie for server-side access
 */
export default function StoreHydration({ userData }: StoreHydrationProps) {
  const { user, updateUser } = useCreateUserStore();

  useEffect(() => {
    if (!userData) return;

    console.log('[StoreHydration] Hydrating store with user data:', userData);
    console.log('[StoreHydration] activeRole:', userData.activeRole, '→ will update store now');

    // Map activeRole to user_type
    const user_type = userData.activeRole ? mapRoleToUserType(userData.activeRole) : undefined;
    
    console.log('[StoreHydration] Mapped to user_type:', user_type);

    // Map backend response to store format
    updateUser({
      id: userData.id,
      veritalent_id: userData.veritalentId,
      full_name: userData.fullName,
      primary_email: userData.primaryEmail || userData.email,
      email: userData.email,
      roles: userData.roles,
      active_role: userData.activeRole,
      user_type, // ← Add this mapping
      location: userData.location,
      linked_emails: userData.onboarding?.linked_emails || [],
      
      // Role-specific fields - Organization
      organization_name: userData.organizationName,
      organization_domain: userData.organizationDomain,
      organization_linkedin_page: userData.organizationLinkedinPage,
      organisation_size: userData.organisationSize,
      organisation_rc_number: userData.organisationRcNumber,
      organisation_industry: userData.organisationIndustry,
      organisation_location: userData.organisationLocation,
      
      // Role-specific fields - Recruiter
      professional_status: userData.professionalStatus,
      current_designation: userData.professionalDesignation,
      organisation_name: userData.recruiterOrganizationName,
      
      // Talent onboarding data
      linkedin_connected: userData.onboarding?.linkedin_connected,
      cv_uploaded: userData.onboarding?.cv_source === 'upload',
      
      // Talent profile data
      talentProfile: userData.talentProfile as TalentProfile | undefined,
      
      profile_fetched: true,
    });
  }, [userData, updateUser]);

  // Sync token to cookie whenever user changes
  useEffect(() => {
    if (user?.token) {
      syncTokenToCookie(user.token);
    }
  }, [user?.token]);

  // This component doesn't render anything
  return null;
}
