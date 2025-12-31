'use client';

import { apiClient } from './apiClient';
import { userTypes } from '@/types/user_type';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { profilesService } from './profilesService';
import { usersService } from './usersService';
import { syncTokenToCookie } from '@/lib/utils/cookieUtils';

// Optional onboarding extras (Talent) to be supported by backend in register payload in future
export type CvSource = 'upload' | 'linkedin';
export interface TalentOnboardingExtras {
  linked_emails: string[];
  veritalent_id?: string;
  cv_source: CvSource;
  cv_key?: string;
  cv_file_name?: string;
  cv_mime_type?: string;
  cv_file_size?: number;
  cv_url?: string;
  cv_hash?: string;
  linkedin_connected?: boolean;
}

// DTOs
export interface RegisterDto {
  primaryEmail: string;
  password: string;
  fullName: string;
  location: string;
  role: 'talent' | 'recruiter' | 'org_admin';
  accountType: 'talent' | 'recruiter' | 'organization';
  organizationName?: string;
  organizationDomain?: string;
  organizationLinkedinPage?: string;
  organisationSize?: string;
  organisationRcNumber?: string;
  organisationIndustry?: string;
  organisationLocation?: string;
  professionalDesignation?: string;
  professionalStatus?: string;
  recruiterOrganizationName?: string;
  // Proposed: extra onboarding info (not sent until backend supports it)
  onboarding?: TalentOnboardingExtras;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SwitchRoleDto {
  role: 'talent' | 'recruiter' | 'org_admin';
}

export const authService = {
  // Register a new user
  register: async (data: RegisterDto) => {
    // Only send fields currently supported by backend register endpoint
    const { onboarding: _onboarding, ...registerPayload } = data; // eslint-disable-line @typescript-eslint/no-unused-vars

    if (process.env.NODE_ENV !== 'production') {
      const dbg = { ...registerPayload } as Record<string, unknown>;
      delete (dbg as { password?: string }).password;
      console.log('[authService.register] POST /auth/register payload →', dbg);
    }

    try {
      const response = await apiClient.post('/auth/register', registerPayload);

      // ✅ Handle different possible response structures from backend
      const responseData = response.data.data || response.data;
      const backendUser = responseData.user || responseData;
      const token = responseData.access_token || responseData.token;

      if (!token) {
        throw new Error('No access token returned from registration');
      }

      // Map backend activeRole → our userTypes enum
      const activeRole = backendUser.activeRole || backendUser.role || data.role;
      let user_type;
      switch (activeRole) {
        case 'recruiter':
          user_type = userTypes.INDEPENDENT_RECRUITER;
          break;
        case 'talent':
          user_type = userTypes.TALENT;
          break;
        case 'org_admin':
        default:
          user_type = userTypes.ORGANISATION;
          break;
      }

      // Fully hydrate Zustand store
      useCreateUserStore.getState().updateUser({
        token,
        user_type,
        available_roles: backendUser.roles || [activeRole] as ('talent' | 'recruiter' | 'org_admin')[],
        full_name: data.fullName,
        email: data.primaryEmail,
        password: '',
        professional_status: data.professionalStatus || '',
        current_designation: data.professionalDesignation || '',
        organisation_name: data.recruiterOrganizationName || '',
        organization_name: data.organizationName || '',
        organization_domain: data.organizationDomain || '',
        organization_linkedin_page: data.organizationLinkedinPage || '',
        organisation_size: data.organisationSize || '',
        organisation_rc_number: data.organisationRcNumber || '',
        organisation_industry: data.organisationIndustry || '',
        organisation_location: data.organisationLocation || '',
      });

      // Sync token to cookie for server-side access
      syncTokenToCookie(token);

      localStorage.setItem('hasEverRegistered', 'true');

      return { token, user: backendUser };
    } catch (error: unknown) {
      // Surface backend validation errors
      const backendMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      console.error('[authService.register] Backend error →', backendMessage || error);
      
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      throw error;
    }
  },

  // Login existing user
  login: async (data: LoginDto) => {
    /**
     * 1️⃣ LOGIN → get access token
     */
    const loginRes = await apiClient.post('/auth/login', data);
    console.log('Full login response:', JSON.stringify(loginRes.data, null, 2));
    
    const token = loginRes?.data?.data?.access_token;
    const loginUserData = loginRes?.data?.data?.user;

    console.log('Extracted token:', token);
    console.log('Extracted loginUserData:', loginUserData);

    if (!token) {
      throw new Error('No access token returned from login');
    }

    /**
     * 2️⃣ Store token FIRST (critical for authenticated calls)
     */
    useCreateUserStore.getState().updateUser({ token });
    
    // Sync token to cookie for server-side access
    syncTokenToCookie(token);

    /**
     * 3️⃣ FETCH USER IDENTITY → /users/me (with fallback to login response)
     */
    let me = null;
    let availableRoles: string[] = [];
    let activeRole: string | null = null;

    try {
      const meRes = await usersService.getMe();
      console.log('/users/me response:', meRes);
      me = meRes?.data?.user || meRes?.data;
      
      if (me && Object.keys(me).length > 0) {
        // Successfully got data from /users/me
        availableRoles = me.roles || [];
        activeRole = me.activeRole || availableRoles[0] || null; // Default to first role if activeRole not provided
        console.log('Using /users/me data - activeRole:', activeRole, 'availableRoles:', availableRoles);
      }
    } catch (error) {
      console.warn('/users/me failed, using login response data:', error);
    }

    // Fallback: If /users/me returns empty or fails, use login response
    if (!me || Object.keys(me).length === 0) {
      console.log('Using login response data as fallback');
      console.log('loginUserData:', loginUserData);
      me = loginUserData;
      availableRoles = loginUserData?.roles || [];
      console.log('Extracted availableRoles:', availableRoles);
      // If no activeRole specified, default to first role in array
      activeRole = availableRoles[0] || null;
      console.log('Set activeRole to first role:', activeRole);
    }

    /**
     * 4️⃣ Validate and map activeRole → userTypes
     */
    console.log('Final validation - activeRole:', activeRole, 'availableRoles:', availableRoles);
    if (!activeRole || !Array.isArray(availableRoles) || availableRoles.length === 0) {
      console.error('Invalid user data structure:', { me, loginUserData, activeRole, availableRoles, fullLoginRes: loginRes.data });
      throw new Error('Invalid user data received from server - no roles found');
    }

    const user_type =
      activeRole === 'recruiter'
        ? userTypes.INDEPENDENT_RECRUITER
        : activeRole === 'talent'
        ? userTypes.TALENT
        : userTypes.ORGANISATION;

    /**
     * 5️⃣ Hydrate REQUIRED UI identity
     */
    useCreateUserStore.getState().updateUser({
      user_type,
      available_roles: availableRoles as ('talent' | 'recruiter' | 'org_admin')[],
      full_name: me?.fullName || me?.full_name,
      email: me?.primaryEmail || me?.email,
    });

    /**
     * 6️⃣ OPTIONAL: hydrate profile details (safe to fail)
     */
    try {
      const profileRes = await profilesService.getMe();
      const profile = profileRes?.data?.profile ?? profileRes?.data;

      if (profile) {
        useCreateUserStore.getState().updateUser({
          professional_status: profile.professionalStatus || '',
          current_designation: profile.currentDesignation || '',
          organisation_name: profile.organisationName || '',
          organization_name: profile.organizationName || '',
          organization_domain: profile.organizationDomain || '',
          organization_linkedin_page: profile.organizationLinkedinPage || '',
          organisation_size: profile.organisationSize || '',
          organisation_rc_number: profile.organisationRcNumber || '',
          organisation_industry: profile.organisationIndustry || '',
          organisation_location: profile.organisationLocation || '',
        });
      }
    } catch {
      // profile may not exist yet — this is OK
    }

    return { token };
  },


  googleAuth: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  },

  linkedInAuth: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/linkedin`;
  },

  microsoftAuth: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/microsoft`;
  },

  exchangeOAuthCode: async (provider: 'google' | 'linkedin' | 'microsoft', code: string) => {
    try {
      // Try the exchange-code endpoint first (if backend implements it)
      let response;
      
      try {
        response = await apiClient.post(`/auth/${provider}/exchange-code`, { code });
      } catch (error: unknown) {
        // If exchange-code endpoint doesn't exist, try the callback endpoint
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            console.log(`/auth/${provider}/exchange-code not found, trying callback endpoint...`);
            response = await apiClient.get(`/auth/${provider}/callback`, {
              params: { code },
            });
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }

      // Extract token from various possible response structures
      const token = response.data.data?.access_token || 
                    response.data.access_token || 
                    response.data.token || 
                    response.data.data?.token;

      if (!token) {
        console.error('No token in response:', response.data);
        throw new Error('Backend did not return a token');
      }

      return token;
    } catch (error: unknown) {
      console.error(`Failed to exchange ${provider} code:`, error);
      let message = 'Unknown error';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        message = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  handleGoogleCallback: async (token: string) => {
    // Store the token in Zustand
    useCreateUserStore.getState().updateUser({
      token,
    });

    // Sync token to cookie for server-side access
    syncTokenToCookie(token);

    // Store token in apiClient for authenticated requests
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch and hydrate user profile
    try {
      // Get user details from /users/me
      const userResponse = await usersService.getMe();
      const backendUser = userResponse.data?.user || userResponse.data;

      if (!backendUser) {
        throw new Error('No user data returned');
      }

      // Backend returns: { roles: string[], activeRole: string }
      const activeRole = backendUser.activeRole;
      const availableRoles = backendUser.roles || [];

      // Map backend activeRole to our userTypes enum
      let user_type;
      switch (activeRole) {
        case 'recruiter':
          user_type = userTypes.INDEPENDENT_RECRUITER;
          break;
        case 'talent':
          user_type = userTypes.TALENT;
          break;
        case 'org_admin':
        default:
          user_type = userTypes.ORGANISATION;
          break;
      }

      // Update user store with full profile data
      useCreateUserStore.getState().updateUser({
        user_type,
        available_roles: availableRoles as ('talent' | 'recruiter' | 'org_admin')[],
        full_name: backendUser.fullName || backendUser.name || '',
        email: backendUser.primaryEmail || backendUser.email || '',
      });

      // Try to fetch additional profile data
      try {
        const profileResponse = await profilesService.getMe();
        const profile = profileResponse.data;

        useCreateUserStore.getState().updateUser({
          professional_status: profile.professionalStatus || '',
          current_designation: profile.currentDesignation || '',
          organisation_name: profile.organisationName || '',
          organization_name: profile.organizationName || '',
          organization_domain: profile.organizationDomain || '',
          organization_linkedin_page: profile.organizationLinkedinPage || '',
          organisation_size: profile.organisationSize || '',
          organisation_rc_number: profile.organisationRcNumber || '',
          organisation_industry: profile.organisationIndustry || '',
          organisation_location: profile.organisationLocation || '',
        });
      } catch {
        // Profile may not exist yet - this is OK for new users
        console.log('Profile not found, user may need to complete onboarding');
      }
    } catch (error) {
      console.error('Failed to fetch user data after Google auth:', error);
      throw new Error('Failed to retrieve user information');
    }

    return { token };
  },

  switchRole: async (data: SwitchRoleDto) => {
    const response = await apiClient.post('/auth/switch-role', data);
    // Extract new token from response (backend returns new JWT with updated roles)
    const responseData = response.data.data || response.data;
    const newToken = responseData.access_token || responseData.token;
    
    if (newToken) {
      // Update token in store immediately
      useCreateUserStore.getState().updateUser({ token: newToken });
      // Sync token to cookie for server-side access
      syncTokenToCookie(newToken);
    }
    
    return { token: newToken, ...responseData };
  },

  updateRecruiterProfile: async (data: {
    professionalDesignation?: string;
    recruiterOrganizationName?: string;
    professionalStatus: string;
    bio?: string;
    linkedinUrl?: string;
    phone?: string;
  }) => {
    const response = await apiClient.patch('/users/recruiter/profile', data);
    return response.data;
  },
};

// export const hydrateUserProfile = async () => {
//   try {
//     const profileResponse = await profilesService.getMe();
//     const profile = profileResponse.data;

//     useCreateUserStore.getState().updateUser({
//       full_name: profile.full_name,
//       email: profile.email,
//       professional_status: profile.professionalStatus || '',
//       current_designation: profile.currentDesignation || '',
//       organisation_name: profile.organisationName || '',
//       organization_name: profile.organizationName || '',
//       organization_domain: profile.organizationDomain || '',
//       organization_linkedin_page: profile.organizationLinkedinPage || '',
//       organisation_size: profile.organisationSize || '',
//       organisation_rc_number: profile.organisationRcNumber || '',
//       organisation_industry: profile.organisationIndustry || '',
//       organisation_location: profile.organisationLocation || '',
//     });
//   } catch (err) {
//     console.error('Failed to hydrate user profile:', err);
//   }
// };
