import { apiClient } from './apiClient';

// DTOs
export interface SkillDto {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  source: string;
}

export interface CreateProfileDto {
  careerObjective: string;
  education?: string[];
  workExperience?: string[];
  skills?: SkillDto[];
}

// Profiles service functions
export const profilesService = {
  // Create a new profile
  create: async (data: CreateProfileDto) => {
    const response = await apiClient.post('/profiles/create', data);
    return response.data;
  },

  // Get my profile
  getMe: async () => {
    const response = await apiClient.get('/profiles/me');
    return response.data;
  },
};