import { apiClient } from './apiClient';

// DTOs for CV parsing
export interface ParsedCVData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
  };
  summary?: string;
  workExperience?: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrentRole?: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    description?: string;
  }>;
  skills?: Array<{
    skill: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    yearsOfExperience?: number;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency?: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    technologies?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
}

export interface CVParseRequest {
  file: File;
  extractPersonalInfo?: boolean;
  extractWorkExperience?: boolean;
  extractEducation?: boolean;
  extractSkills?: boolean;
  extractCertifications?: boolean;
  extractLanguages?: boolean;
  extractProjects?: boolean;
}

export interface CVParseResponse {
  success: boolean;
  data?: ParsedCVData;
  confidence?: number;
  processingTime?: number;
  error?: string;
}

// CV parsing service functions
export const cvParsingService = {
  // Parse CV file and extract structured data
  parseCV: async (request: CVParseRequest): Promise<CVParseResponse> => {
    const formData = new FormData();
    formData.append('cv_file', request.file);

    // Add extraction options
    if (request.extractPersonalInfo !== undefined) {
      formData.append('extractPersonalInfo', request.extractPersonalInfo.toString());
    }
    if (request.extractWorkExperience !== undefined) {
      formData.append('extractWorkExperience', request.extractWorkExperience.toString());
    }
    if (request.extractEducation !== undefined) {
      formData.append('extractEducation', request.extractEducation.toString());
    }
    if (request.extractSkills !== undefined) {
      formData.append('extractSkills', request.extractSkills.toString());
    }
    if (request.extractCertifications !== undefined) {
      formData.append('extractCertifications', request.extractCertifications.toString());
    }
    if (request.extractLanguages !== undefined) {
      formData.append('extractLanguages', request.extractLanguages.toString());
    }
    if (request.extractProjects !== undefined) {
      formData.append('extractProjects', request.extractProjects.toString());
    }

    try {
      const response = await apiClient.post('/cv/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('[cvParsingService.parseCV] Error:', error);
      throw error;
    }
  },

  // Get parsed CV data for current user
  getParsedCVData: async (): Promise<ParsedCVData> => {
    try {
      const response = await apiClient.get('/profiles/parsed-data');
      return response.data;
    } catch (error: unknown) {
      console.error('[cvParsingService.getParsedCVData] Error:', error);
      throw error;
    }
  },

  // Update parsed CV data (after user edits)
  updateParsedCVData: async (data: ParsedCVData): Promise<void> => {
    try {
      await apiClient.put('/profiles/parsed-data', data);
    } catch (error: unknown) {
      console.error('[cvParsingService.updateParsedCVData] Error:', error);
      throw error;
    }
  },

  // Import profile data from LinkedIn
  importLinkedInProfile: async (linkedinUrl?: string): Promise<ParsedCVData> => {
    try {
      const response = await apiClient.post('/linkedin/import', { linkedinUrl });
      return response.data;
    } catch (error: unknown) {
      console.error('[cvParsingService.importLinkedInProfile] Error:', error);
      throw error;
    }
  },
};
