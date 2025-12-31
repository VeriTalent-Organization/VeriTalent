# CV Upload DTO - Quick Reference

## What is CV Upload?

The CV Upload feature lets organizations bulk upload CVs and automatically screen candidates using AI. It combines:
- Job context definition (existing or new)
- Bulk file upload (PDF/DOCX/TXT)
- AI-powered CV analysis
- Candidate matching against screening criteria
- Report generation and candidate ranking

---

## File Structure

**Main DTO File:** `types/cv_upload.ts`

Contains:
- ✅ 7 Zod schemas with validation
- ✅ 7 TypeScript types
- ✅ 3 complete example payloads
- ✅ Validation helper functions
- ✅ Constants for file limits

---

## Key DTOs

### 1. **JobContextData** (Step 1)
```typescript
{
  jobTitle: string;
  companyName: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance';
  location: string;
  roleOverview?: string;
}
```
📍 **Component:** JobContextSelector
📤 **Sends via:** onJobDataChange callback

---

### 2. **BulkUploadDto** (Step 2)
```typescript
{
  jobContextMode: 'existing' | 'create';
  jobId?: string;              // For existing
  jobContext?: JobContextData; // For create
  totalFiles: number;
  totalSize: number;
  files: CVFileMetadata[];
  uploadId: string;
  uploadedBy: string;
}
```
📍 **Component:** BulkUpload
📤 **Sends to:** Backend /tapi/submit with FormData

---

### 3. **ScreeningCriteriaDto** (Step 4 - Create Mode Only)
```typescript
{
  activeCriteria: string[];
  criteriaData: {
    [key: string]: { context: string; weight: number }
  }
}
```
📍 **Component:** ScreeningCriteriaForm
📤 **Sends via:** onDataChange callback

---

### 4. **PublishOptions** (Step 5)
```typescript
{
  saveAsTemplate: boolean;
  visibilityOption: 'public' | 'featured';
  notifyRecruiter?: boolean;
  generateReport?: boolean;
}
```
📍 **Component:** PreviewAndPublish
📤 **Sends via:** onDataChange callback

---

### 5. **CVAnalysisResult** (Analysis Output)
```typescript
{
  fileKey: string;
  fileName: string;
  candidateName?: string;
  skills: string[];
  yearsOfExperience?: number;
  matchScore: number;      // 0-100
  screeningScores: { [key]: number };
  analysisStatus: 'completed' | 'failed';
}
```
📍 **From:** Backend AI analysis

---

### 6. **BulkAnalysisReport** (Final Results)
```typescript
{
  uploadId: string;
  jobId: string;
  totalCVsUploaded: number;
  totalCVsAnalyzed: number;
  cvResults: CVAnalysisResult[];
  topMatches: [{ candidateName, matchScore }];
  generatedJobId: string;  // VT-XXXX
  reportUrl: string;
}
```
📍 **From:** Backend after analysis complete

---

### 7. **CompleteCVUploadDto** (Full Workflow)
Combines all steps into one submission payload:
```typescript
{
  uploadId, uploadMode, jobContext, uploadData,
  analysisResults, screeningCriteria,
  publishOptions, status
}
```
📍 **Purpose:** Complete end-to-end tracking

---

## Workflow by Mode

### Mode: 'existing' (Link to Existing Job)
```
JobContextSelector
  ↓ (select existing job + mode)
BulkUpload
  ↓ (upload CVs)
ReviewAndAnalyze
  ↓ (AI analyzes)
PreviewAndPublish
  ↓ (finalize)
Complete
```
**Screening criteria:** Pre-defined from job creation

---

### Mode: 'create' (Create New Context)
```
JobContextSelector
  ↓ (define new job + mode)
BulkUpload
  ↓ (upload CVs)
ScreeningCriteriaForm
  ↓ (define weights)
PreviewAndPublish
  ↓ (finalize)
ReviewAndAnalyze
  ↓ (AI analyzes)
Complete
```
**Screening criteria:** User-defined in step 4

---

## File Validation

```typescript
validateCVFile(file: File): { valid: boolean; error?: string }
```

**Accepted types:** .pdf, .docx, .doc, .txt
**Size limits:**
- Per file: 10MB
- Per batch: 100MB
- Max files: 1,000

---

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| JobContextSelector | ✅ Ready | Sends jobContext data |
| BulkUpload | ⚠️ Needs Work | Should send file metadata |
| ReviewAndAnalyze | ⚠️ Placeholder | Simulates progress |
| ScreeningCriteriaForm | ✅ Ready | Sends screening criteria |
| PreviewAndPublish | ✅ Ready | Sends publish options |

---

## Backend Endpoint

### POST /tapi/submit
**Submits:** CV batch for processing

**Request:** FormData with:
- files (File[])
- jobContextMode, jobId/jobTitle, companyName, etc.
- totalFiles, batchName

**Response:**
```typescript
{
  uploadId: string;
  status: 'queued' | 'processing';
  jobId: string;
}
```

---

## Validation Examples

### Valid CV Upload (Create Mode)
```typescript
const validUpload = {
  jobContext: {
    mode: 'create',
    newContext: {
      jobTitle: 'Senior Developer',
      companyName: 'TechCorp',
      employmentType: 'Full Time',
      location: 'Remote',
    }
  },
  files: [
    {
      fileName: 'resume.pdf',
      fileSize: 512000,        // 512KB ✓
      fileMimeType: 'application/pdf',
      fileKey: 's3://bucket/resume.pdf'
    }
  ],
  totalFiles: 1,
  totalSize: 512000,            // < 100MB ✓
  publishOptions: {
    saveAsTemplate: false,
    visibilityOption: 'public'
  }
};
```

### Invalid Example
```typescript
const invalid = {
  jobContext: {
    mode: 'create',
    newContext: {
      jobTitle: '',  // ❌ Required
      companyName: 'TechCorp',
      employmentType: 'Full Time',
      location: 'Remote',
    }
  },
  files: [
    {
      fileName: 'huge.pdf',
      fileSize: 15000000,       // ❌ > 10MB
      fileMimeType: 'application/pdf',
    }
  ],
  totalSize: 150000000,         // ❌ > 100MB
};
```

---

## Import in Components

```typescript
import type {
  CompleteCVUploadDto,
  BulkUploadDto,
  JobContextData,
  ScreeningCriteriaDto,
  PublishOptions,
  BulkAnalysisReport,
  CVAnalysisResult
} from '@/types/cv_upload';

import {
  validateCVFile,
  validateCompleteCVUpload,
  exampleCompleteCVUploadPayload
} from '@/types/cv_upload';
```

---

## Next Steps

1. ✅ **DTOs Created** - All types & schemas defined
2. ⏳ **Update BulkUpload** - Add onFileMetadataChange callback
3. ⏳ **Update Parent (CvUpload.tsx)** - Collect all step data
4. ⏳ **Wire Components** - Pass data between steps
5. ⏳ **Backend Integration** - Prepare /tapi/submit endpoint
6. ⏳ **Testing** - End-to-end workflow test

---

## Related Documentation

- 📄 `docs/cv_upload_feature.md` - Complete feature guide
- 📄 `types/cv_upload.ts` - DTO definitions
- 📄 `components/molecules/CvUpload.tsx` - Parent orchestrator
