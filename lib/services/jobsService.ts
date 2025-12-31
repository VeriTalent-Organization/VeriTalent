import { apiClient } from './apiClient';
import type { CreateJobDto } from '@/types/create_job';

// Jobs service functions
export const jobsService = {
  // Create a new job
  create: async (data: CreateJobDto) => {
    const response = await apiClient.post('/jobs/create', data);
    return response.data;
  },

  // Get job feed
  getFeed: async () => {
    const response = await apiClient.get('/jobs/all');
    return response.data;
  },

  // Get my posted jobs
  getMyPosted: async () => {
    const response = await apiClient.get('/jobs/my-posted');
    return response.data;
  },

  // Apply for a job
  apply: async (jobId: string, applicationData?: { coverLetter?: string; notes?: string }) => {
    console.log('[jobsService] Applying to job:', { jobId, endpoint: `/jobs/apply/${jobId}`, applicationData });
    try {
      const response = await apiClient.post(`/jobs/apply/${jobId}`, applicationData || {});
      console.log('[jobsService] Application successful:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown; status?: number } };
      console.error('[jobsService] Application failed:', {
        jobId,
        error,
        response: axiosError?.response?.data,
        status: axiosError?.response?.status,
      });
      throw error;
    }
  },

  // Get job details
  getJob: async (jobId: string) => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Get recommended jobs for talent (AI-matched)
  getRecommendations: async () => {
    const response = await apiClient.get('/jobs/recommendations');
    return response.data;
  },

  // Get my job applications
  getApplications: async () => {
    const response = await apiClient.get('/jobs/applications');
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (applicationId: string) => {
    const response = await apiClient.delete(`/jobs/applications/${applicationId}`);
    return response.data;
  },
};
