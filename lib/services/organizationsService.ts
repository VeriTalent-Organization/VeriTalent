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

export interface VerificationStatusDto {
  domain: {
    status: 'verified' | 'pending' | 'failed' | 'not_started';
    verifiedAt?: string;
    domain?: string;
  };
  linkedin: {
    status: 'verified' | 'pending' | 'failed' | 'not_started';
    verifiedAt?: string;
    linkedinPage?: string;
  };
  documents: {
    status: 'verified' | 'pending' | 'failed' | 'not_started';
    verifiedAt?: string;
    documentType?: string;
  };
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

  // Get verification status
  getVerificationStatus: async () => {
    console.log('[organizationsService] Calling GET /organizations/verify/status');
    const response = await apiClient.get('/organizations/verify/status');
    console.log('[organizationsService] GET /organizations/verify/status response:', response.data);
    return response.data;
  },

  // Domain verification
  initiateDomainVerification: async (domain: string) => {
    console.log('[organizationsService] Calling POST /organizations/verify/domain with domain:', domain);
    const response = await apiClient.post('/organizations/verify/domain', { domain });
    console.log('[organizationsService] POST /organizations/verify/domain response:', response.data);
    return response.data;
  },

  checkDomainVerification: async () => {
    console.log('[organizationsService] Calling GET /organizations/verify/domain/check');
    const response = await apiClient.get('/organizations/verify/domain/check');
    console.log('[organizationsService] GET /organizations/verify/domain/check response:', response.data);
    return response.data;
  },

  // LinkedIn verification
  initiateLinkedInVerification: async () => {
    console.log('[organizationsService] Calling POST /organizations/verify/linkedin');
    const response = await apiClient.post('/organizations/verify/linkedin');
    console.log('[organizationsService] POST /organizations/verify/linkedin response:', response.data);
    return response.data;
  },

  // Document verification
  uploadVerificationDocuments: async (files: File[], documentType: string) => {
    console.log('[organizationsService] Uploading verification documents:', { count: files.length, type: documentType });
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`documents`, file);
    });
    formData.append('documentType', documentType);

    const response = await apiClient.post('/organizations/verify/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[organizationsService] POST /organizations/verify/documents response:', response.data);
    return response.data;
  },
};