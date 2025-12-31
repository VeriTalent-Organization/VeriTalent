# CV Upload Components - Analysis & Recommendations

## Current Component Status

### ✅ Components Working Correctly

#### 1. JobContextSelector
**File:** `components/Dashboard/cv-upload/job_context.tsx`

**Functionality:**
- Allows user to choose between 'existing' or 'create' mode
- For 'create' mode: Displays form to enter job context details
- For 'existing' mode: Shows dropdown to select existing job

**Data Transmission:**
- ✅ Sends mode via: `onModeChange(mode: CVUploadMode)`
- ✅ Sends job context via: `onJobDataChange(data: JobContextData)`
- ✅ Sends selected job via: `onExistingJobSelected(jobId: string)`

**Status:** ✅ **Ready for production**

---

#### 2. ScreeningCriteriaForm
**File:** `components/Dashboard/steps/screen_criteria_form.tsx`

**Functionality:**
- User selects which screening criteria to use
- Sets weight/importance for each criterion
- Shows context for what to screen for

**Data Transmission:**
- ✅ Fixed in previous session: Now sends complete `ScreeningCriteriaDto` with:
  - `activeCriteria: string[]` (selected criteria names)
  - `criteriaData: Record<string, {context, weight}>`

**Status:** ✅ **Ready for production**

---

#### 3. PreviewAndPublish
**File:** `components/Dashboard/steps/preview.tsx`

**Functionality:**
- Displays job preview card
- Allows setting publish options:
  - Save as template (checkbox)
  - Visibility option (featured/public radio buttons)

**Data Transmission:**
- ✅ Sends publish options via: `onDataChange({saveAsTemplate, visibilityOption})`
- ✅ Updates sent in real-time as user changes options

**Status:** ✅ **Ready for production**

---

### ⚠️ Components Needing Work

#### 1. BulkUpload
**File:** `components/Dashboard/cv-upload/bulk_upload.tsx`

**Current Functionality:**
- ✅ Drag-and-drop file upload
- ✅ Browse file selection
- ✅ File format validation (pdf, docx, doc, txt)
- ✅ Display uploaded files list
- ✅ Remove individual files

**Issues:**

1. **Missing onDataChange Callback:**
   ```typescript
   // Currently NO data transmission to parent
   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
   // Files are stored locally but never sent to parent
   ```

2. **Missing Job Context Props:**
   ```typescript
   // Component doesn't accept job context info
   // Should show: Job title, Company, etc. from previous step
   ```

3. **No File Metadata Tracking:**
   ```typescript
   // Files stored as raw File objects
   // Should convert to CVFileMetadata with fileKey, checksum, etc.
   ```

4. **No Submit Handler:**
   ```typescript
   // No button to aggregate and send data
   // Should build BulkUploadDto and send
   ```

**Recommendations:**

```typescript
interface BulkUploadProps {
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
  
  // NEW: Job context info from previous step
  jobContext?: {
    mode: 'existing' | 'create';
    jobId?: string;
    jobData?: JobContextData;
  };
  
  // NEW: Callback when files are ready
  onFileMetadataChange?: (files: CVFileMetadata[], jobContext: any) => void;
}

export default function BulkUpload({
  onNext,
  onBack,
  canBack,
  jobContext,
  onFileMetadataChange
}: BulkUploadProps) {
  // ... existing code ...
  
  // NEW: Generate metadata when user clicks Next
  const handleNext = () => {
    const metadata = uploadedFiles.map((file, index) => ({
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      uploadedAt: new Date().toISOString(),
      fileKey: `temp-${index}`, // Will be replaced by S3 key
      status: 'pending' as const,
    }));
    
    // Send to parent
    onFileMetadataChange?.(metadata, jobContext);
    onNext?.();
  };
}
```

**Status:** ⚠️ **Needs implementation**

---

#### 2. ReviewAndAnalyze
**File:** `components/Dashboard/cv-upload/review.tsx`

**Current Functionality:**
- ✅ Shows progress animation (0-100%)
- ✅ Displays job info and screening criteria
- ✅ Shows completion checklist
- ✅ Calls tapiService.submit() when complete

**Issues:**

1. **Hardcoded Preview Data:**
   ```typescript
   // Shows static "Software Engineer", "TechCorp", "95 CVs"
   // Should receive actual data from previous steps
   ```

2. **No Props for Data:**
   ```typescript
   // Only accepts onNext, onBack, canBack
   // Doesn't receive: jobId, jobTitle, cvCount, screingCriteria
   ```

3. **Disconnected from Flow:**
   ```typescript
   // Calls tapiService.submit() with empty FormData
   // Doesn't have access to: uploadId, files, jobContext
   ```

4. **No Error Handling:**
   ```typescript
   // Only shows "Failed to submit analysis" generic message
   // Should handle specific errors and retry logic
   ```

**Recommendations:**

```typescript
interface ReviewAndAnalyzeProps {
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
  
  // NEW: Data from previous steps
  uploadData?: {
    uploadId: string;
    totalFiles: number;
    jobTitle: string;
    companyName: string;
    files: CVFileMetadata[];
  };
  
  screeningCriteria?: ScreeningCriteriaDto;
  
  // NEW: Callback when analysis completes
  onAnalysisComplete?: (report: BulkAnalysisReport) => void;
}

export default function ReviewAndAnalyze({
  uploadData,
  screeningCriteria,
  onAnalysisComplete,
  onNext,
}: ReviewAndAnalyzeProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleAnalysisComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleAnalysisComplete = async () => {
    try {
      const formData = new FormData();
      
      // Add files
      uploadData?.files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add metadata
      formData.append('uploadId', uploadData?.uploadId || '');
      formData.append('jobTitle', uploadData?.jobTitle || '');
      formData.append('screeningCriteria', JSON.stringify(screeningCriteria));
      
      const report = await tapiService.submit(formData);
      onAnalysisComplete?.(report);
      alert("Analysis submitted successfully!");
    } catch (error) {
      console.error("Failed to submit analysis:", error);
      alert("Failed to submit analysis. Please try again.");
    }
  };
}
```

**Status:** ⚠️ **Needs significant refactoring**

---

## Parent Component (CvUpload.tsx) Status

**File:** `components/molecules/CvUpload.tsx`

**Current State:**
- Manages step navigation
- Tracks upload mode
- Renders components conditionally

**Issues:**

1. **No Data Aggregation:**
   ```typescript
   // Only tracks currentStep and uploadMode
   // Doesn't collect data from components
   ```

2. **No State for Collected Data:**
   ```typescript
   // Should track:
   // - jobContext (from JobContextSelector)
   // - uploadedFiles (from BulkUpload)
   // - screeningCriteria (from ScreeningCriteriaForm)
   // - publishOptions (from PreviewAndPublish)
   // - analysisReport (from ReviewAndAnalyze)
   ```

3. **Missing onDataChange Handlers:**
   ```typescript
   // Components that need handlers:
   // - BulkUpload: onFileMetadataChange
   // - ScreeningCriteriaForm: onDataChange
   // - PreviewAndPublish: onDataChange
   // - ReviewAndAnalyze: onAnalysisComplete
   ```

**Recommendation:**

```typescript
export default function CVUploadTab() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // NEW: Collected data from each step
  const [jobContext, setJobContext] = useState<{
    mode: 'existing' | 'create';
    jobId?: string;
    jobData?: JobContextData;
  }>();
  
  const [uploadData, setUploadData] = useState<{
    files: CVFileMetadata[];
    totalSize: number;
  }>();
  
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteriaDto>();
  const [publishOptions, setPublishOptions] = useState<PublishOptions>();
  const [analysisReport, setAnalysisReport] = useState<BulkAnalysisReport>();

  const handleBulkUploadComplete = (files: CVFileMetadata[]) => {
    setUploadData({
      files,
      totalSize: files.reduce((sum, f) => sum + f.fileSize, 0)
    });
    handleNext();
  };

  const handleScreeningCriteriaChange = (criteria: ScreeningCriteriaDto) => {
    setScreeningCriteria(criteria);
    // Don't auto-advance, let user click Next
  };

  const handleAnalysisComplete = (report: BulkAnalysisReport) => {
    setAnalysisReport(report);
    handleNext();
  };

  // ... rest of component
}
```

---

## Data Flow Summary

### Current (Broken)
```
JobContextSelector ──→ Parent (mode only, no data)
                           ↓
BulkUpload ──→ (No data sent)
                ↓
ScreeningCriteriaForm ──→ (No handler)
                            ↓
PreviewAndPublish ──→ (No handler)
                        ↓
ReviewAndAnalyze ──→ (Static data, no real files)
```

### Recommended (Fixed)
```
JobContextSelector ──→ Parent (mode + jobContext)
     ↓
   setJobContext()
     ↓
BulkUpload ──→ Parent (files metadata)
     ↓
   setUploadData()
     ↓
ScreeningCriteriaForm ──→ Parent (criteria)
     ↓
   setScreeningCriteria()
     ↓
PreviewAndPublish ──→ Parent (options)
     ↓
   setPublishOptions()
     ↓
ReviewAndAnalyze ──→ (Uses all collected data)
     ↓
   onAnalysisComplete(report)
     ↓
   setAnalysisReport()
     ↓
Complete → Build CompleteCVUploadDto → Submit to backend
```

---

## Implementation Priority

### Phase 1: Immediate (Required)
1. ✅ Create DTOs (DONE)
2. Add props and callbacks to BulkUpload
3. Update CvUpload.tsx parent to collect data
4. Add state management in parent

### Phase 2: Near-term (Important)
1. Refactor ReviewAndAnalyze to use real data
2. Add error handling and retry logic
3. Integrate with actual file upload (S3, etc.)

### Phase 3: Polish (Nice-to-have)
1. Add progress tracking across steps
2. Persist upload state in localStorage
3. Add draft save functionality
4. Display real-time file upload progress

---

## File References

- **Types:** `types/cv_upload.ts` ✅ CREATED
- **Components:**
  - `components/Dashboard/cv-upload/job_context.tsx` ✅
  - `components/Dashboard/cv-upload/bulk_upload.tsx` ⚠️
  - `components/Dashboard/cv-upload/review.tsx` ⚠️
  - `components/molecules/CvUpload.tsx` ⚠️
- **Documentation:**
  - `docs/cv_upload_feature.md` ✅
  - `docs/cv_upload_quick_ref.md` ✅
  - `docs/cv_upload_components_analysis.md` (this file)
