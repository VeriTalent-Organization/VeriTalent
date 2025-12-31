import { apiClient } from './apiClient';

// DTOs
export interface RequestReferenceDto {
  issuerUserId: string;
  type: 'work' | 'academic' | 'community' | 'performance' | 'membership' | 'studentship' | 'acknowledgement';
  title: string;
  message?: string;
  startDate?: string;
  endDate?: string;
}

export interface IssueReferenceDto {
  referenceId: string;
  status: 'pending' | 'verified' | 'rejected';
  description?: string;
  skillsEndorsed?: string[];
}

// References service functions
export const referencesService = {
  // Request a reference
  request: async (data: RequestReferenceDto) => {
    const response = await apiClient.post('/references/request', data);
    return response.data;
  },

  // Issue a reference
  issue: async (data: IssueReferenceDto) => {
    const response = await apiClient.post('/references/issue', data);
    return response.data;
  },

  // Get my references
  getMyReferences: async () => {
    const response = await apiClient.get('/references/my-references');
    return response.data;
  },

  // Get issued references
  getIssued: async () => {
    const response = await apiClient.get('/references/issued');
    return response.data;
  },
};