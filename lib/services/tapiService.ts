import { apiClient } from './apiClient';

// DTOs
export interface UploadSubmissionDto {
  // Empty as per schema
}

export interface CreateCohortDto {
  // Empty as per schema
}

// Tapi service functions
export const tapiService = {
  // Submit something (probably file)
  submit: async (data: FormData) => {
    const response = await apiClient.post('/tapi/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Create a cohort
  createCohort: async (data: CreateCohortDto) => {
    const response = await apiClient.post('/tapi/cohort/create', data);
    return response.data;
  },

  // Get my submissions
  getMySubmissions: async () => {
    const response = await apiClient.get('/tapi/my-submissions');
    return response.data;
  },

  // Get cohort report
  getCohortReport: async (cohortId: string) => {
    const response = await apiClient.get(`/tapi/cohort/${cohortId}/report`);
    return response.data;
  },
};