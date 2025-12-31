// ============================================
// CREATE JOB DTO (Data Transfer Object)
// ============================================

export interface CreateJobDto {
  // Step 1: Job Basics
  title: string;
  companyName: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance';
  location: string;
  otherInfo?: string;
  applicationDeadline: string; // ISO date string or formatted date
  
  // Step 2: Job Description
  aboutRole: string;
  keyResponsibilities: string[]; // Array of strings per API schema
  requiredSkills: string[]; // Array of strings per API schema
  additionalInfo?: string;
  
  // Step 3: Screening Criteria (nested structure)
  screeningCriteria: ScreeningCriteriaDto;
  
  // Step 4: Application Instructions
  applicationMethod: 'platform' | 'cv' | 'aicard' | 'custom';
  cvEmail?: string; // Required if applicationMethod is 'cv'
  aicardEmail?: string; // Required if applicationMethod is 'aicard'
  customInstruction?: string; // Required if applicationMethod is 'custom'
  
  // Step 5: Preview & Publish
  visibilityOption: 'featured' | 'public';
  
  // Optional metadata
  tags?: string[];
}

// ============================================
// SCREENING CRITERIA DTO
// ============================================

export type CriteriaKey = 'Culture' | 'Experience' | 'Education' | 'Location' | 'Salary' | 'Skills' | 'Others';

export type ScreeningCriteriaDto = {
  activeCriteria: string[]; // Array of active criteria names
  criteriaData: {
    context: string; // Single context string
    weight: number; // Single weight value (0-100)
  };
};

// ============================================
// EXAMPLE PAYLOAD
// ============================================

export const exampleCreateJobPayload: CreateJobDto = {
  // Step 1: Job Basics
  title: 'Software Engineer',
  companyName: 'TechCorp',
  employmentType: 'Full Time',
  location: 'Fountain Hills, Arizona',
  otherInfo: 'Work from home available 2 days per week',
  applicationDeadline: '2025-03-15T23:59:59Z',
  
  // Step 2: Job Description
  aboutRole: 'We are seeking a highly motivated Software Engineer to join our growing team. You will be responsible for developing and maintaining our core platform.',
  keyResponsibilities: [
    'Design and implement new features',
    'Write clean, maintainable code',
    'Collaborate with cross-functional teams',
    'Participate in code reviews',
    'Troubleshoot and debug applications'
  ],
  requiredSkills: [
    '3+ years of experience with React and TypeScript',
    'Strong understanding of REST APIs',
    'Experience with Git version control',
    'Excellent problem-solving skills',
    'Good communication skills'
  ],
  additionalInfo: 'Our team values collaboration and continuous learning. We offer competitive compensation and professional development opportunities.',
  
  // Step 3: Screening Criteria
  screeningCriteria: {
    activeCriteria: ['Culture', 'Experience', 'Skills'],
    criteriaData: {
      context: 'Looking for team players with 3+ years experience in React, TypeScript, and modern web development',
      weight: 100
    }
  },
  
  // Step 4: Application Instructions
  applicationMethod: 'cv',
  cvEmail: 'careers@techcorp.com',
  
  // Step 5: Preview & Publish
  visibilityOption: 'public',
  
  // Metadata
  tags: ['engineering', 'software', 'full-time'],
};

// ============================================
// VALIDATION HELPER
// ============================================

export function validateJobData(data: CreateJobDto): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!data.title?.trim()) errors.push('Job title is required');
  if (!data.companyName?.trim()) errors.push('Company name is required');
  if (!data.employmentType) errors.push('Employment type is required');
  if (!data.location?.trim()) errors.push('Location is required');
  if (!data.applicationDeadline) errors.push('Application deadline is required');
  if (!data.aboutRole?.trim()) errors.push('About the role is required');
  if (!data.keyResponsibilities?.length) errors.push('Key responsibilities are required');
  if (!data.requiredSkills?.length) errors.push('Required skills are required');
  
  // Screening criteria validation
  if (!data.screeningCriteria?.activeCriteria?.length) {
    errors.push('At least one screening criteria must be active');
  }
  
  // Application method validation
  if (data.applicationMethod === 'cv' && !data.cvEmail?.trim()) {
    errors.push('Email is required for CV application method');
  }
  if (data.applicationMethod === 'aicard' && !data.aicardEmail?.trim()) {
    errors.push('Email is required for AI Card application method');
  }
  if (data.applicationMethod === 'custom' && !data.customInstruction?.trim()) {
    errors.push('Custom instructions are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse responsibilities/skills from textarea into array
 */
export function parseListFromText(text: string): string[] {
  return text
    .split(/[\n,]/) // Split by newline or comma
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Format screening criteria for display
 */
export function formatScreeningCriteria(criteria: ScreeningCriteriaDto): string[] {
  // Since criteriaData has a single context and weight for all criteria
  const { context, weight } = criteria.criteriaData;
  return criteria.activeCriteria
    .filter(() => context.trim())
    .map(key => {
      return `${key}: ${context} (Weight: ${weight}%)`;
    });
}
