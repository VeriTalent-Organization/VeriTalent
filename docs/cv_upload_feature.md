# CV Upload Feature - Complete Documentation

## Overview

The **CV Upload** feature allows organizations to bulk upload CVs and screen candidates using AI-powered matching against job requirements. It supports two workflows:

1. **Link to Existing Job** - Upload CVs for a previously created job post
2. **Create New Job Context** - Define a new job context and upload CVs simultaneously

---

## Architecture & Data Flow

### User Journey

```
Step 1: Job Context        (JobContextSelector)
   ↓
   Choose: Existing Job? or Create New Context?
   ↓
Step 2: Bulk Upload        (BulkUpload)
   ↓
   Upload multiple CVs (PDF, DOCX, DOC, TXT)
   ↓
Step 3: Review & Analyze   (ReviewAndAnalyze)
   ↓
   AI analyzes CVs and generates report
   ↓
Step 4: Screening Criteria  (ScreeningCriteriaForm) [Create mode only]
   ↓
   Define matching weights and criteria
   ↓
Step 5: Publish            (PreviewAndPublish)
   ↓
   Finalize and process the upload
   ↓
Complete: Analysis report & candidate ranking
```

### Conditional Flow

**If mode = 'existing':**
```
Job Context → Bulk Upload → Review & Analyze → Publish
```

**If mode = 'create':**
```
Job Context → Bulk Upload → Screening Criteria → Publish → Review & Analyze
```

---

## DTO Hierarchy

### Level 1: Step-by-Step DTOs

#### 1. JobContextData
```typescript
{
  jobTitle: string;
  companyName: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance';
  location: string;
  roleOverview?: string;
}
```
**Used by:** JobContextSelector component
**Sent to:** Parent component via onJobDataChange callback

#### 2. BulkUploadDto
```typescript
{
  jobContextMode: 'existing' | 'create';
  jobId?: string;                    // If existing
  jobContext?: JobContextData;       // If create
  totalFiles: number;
  totalSize: number;
  files: CVFileMetadata[];
  uploadId: string;
  uploadedBy: string;
  uploadedAt: string;
}
```
**Used by:** BulkUpload component
**Sent to:** Backend /tapi/submit endpoint with FormData

#### 3. ScreeningCriteriaDto
```typescript
{
  activeCriteria: string[];
  criteriaData: {
    [key: string]: { context: string; weight: number }
  }
}
```
**Used by:** ScreeningCriteriaForm component
**Sent to:** Parent component via onDataChange callback

#### 4. PublishOptions
```typescript
{
  saveAsTemplate: boolean;
  visibilityOption: 'public' | 'featured';
  notifyRecruiter?: boolean;
  generateReport?: boolean;
}
```
**Used by:** PreviewAndPublish component
**Sent to:** Parent component via onDataChange callback

### Level 2: Intermediate Results

#### CVFileMetadata
```typescript
{
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  uploadedAt: string;
  fileKey: string;              // S3 reference
  checksum?: string;
  status: 'pending' | 'processing' | 'analyzed' | 'failed';
}
```

#### CVAnalysisResult
```typescript
{
  fileKey: string;
  fileName: string;
  candidateName?: string;
  email?: string;
  skills: string[];
  yearsOfExperience?: number;
  education?: { degree, field, institution }[];
  workHistory?: { company, role, duration }[];
  matchScore?: number;           // 0-100
  screeningScores?: { [key]: number };
  analysisStatus: 'pending' | 'completed' | 'failed';
}
```

#### BulkAnalysisReport
```typescript
{
  uploadId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  totalCVsUploaded: number;
  totalCVsAnalyzed: number;
  analysisCompletionPercentage: number;
  cvResults: CVAnalysisResult[];
  topMatches?: [{ fileKey, candidateName, matchScore, screeningScores }];
  generatedJobId: string;        // VT-XXXX format
  reportUrl: string;
  shareableLink: string;
}
```

### Level 3: Complete Workflow DTO

#### CompleteCVUploadDto
```typescript
{
  uploadId: string;
  uploadMode: 'existing' | 'create';
  uploadedBy: string;
  uploadedAt: string;
  
  jobContext: {
    mode: 'existing' | 'create';
    jobId?: string;
    newContext?: JobContextData;
  };
  
  uploadData: {
    totalFiles: number;
    totalSize: number;
    files: CVFileMetadata[];
  };
  
  analysisResults: {
    generatedJobId?: string;
    analysisStartedAt: string;
    analysisCompletedAt?: string;
    analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
    cvResults?: CVAnalysisResult[];
  };
  
  screeningCriteria?: ScreeningCriteriaDto;
  publishOptions: PublishOptions;
  status: 'draft' | 'processing' | 'completed' | 'published' | 'failed';
}
```

---

## Component Data Transmission

### JobContextSelector
**Props:**
```typescript
{
  value?: CVUploadMode;
  onModeChange?: (mode: CVUploadMode) => void;
  jobData?: JobContextData;
  onJobDataChange?: (data: JobContextData) => void;
  existingJobs?: ExistingJob[];
  onExistingJobSelected?: (jobId: string) => void;
}
```

**Sends to parent:**
- Mode change: `onModeChange('existing' | 'create')`
- Job data: `onJobDataChange({ jobTitle, companyName, ... })`
- Job selection: `onExistingJobSelected(jobId)`

### BulkUpload
**Props:**
```typescript
{
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
  // Data props could be added:
  // onFilesSelected?: (files: CVFileMetadata[]) => void;
}
```

**Current behavior:**
- ⚠️ Accepts files but doesn't send them to parent
- Needs: `onFileMetadataChange` callback

**Should send to parent:**
- Uploaded files metadata
- Job context info (if available)
- Upload batch info

### ReviewAndAnalyze
**Props:**
```typescript
{
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
}
```

**Current behavior:**
- Simulates analysis with progress bar
- Calls tapiService.submit() when complete
- ⚠️ Doesn't coordinate with parent component state

### ScreeningCriteriaForm
**Props:**
```typescript
{
  onNext?: () => void;
  onBack?: () => void;
  onDataChange?: (data: ScreeningCriteriaDto) => void;
}
```

**Sends to parent:**
- Screening criteria: `onDataChange({ activeCriteria, criteriaData })`

### PreviewAndPublish
**Props:**
```typescript
{
  onNext?: () => void;
  onDataChange?: (data: PublishOptions) => void;
}
```

**Sends to parent:**
- Publish options: `onDataChange({ saveAsTemplate, visibilityOption })`

---

## Backend Integration

### Endpoint: POST /tapi/submit

**Purpose:** Submit CV upload batch for processing

**Request:**
```typescript
FormData {
  // Job context
  jobContextMode: 'existing' | 'create'
  jobId?: string
  jobTitle?: string
  companyName?: string
  // ... other job context fields
  
  // File batch
  files: File[] // Raw File objects from input
  
  // Options
  totalFiles: number
  batchName?: string
}
```

**Response:**
```typescript
{
  uploadId: string;
  status: 'queued' | 'processing';
  estimatedCompletionTime?: number;
  jobId: string;
  message: string;
}
```

### Endpoint: GET /tapi/my-submissions

**Purpose:** Get analysis status and results

**Response:**
```typescript
BulkAnalysisReport[]
```

---

## File Validation

### Accepted Formats
- PDF (application/pdf)
- DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- DOC (application/msword)
- TXT (text/plain)

### Size Limits
- **Per file:** 10MB max
- **Per batch:** 100MB max
- **Total files:** 1,000 max

### Validation Function
```typescript
validateCVFile(file: File): { valid: boolean; error?: string }
```

---

## State Management

### CvUpload.tsx (Parent Component)
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [uploadMode, setUploadMode] = useState<'existing' | 'create' | null>('create');

// Could be enhanced to track:
// const [jobContext, setJobContext] = useState<JobContextData>();
// const [uploadedFiles, setUploadedFiles] = useState<CVFileMetadata[]>();
// const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteriaDto>();
// const [publishOptions, setPublishOptions] = useState<PublishOptions>();
```

---

## Error Handling

### File Upload Errors
```typescript
{
  code: 'FILE_SIZE_EXCEEDED' | 'INVALID_FILE_TYPE' | 'TOTAL_SIZE_EXCEEDED';
  message: string;
  fileName?: string;
}
```

### Analysis Errors
```typescript
{
  code: 'ANALYSIS_FAILED' | 'NETWORK_ERROR' | 'TIMEOUT';
  message: string;
  retryable: boolean;
}
```

---

## Data Flow Example

### Complete 'Create' Mode Flow

```
1. JobContextSelector:
   User fills: jobTitle, companyName, employmentType, location
   → onJobDataChange({ jobTitle, companyName, ... })
   → Parent stores in jobContext state

2. BulkUpload:
   User drags 50 CVs (95MB total)
   → Files validated locally
   → User clicks "Next"
   → Should call: onFileMetadataChange([...])
   → Parent stores files & generates uploadId

3. ScreeningCriteriaForm:
   User selects "Culture, Experience, Skills"
   Assigns weights (20, 60, 70)
   → onDataChange({ activeCriteria, criteriaData })
   → Parent stores in screeningCriteria state

4. PreviewAndPublish:
   User unchecks "Save as template"
   Keeps "Public"
   → onDataChange({ saveAsTemplate: false, visibilityOption: 'public' })
   → Parent stores in publishOptions state

5. Final Submit:
   Parent builds CompleteCVUploadDto:
   {
     uploadId: 'uuid',
     uploadMode: 'create',
     jobContext: { mode: 'create', newContext: {...} },
     uploadData: { files: [...], totalSize: 95MB },
     screeningCriteria: { activeCriteria, criteriaData },
     publishOptions: { ... },
     status: 'processing'
   }
   
   POST /tapi/submit with FormData including:
   - files (actual File objects)
   - metadata (json)

6. ReviewAndAnalyze (async):
   Backend processes upload
   AI analyzes each CV
   Returns: BulkAnalysisReport with results
```

---

## Implementation Checklist

- [ ] Create `types/cv_upload.ts` ✅ DONE
- [ ] Update BulkUpload to call `onFileMetadataChange` callback
- [ ] Update CvUpload.tsx parent to collect all step data
- [ ] Wire together all step components with proper state passing
- [ ] Implement file aggregation in final submit
- [ ] Add error handling for file validation
- [ ] Add progress tracking across steps
- [ ] Integrate with tapiService for backend submission
- [ ] Handle async analysis completion
- [ ] Display analysis results/report

---

## Related Types

- **JobContextData** - From `types/cv_upload.ts`
- **ScreeningCriteriaDto** - From `types/create_job.ts`
- **CVFileMetadata** - From `types/cv_upload.ts`
- **CVAnalysisResult** - From `types/cv_upload.ts`
- **BulkAnalysisReport** - From `types/cv_upload.ts`

---

## File References

- **Types:** `types/cv_upload.ts`
- **Components:**
  - `components/Dashboard/cv-upload/job_context.tsx`
  - `components/Dashboard/cv-upload/bulk_upload.tsx`
  - `components/Dashboard/cv-upload/review.tsx`
  - `components/molecules/CvUpload.tsx` (parent orchestrator)
- **Services:** `lib/services/tapiService.ts`
