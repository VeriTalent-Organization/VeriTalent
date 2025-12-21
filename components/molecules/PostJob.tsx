import React, { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import StepFooter from './StepFooter';
import JobBasicsStep from '@/components/Dashboard/steps/job_basics_step';
import JobDescriptionForm from '@/components/Dashboard/steps/job_description_form';
import ScreeningCriteriaForm from '@/components/Dashboard/steps/screen_criteria_form';
import ApplicationInstructions from '@/components/Dashboard/steps/application_instruction_form';
import PreviewAndPublish from '@/components/Dashboard/steps/preview';

const postJobSteps = [
  { component: JobBasicsStep, nextLabel: "Job description" },
  { component: JobDescriptionForm, nextLabel: "Screening Criteria" },
  { component: ScreeningCriteriaForm, nextLabel: "Application Instructions" },
  { component: ApplicationInstructions, nextLabel: "Preview & Publish" },
  { component: PreviewAndPublish, nextLabel: "Publish" },
];

export default function PostJobTab() {
  const [currentStep, setCurrentStep] = useState(0);
  
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

  const handlePublish = () => {
    console.log("Publishing job...");
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
          onNext={handleNext}
          onBack={handleBack}
        />

        <StepFooter
          onBack={handleBack}
          onNext={currentStep === postJobSteps.length - 1 ? handlePublish : handleNext}
          onSaveDraft={handleSaveDraft}
          canGoBack={currentStep > 0}
          isLastStep={currentStep === postJobSteps.length - 1}
          nextLabel={`Next: ${postJobSteps[currentStep].nextLabel}`}
          finalActionLabel="Publish Job"
          showSaveDraft={true}
        />
      </div>
    </div>
  );
}