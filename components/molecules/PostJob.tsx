import React, { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import StepFooter from './StepFooter';
import JobBasicsStep from '@/components/Dashboard/steps/job_basics_step';
import JobDescriptionForm from '@/components/Dashboard/steps/job_description_form';
import ScreeningCriteriaForm from '@/components/Dashboard/steps/screen_criteria_form';
import ApplicationInstructions from '@/components/Dashboard/steps/application_instruction_form';
import PreviewAndPublish from '@/components/Dashboard/steps/preview';
import { jobsService } from '@/lib/services/jobsService';
import type { CreateJobDto, ScreeningCriteriaDto } from '@/types/create_job';

const postJobSteps = [
  { component: JobBasicsStep, nextLabel: "Job description" },
  { component: JobDescriptionForm, nextLabel: "Screening Criteria" },
  { component: ScreeningCriteriaForm, nextLabel: "Application Instructions" },
  { component: ApplicationInstructions, nextLabel: "Preview & Publish" },
  { component: PreviewAndPublish, nextLabel: "Publish" },
];

export default function PostJobTab() {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobData, setJobData] = useState<Partial<CreateJobDto>>({});
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteriaDto>({
    activeCriteria: [],
    criteriaData: {
      context: '',
      weight: 100
    }
  });
  
  const CurrentStepComponent = postJobSteps[currentStep].component;

  const handleNext = () => {
    if (currentStep < postJobSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    try {
      console.log('[PostJob] Starting publish with jobData:', jobData);
      console.log('[PostJob] Screening criteria:', screeningCriteria);
      
      // Helper function to parse text into array (by newlines or commas)
      const parseTextToArray = (text: string | string[] | undefined): string[] => {
        if (!text) return [];
        if (Array.isArray(text)) return text;
        return text
          .split(/[\n,]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      };

      // Build complete CreateJobDto from all collected data
      const createData = {
        // Step 1: Job Basics
        title: jobData.title?.trim() || 'Untitled Job',
        companyName: jobData.companyName?.trim() || 'Unknown Company',
        employmentType: (jobData.employmentType as 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance') || 'Full Time',
        location: jobData.location?.trim() || 'Remote',
        otherInfo: jobData.otherInfo?.trim(),
        applicationDeadline: jobData.applicationDeadline || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        
        // Step 2: Job Description - Parse strings to arrays
        aboutRole: jobData.aboutRole?.trim() || 'No description provided',
        keyResponsibilities: parseTextToArray(jobData.keyResponsibilities),
        requiredSkills: parseTextToArray(jobData.requiredSkills),
        additionalInfo: jobData.additionalInfo?.trim(),
        
        // Step 3: Screening Criteria (nested structure as backend expects)
        screeningCriteria: screeningCriteria,
        
        // Step 4: Application Instructions
        applicationMethod: (jobData.applicationMethod as 'platform' | 'cv' | 'aicard' | 'custom') || 'platform',
        cvEmail: jobData.cvEmail?.trim(),
        aicardEmail: jobData.aicardEmail?.trim(),
        customInstruction: jobData.customInstruction?.trim(),
        
        // Step 5: Preview & Publish (only visibilityOption - saveAsTemplate removed)
        visibilityOption: (jobData.visibilityOption as 'featured' | 'public') || 'public',
        
        // Metadata (only tags - status, createdAt, updatedAt removed)
        tags: jobData.tags || [],
      };
      
      console.log("[PostJob] Final payload to send:", JSON.stringify(createData, null, 2));
      await jobsService.create(createData);
      alert("Job published successfully!");
    } catch (error) {
      console.error("Failed to publish job:", error);
      alert("Failed to publish job. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
  };

  return (
    <div className="bg-white rounded-lg shadow min-h-[600px] flex flex-col">
      <ProgressIndicator 
        totalSteps={postJobSteps.length} 
        currentStep={currentStep} 
      />

      <div className="p-4 sm:p-6 lg:p-8 flex-1">
        <CurrentStepComponent
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDataChange={(data: any) => {
            console.log('[PostJob] Received data from step:', data);
            // Handle screening criteria specially
            if (data && 'activeCriteria' in data) {
              console.log('[PostJob] Setting screening criteria');
              setScreeningCriteria(data as ScreeningCriteriaDto);
            } else if (data) {
              console.log('[PostJob] Updating job data');
              setJobData(prev => ({ ...prev, ...data }));
            }
          }}
          onNext={handleNext}
          onBack={handleBack}
        />

        {/* Only show StepFooter on the last step (Preview) */}
        {currentStep === postJobSteps.length - 1 && (
          <StepFooter
            onBack={handleBack}
            onNext={handlePublish}
            onSaveDraft={handleSaveDraft}
            canGoBack={currentStep > 0}
            isLastStep={true}
            nextLabel="Publish Job"
            finalActionLabel="Publish Job"
            showSaveDraft={true}
          />
        )}
      </div>
    </div>
  );
}