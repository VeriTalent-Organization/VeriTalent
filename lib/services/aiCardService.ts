import { apiClient } from './apiClient';
import { TalentCardData } from '@/types/dashboard';

// DTOs
export interface RecruiterViewDto {
  talentData: TalentCardData;
  fitScore?: number;
  competencySignals?: Array<{
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    verifiedBy: string;
  }>;
}

// AI Card service functions
export const aiCardService = {
  // Get AI card data for recruiter view
  getRecruiterView: async (veritalentId: string): Promise<RecruiterViewDto> => {
    const response = await apiClient.get(`/ai-card/${veritalentId}/recruiter-view`);
    return response.data;
  },

  // Get public AI card (for shareable links)
  getPublicView: async (shareToken: string): Promise<TalentCardData> => {
    const response = await apiClient.get(`/ai-card/public/${shareToken}`);
    return response.data;
  },

  // Generate shareable link
  generateShareLink: async (veritalentId: string): Promise<{ shareToken: string; shareUrl: string }> => {
    const response = await apiClient.post(`/ai-card/share/${veritalentId}`);
    return response.data;
  },

  // Download PDF
  downloadPDF: async (veritalentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/ai-card/pdf/${veritalentId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};