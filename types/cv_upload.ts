import { z } from 'zod';

/**
 * CV Upload Feature DTOs
 * 
 * Purpose: Define the data structures for the CV upload workflow
 * This includes uploading bulk CVs, linking to job posts, and AI-powered screening
 * 
 * Flow:
 * 1. JobContextSelector - Choose between existing job or create new context
 * 2. BulkUpload - Upload multiple CVs with job context
 * 3. ReviewAndAnalyze - Process uploaded CVs with screening criteria
 * 4. ScreeningCriteria - Define matching criteria (for 'create' mode)
 * 5. Publish - Finalize and process the upload
 */

// ============= ENUMS & CONSTANTS =============

export type CVUploadMode = 'existing' | 'create';

export const CV_FILE_TYPES = ['pdf', 'docx', 'doc', 'txt'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total
export const MAX_FILES = 1000; // Maximum CVs per upload

// ============= STEP 1: JOB CONTEXT =============

/**
 * Job Context Data
 * Required when creating a new job context for CV screening
 */
export const JobContextDataSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(200),
  companyName: z.string().min(1, 'Company name is required').max(200),
  employmentType: z.enum(['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance']),
  location: z.string().min(1, 'Location is required').max(200),
  roleOverview: z.string().max(2000).optional(),
});

export type JobContextData = z.infer<typeof JobContextDataSchema>;

export const defaultJobContextData: JobContextData = {
  jobTitle: '',
  companyName: '',
  employmentType: 'Full Time',
  location: 'Remote',
  roleOverview: '',
};

/**
 * Job Context State (internal component state)
 * Includes mode selection and existing job reference
 */
export const JobContextStateSchema = z.object({
  mode: z.enum(['existing', 'create']),
  data: JobContextDataSchema,
  existingJobId: z.string().optional(), // When mode='existing', reference the job ID
});

export type JobContextState = z.infer<typeof JobContextStateSchema>;

// ============= STEP 2: BULK UPLOAD =============

/**
 * Individual uploaded CV file metadata
 * Stored with file reference and validation info
 */
export const CVFileMetadataSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().positive().max(MAX_FILE_SIZE),
  fileMimeType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']),
  uploadedAt: z.string().datetime(),
  fileKey: z.string(), // S3 key or file reference
  checksum: z.string().optional(), // For duplicate detection
  status: z.enum(['pending', 'processing', 'analyzed', 'failed']).default('pending'),
});

export type CVFileMetadata = z.infer<typeof CVFileMetadataSchema>;

/**
 * Bulk Upload DTO
 * Contains metadata about the entire batch of CVs being uploaded
 */
export const BulkUploadDtoSchema = z.object({
  // Job context (either existing or newly created)
  jobContextMode: z.enum(['existing', 'create']),
  jobId: z.string().optional(), // Existing job ID if mode='existing'
  jobContext: JobContextDataSchema.optional(), // New job context if mode='create'

  // Upload metadata
  totalFiles: z.number().positive().max(MAX_FILES),
  totalSize: z.number().positive().max(MAX_TOTAL_SIZE),
  files: z.array(CVFileMetadataSchema),

  // Upload tracking
  uploadId: z.string().uuid().optional(), // Generated server-side for tracking
  uploadedBy: z.string(), // User ID
  uploadedAt: z.string().datetime(),
  
  // Optional batch info
  batchName: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
});

export type BulkUploadDto = z.infer<typeof BulkUploadDtoSchema>;

/**
 * Client-side bulk upload state
 * Tracks files being added before submission
 */
export interface BulkUploadState {
  jobContextMode: 'existing' | 'create';
  jobId?: string;
  jobContext?: JobContextData;
  files: File[]; // Actual File objects from input/drag-drop
  fileMetadata: CVFileMetadata[]; // Processed metadata
  uploadProgress: Record<string, number>; // {fileName: percentage}
  isDragging: boolean;
}

// ============= STEP 3: REVIEW & ANALYZE =============

/**
 * CV Analysis Result
 * AI-extracted data from a single CV
 */
export const CVAnalysisResultSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  
  // Extracted information
  candidateName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  
  // Skills and experience
  skills: z.array(z.string()),
  yearsOfExperience: z.number().optional(),
  education: z.array(z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
  })).optional(),
  workHistory: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
  })).optional(),
  
  // AI Screening Scores
  matchScore: z.number().min(0).max(100).optional(), // Overall match %
  screeningScores: z.record(z.string(), z.number().min(0).max(100)).optional(), // { "Culture": 75, "Experience": 90 }
  
  // Status
  analysisStatus: z.enum(['pending', 'completed', 'failed']),
  analysisError: z.string().optional(),
  analyzedAt: z.string().datetime().optional(),
});

export type CVAnalysisResult = z.infer<typeof CVAnalysisResultSchema>;

/**
 * Bulk Analysis Report
 * Summary of all CVs analyzed for a batch
 */
export const BulkAnalysisReportSchema = z.object({
  uploadId: z.string().uuid(),
  jobId: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  
  // Analysis summary
  totalCVsUploaded: z.number(),
  totalCVsAnalyzed: z.number(),
  totalCVsFailed: z.number(),
  analysisCompletionPercentage: z.number().min(0).max(100),
  
  // Results
  cvResults: z.array(CVAnalysisResultSchema),
  
  // Top matches
  topMatches: z.array(z.object({
    fileKey: z.string(),
    candidateName: z.string().optional(),
    matchScore: z.number(),
    screeningScores: z.record(z.string(), z.number()),
  })).optional(),
  
  // Screening criteria used (if 'create' mode)
  screeningCriteria: z.record(z.string(), z.object({
    context: z.string(),
    weight: z.number(),
  })).optional(),
  
  // Timestamps
  analysisStartedAt: z.string().datetime(),
  analysisCompletedAt: z.string().datetime().optional(),
  
  // Generated resources
  generatedJobId: z.string().optional(), // VT-XXXX format
  reportUrl: z.string().url().optional(),
  shareableLink: z.string().url().optional(),
});

export type BulkAnalysisReport = z.infer<typeof BulkAnalysisReportSchema>;

// ============= STEP 4: SCREENING CRITERIA (Create Mode Only) =============

/**
 * Screening Criteria for CV Matching
 * Used to define how CVs should be evaluated
 * Maps to ScreeningCriteriaDto from job creation
 */
export const ScreeningCriteriaDtoSchema = z.object({
  activeCriteria: z.array(z.string()),
  criteriaData: z.record(z.string(), z.object({
    context: z.string(),
    weight: z.number().min(0).max(100),
  })),
});

export type ScreeningCriteriaDto = z.infer<typeof ScreeningCriteriaDtoSchema>;

// ============= STEP 5: PUBLISH/PROCESS =============

/**
 * Publish Options for CV Upload Processing
 * Mirrors PreviewAndPublish step
 */
export const PublishOptionsSchema = z.object({
  saveAsTemplate: z.boolean().default(false),
  visibilityOption: z.enum(['featured', 'public']).default('public'),
  notifyRecruiter: z.boolean().default(true),
  generateReport: z.boolean().default(true),
});

export type PublishOptions = z.infer<typeof PublishOptionsSchema>;

// ============= COMPLETE CV UPLOAD WORKFLOW DTO =============

/**
 * Complete CV Upload DTO
 * Represents the entire CV upload workflow with all steps
 */
export const CompleteCVUploadDtoSchema = z.object({
  // Upload metadata
  uploadId: z.string().uuid(),
  uploadMode: z.enum(['existing', 'create']),
  uploadedBy: z.string(),
  uploadedAt: z.string().datetime(),
  
  // Step 1: Job Context
  jobContext: z.object({
    mode: z.enum(['existing', 'create']),
    jobId: z.string().optional(), // Existing job ID
    newContext: JobContextDataSchema.optional(), // New context if mode='create'
  }),
  
  // Step 2: Bulk Upload
  uploadData: z.object({
    totalFiles: z.number(),
    totalSize: z.number(),
    files: z.array(CVFileMetadataSchema),
  }),
  
  // Step 3: Analysis Results
  analysisResults: z.object({
    generatedJobId: z.string().optional(),
    analysisStartedAt: z.string().datetime(),
    analysisCompletedAt: z.string().datetime().optional(),
    analysisStatus: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
    cvResults: z.array(CVAnalysisResultSchema).optional(),
  }),
  
  // Step 4: Screening Criteria (create mode only)
  screeningCriteria: ScreeningCriteriaDtoSchema.optional(),
  
  // Step 5: Publish Options
  publishOptions: PublishOptionsSchema,
  
  // Final status
  status: z.enum(['draft', 'processing', 'completed', 'published', 'failed']).default('draft'),
  errorMessage: z.string().optional(),
});

export type CompleteCVUploadDto = z.infer<typeof CompleteCVUploadDtoSchema>;

// ============= VALIDATION HELPERS =============

/**
 * Validates file before adding to upload queue
 */
export const validateCVFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }

  // Check file type
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !CV_FILE_TYPES.includes(ext as typeof CV_FILE_TYPES[number])) {
    return { valid: false, error: `Invalid file type. Allowed: ${CV_FILE_TYPES.join(', ')}` };
  }

  return { valid: true };
};

/**
 * Validates complete upload DTO before sending to backend
 */
export const validateCompleteCVUpload = (data: unknown) => {
  try {
    CompleteCVUploadDtoSchema.parse(data);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof z.ZodError ? error.issues?.[0]?.message ?? 'Validation failed' : 'Validation failed' 
    };
  }
};

// ============= EXAMPLE PAYLOADS =============

/**
 * Example: Complete CV Upload Workflow
 */
export const exampleCompleteCVUploadPayload: CompleteCVUploadDto = {
  uploadId: '550e8400-e29b-41d4-a716-446655440000',
  uploadMode: 'create',
  uploadedBy: 'user-123',
  uploadedAt: new Date().toISOString(),

  jobContext: {
    mode: 'create',
    newContext: {
      jobTitle: 'Senior Software Engineer',
      companyName: 'TechCorp Inc',
      employmentType: 'Full Time',
      location: 'Remote',
      roleOverview: 'We are looking for experienced engineers...',
    },
  },

  uploadData: {
    totalFiles: 95,
    totalSize: 85 * 1024 * 1024,
    files: [
      {
        fileName: 'john_doe_resume.pdf',
        fileSize: 512000,
        fileMimeType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        fileKey: 's3://veritalent-uploads/2025-01/john_doe_resume.pdf',
        status: 'analyzed',
      },
      // ... 94 more files
    ],
  },

  analysisResults: {
    generatedJobId: 'VT-1247',
    analysisStartedAt: new Date().toISOString(),
    analysisCompletedAt: new Date().toISOString(),
    analysisStatus: 'completed',
    cvResults: [
      {
        fileKey: 's3://veritalent-uploads/2025-01/john_doe_resume.pdf',
        fileName: 'john_doe_resume.pdf',
        candidateName: 'John Doe',
        email: 'john@example.com',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        yearsOfExperience: 8,
        matchScore: 92,
        screeningScores: {
          Culture: 75,
          Experience: 95,
          Skills: 90,
          Education: 80,
        },
        analysisStatus: 'completed',
        analyzedAt: new Date().toISOString(),
      },
      // ... 94 more results
    ],
  },

  screeningCriteria: {
    activeCriteria: ['Culture', 'Experience', 'Skills'],
    criteriaData: {
      Culture: { context: 'Team players in fast-paced environment', weight: 20 },
      Experience: { context: '5+ years in software development', weight: 60 },
      Education: { context: 'BS/MS in CS or related field', weight: 50 },
      Location: { context: 'Remote or US-based', weight: 30 },
      Salary: { context: '', weight: 50 },
      Skills: { context: 'React, TypeScript, Node.js', weight: 80 },
      Others: { context: '', weight: 50 },
    },
  },

  publishOptions: {
    saveAsTemplate: false,
    visibilityOption: 'public',
    notifyRecruiter: true,
    generateReport: true,
  },

  status: 'completed',
};

/**
 * Example: Bulk Upload Only (Step 2)
 */
export const exampleBulkUploadPayload: BulkUploadDto = {
  jobContextMode: 'create',
  jobContext: {
    jobTitle: 'Product Manager',
    companyName: 'StartupXYZ',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    roleOverview: 'Lead product strategy for our mobile app',
  },
  totalFiles: 50,
  totalSize: 45 * 1024 * 1024,
  files: [
    {
      fileName: 'candidate_1.pdf',
      fileSize: 512000,
      fileMimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      fileKey: 's3://veritalent-uploads/batch-1/candidate_1.pdf',
      status: 'pending',
    },
  ],
  uploadedBy: 'recruiter-456',
  uploadedAt: new Date().toISOString(),
};

/**
 * Example: Analysis Report (Step 3)
 */
export const exampleAnalysisReportPayload: BulkAnalysisReport = {
  uploadId: '550e8400-e29b-41d4-a716-446655440000',
  jobId: 'VT-1247',
  jobTitle: 'Senior Software Engineer',
  companyName: 'TechCorp Inc',
  totalCVsUploaded: 95,
  totalCVsAnalyzed: 93,
  totalCVsFailed: 2,
  analysisCompletionPercentage: 97,
  cvResults: [
    {
      fileKey: 's3://veritalent-uploads/2025-01/jane_smith_resume.pdf',
      fileName: 'jane_smith_resume.pdf',
      candidateName: 'Jane Smith',
      email: 'jane@example.com',
      skills: ['React', 'Python', 'Docker', 'Kubernetes'],
      yearsOfExperience: 10,
      matchScore: 88,
      screeningScores: {
        Culture: 85,
        Experience: 92,
        Skills: 88,
      },
      analysisStatus: 'completed',
      analyzedAt: new Date().toISOString(),
    },
  ],
  topMatches: [
    {
      fileKey: 's3://veritalent-uploads/2025-01/jane_smith_resume.pdf',
      candidateName: 'Jane Smith',
      matchScore: 88,
      screeningScores: { Culture: 85, Experience: 92, Skills: 88 },
    },
  ],
  analysisStartedAt: new Date().toISOString(),
  analysisCompletedAt: new Date().toISOString(),
  generatedJobId: 'VT-1247',
  reportUrl: 'https://app.veritalent.com/reports/VT-1247/analysis',
  shareableLink: 'https://veritalent.com/share/VT-1247/xyz123',
};
