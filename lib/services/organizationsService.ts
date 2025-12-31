import { apiClient } from './apiClient';

// DTOs
export interface CreateOrganizationDto {
  name: string;
  domain?: string;
  linkedinPage?: string;
  industry?: string;
  location?: string;
  website?: string;
  size: string;
  rcNumber: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  domain?: string;
  linkedinPage?: string;
  industry?: string;
  location?: string;
  website?: string;
  size?: string;
  rcNumber?: string;
}

export interface OrganizationResponseDto {
  name: string;
  domain: string;
  linkedinPage: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  rcNumber: string;
}

export interface AddTeamMemberDto {
  userId: string;
  role: 'talent' | 'recruiter' | 'org_admin';
}

// Organizations service functions
export const organizationsService = {
  // Create a new organization
  create: async (data: CreateOrganizationDto) => {
    console.log('[organizationsService] Calling POST /organizations/create with data:', data);
    const response = await apiClient.post('/organizations/create', data);
    console.log('[organizationsService] POST /organizations/create response:', response.data);
    return response.data;
  },

  // Get my organizations
  getMe: async () => {
    console.log('[organizationsService] Calling GET /organizations/me');
    const response = await apiClient.get('/organizations/me');
    console.log('[organizationsService] GET /organizations/me response:', response.data);
    return response.data;
  },

  // Update organization
  update: async (data: UpdateOrganizationDto) => {
    console.log('[organizationsService] Calling PATCH /organizations/me with data:', data);
    const response = await apiClient.patch('/organizations/me', data);
    console.log('[organizationsService] PATCH /organizations/me response:', response.data);
    return response.data;
  },

  // Add team member to organization
  addTeamMember: async (id: string, data: AddTeamMemberDto) => {
    const response = await apiClient.post(`/organizations/${id}/team/add`, data);
    return response.data;
  },

  // Verify organization
  verify: async (id: string) => {
    const response = await apiClient.patch(`/organizations/${id}/verify`);
    return response.data;
  },
};