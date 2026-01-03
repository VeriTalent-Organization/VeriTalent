import { apiClient } from './apiClient';

// DTOs
export interface AddRoleDto {
  role: 'talent' | 'recruiter' | 'org_admin';
}

export interface LinkEmailDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface SetPrimaryEmailDto {
  email: string;
}

export interface UpdateRecruiterUserDto {
  professionalDesignation?: string;
  recruiterOrganizationName?: string;
  professionalStatus: string;  // Required field
  bio?: string;
  linkedinUrl?: string;
  phone?: string;
}

/**
 * Expected response structure from GET /users/me
 * Send this to backend dev to implement
 * 
 * Example payload for a talent user:
 * {
 *   "id": "694dd8bdf7f692f0f4e46cb8",
 *   "veritalentId": "VT/2926-WB",
 *   "fullName": "Praise Daniel",
 *   "email": "praisedaniel979@gmail.com",
 *   "primaryEmail": "praisedaniel979@gmail.com",
 *   "activeRole": "talent",
 *   "roles": ["talent"],
 *   "location": "Lagos, Nigeria",
 *   "onboarding": {
 *     "linked_emails": ["praisedaniel979@gmail.com"],
 *     "veritalent_id": "VT/2926-WB",
 *     "cv_source": "upload",
 *     "cv_file_name": "resume.pdf",
 *     "cv_mime_type": "application/pdf",
 *     "linkedin_connected": false
 *   }
 * }
 * 
 * Example payload for a recruiter user:
 * {
 *   "id": "694dd8bdf7f692f0f4e46cb9",
 *   "veritalentId": "VT/3821-RC",
 *   "fullName": "John Smith",
 *   "email": "john@recruiters.com",
 *   "primaryEmail": "john@recruiters.com",
 *   "activeRole": "recruiter",
 *   "roles": ["talent", "recruiter"],
 *   "location": "New York, USA",
 *   "professionalDesignation": "Senior Recruiter",
 *   "professionalStatus": "employed",
 *   "recruiterOrganizationName": "TechRecruit Ltd"
 * }
 * 
 * Example payload for an org_admin user:
 * {
 *   "id": "694dd8bdf7f692f0f4e46cc0",
 *   "veritalentId": "VT/4512-OA",
 *   "fullName": "Sarah Johnson",
 *   "email": "sarah@techcorp.com",
 *   "primaryEmail": "sarah@techcorp.com",
 *   "activeRole": "org_admin",
 *   "roles": ["org_admin"],
 *   "location": "San Francisco, USA",
 *   "organizationName": "TechCorp Inc.",
 *   "organizationDomain": "techcorp.com",
 *   "organizationLinkedinPage": "https://linkedin.com/company/techcorp",
 *   "organisationSize": "100-500",
 *   "organisationRcNumber": "RC123456",
 *   "organisationIndustry": "Technology",
 *   "organisationLocation": "San Francisco, CA"
 * }
 */
export interface UserMeResponseDto {
  id: string;
  veritalentId: string;
  fullName: string;
  email: string;
  primaryEmail?: string;
  
  // Role information
  activeRole: 'talent' | 'recruiter' | 'org_admin';
  roles: ('talent' | 'recruiter' | 'org_admin')[];
  
  // Profile information
  location?: string;
  
  // Organization details (for org_admin role)
  organizationName?: string;
  organizationDomain?: string;
  organizationLinkedinPage?: string;
  organisationSize?: string;
  organisationRcNumber?: string;
  organisationIndustry?: string;
  organisationLocation?: string;
  
  // Recruiter details (for recruiter role)
  professionalDesignation?: string;
  professionalStatus?: string;
  recruiterOrganizationName?: string;
  
  // Talent onboarding extras (for talent role)
  onboarding?: {
    linked_emails: string[];
    veritalent_id?: string;
    cv_source: 'upload' | 'linkedin' | 'none';
    cv_key?: string;
    cv_file_name?: string | null;
    cv_mime_type?: string | null;
    cv_file_size?: number;
    cv_url?: string;
    cv_hash?: string;
    linkedin_connected?: boolean;
  };
  
  // Talent profile (for talent role)
  talentProfile?: unknown | null;
}

// Users service functions
export const usersService = {
  // Add a role to the user
  addRole: async (data: AddRoleDto) => {
    console.log('[usersService] Calling POST /users/role/add with data:', data);
    const response = await apiClient.post('/users/role/add', data);
    console.log('[usersService] POST /users/role/add response:', response.data);
    return response.data;
  },

  // Link an email to the user
  linkEmail: async (data: LinkEmailDto) => {
    const response = await apiClient.patch('/users/email/link', data);
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    console.log('[usersService] Calling GET /users/me');
    const response = await apiClient.get('/users/me');
    console.log('[usersService] GET /users/me response:', response.data);
    return response.data;
  },

  // Update independent recruiter profile
  updateRecruiterProfile: async (data: UpdateRecruiterUserDto) => {
    const response = await apiClient.patch('/users/recruiter/profile', data);
    return response.data;
  },

  // Email management functions
  addEmail: async (data: LinkEmailDto) => {
    console.log('[usersService] Calling POST /users/emails/add with data:', data);
    const response = await apiClient.post('/users/emails/add', data);
    console.log('[usersService] POST /users/emails/add response:', response.data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailDto) => {
    console.log('[usersService] Calling POST /users/emails/verify with data:', data);
    const response = await apiClient.post('/users/emails/verify', data);
    console.log('[usersService] POST /users/emails/verify response:', response.data);
    return response.data;
  },

  resendVerificationCode: async (email: string) => {
    console.log('[usersService] Calling POST /users/emails/resend-verification with email:', email);
    const response = await apiClient.post('/users/emails/resend-verification', { email });
    console.log('[usersService] POST /users/emails/resend-verification response:', response.data);
    return response.data;
  },

  removeEmail: async (email: string) => {
    console.log('[usersService] Calling DELETE /users/emails/remove with email:', email);
    const response = await apiClient.delete('/users/emails/remove', { data: { email } });
    console.log('[usersService] DELETE /users/emails/remove response:', response.data);
    return response.data;
  },

  setPrimaryEmail: async (data: SetPrimaryEmailDto) => {
    console.log('[usersService] Calling PUT /users/emails/set-primary with data:', data);
    const response = await apiClient.put('/users/emails/set-primary', data);
    console.log('[usersService] PUT /users/emails/set-primary response:', response.data);
    return response.data;
  },
};