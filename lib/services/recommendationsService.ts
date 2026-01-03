import { apiClient } from './apiClient';

// DTOs for Professional Recommendations
export interface IssueRecommendationDto {
  talentName: string;
  talentEmail: string;
  relationshipTimeline: string;
  relationshipContext: string;
  recommendations: string;
}

export interface ProfessionalRecommendation {
  id: string;
  issuer: string;
  talentName: string;
  talentEmail: string;
  dateIssued: string;
  relationshipTimeline: string;
  relationshipContext: string;
  recommendations: string;
  status: 'active' | 'revoked';
}

// Professional recommendations service functions
export const recommendationsService = {
  // Issue a professional recommendation
  issue: async (data: IssueRecommendationDto) => {
    console.log('[recommendationsService] Calling POST /recommendations/issue with data:', data);
    const response = await apiClient.post('/recommendations/issue', data);
    console.log('[recommendationsService] POST /recommendations/issue response:', response.data);
    return response.data;
  },

  // Get all recommendations issued by current user
  getIssued: async () => {
    console.log('[recommendationsService] Calling GET /recommendations/issued/my');
    const response = await apiClient.get('/recommendations/issued/my');
    console.log('[recommendationsService] GET /recommendations/issued/my response:', response.data);
    return response.data;
  },

  // Revoke a recommendation
  revoke: async (recommendationId: string) => {
    console.log('[recommendationsService] Calling DELETE /recommendations/revoke with id:', recommendationId);
    const response = await apiClient.delete(`/recommendations/${recommendationId}/revoke`);
    console.log('[recommendationsService] DELETE /recommendations/revoke response:', response.data);
    return response.data;
  },

  // Get recommendations for a specific talent (received by talent)
  getForTalent: async (talentId: string) => {
    console.log('[recommendationsService] Calling GET /recommendations/talent/:talentId');
    const response = await apiClient.get(`/recommendations/talent/${talentId}`);
    console.log('[recommendationsService] GET /recommendations/talent/:talentId response:', response.data);
    return response.data;
  },
};