import { apiClient } from './apiClient';

// DTOs
export interface CreateSessionDto {
  title: string;
  jobId: string;
  talentIds: string[];
}

export interface BulkCvDto {
  cvs: File[]; // For multipart upload
}

export interface ScreenIdsDto {
  candidateIds: string[];
}

// Screening service functions
export const screeningService = {
  // Create a screening session
  createSession: async (data: CreateSessionDto) => {
    const response = await apiClient.post('/screening/session/create', data);
    return response.data;
  },

  // Bulk upload CVs to session
  bulkCv: async (sessionId: string, data: FormData) => {
    const response = await apiClient.post(`/screening/session/${sessionId}/bulk-cv`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Screen candidate IDs
  screenIds: async (sessionId: string, data: ScreenIdsDto) => {
    const response = await apiClient.post(`/screening/session/${sessionId}/screen-ids`, data);
    return response.data;
  },

  // Get all screening sessions
  getSessions: async () => {
    const response = await apiClient.get('/screening/sessions');
    return response.data;
  },

  // Get a specific session
  getSession: async (sessionId: string) => {
    const response = await apiClient.get(`/screening/session/${sessionId}`);
    return response.data;
  },

  // Shortlist a candidate
  shortlist: async (sessionId: string, index: number) => {
    const response = await apiClient.post(`/screening/session/${sessionId}/shortlist/${index}`);
    return response.data;
  },
};