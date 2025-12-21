import React, { useState } from 'react';
import StepFooter from './StepFooter';
import CVUploadJobContext from '@/components/Dashboard/cv-upload/job_context';
import BulkUpload from '@/components/Dashboard/cv-upload/bulk_upload';
import ReviewAndAnalyze from '@/components/Dashboard/cv-upload/review';
import ScreeningCriteriaForm from '@/components/Dashboard/steps/screen_criteria_form';
import PreviewAndPublish from '@/components/Dashboard/steps/preview';

export default function VeritalentAITab() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadMode, setUploadMode] = useState<'existing' | 'create' | null>('create');

  const getAISteps = () => {
    const baseSteps = [
      {
        component: (props: any) => (
          <CVUploadJobContext
            value={uploadMode!}
            onModeChange={setUploadMode}
            {...props}
          />
        ),
        label: "Job Context",
      },
      {
        component: BulkUpload,
        label: "Upload CVs",
      },
    ];

    if (uploadMode === 'existing') {
      return [
        ...baseSteps,
        { component: ReviewAndAnalyze, label: "Review & Match" },
      ];
    }

    if (uploadMode === 'create') {
      return [
        ...baseSteps,
        { component: ScreeningCriteriaForm, label: "Screening Criteria" },
        { component: PreviewAndPublish, label: "Review & Process" },
      ];
    }

    return baseSteps;
  };

  const aiSteps = getAISteps();
  const CurrentStepComponent = aiSteps[currentStep]?.component;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, aiSteps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleProcessAICard = () => {
    console.log('Processing AI Card...');
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow min-h-[600px] flex flex-col">
      {uploadMode === "create" && (
        <div className="mb-8 sm:mb-12">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 z-0 rounded-full" />
            <div className="flex items-center justify-between relative z-10">
              {aiSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center bg-white px-1 sm:px-2">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ring-2 sm:ring-4 ring-white
                      ${index <= currentStep
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-200 text-gray-400'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        {CurrentStepComponent && (
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            canBack={currentStep > 0}
          />
        )}
      </div>

      <StepFooter
        onBack={handleBack}
        onNext={currentStep === aiSteps.length - 1 ? handleProcessAICard : handleNext}
        canGoBack={currentStep > 0}
        isLastStep={currentStep === aiSteps.length - 1}
        nextLabel={`Next: ${aiSteps[currentStep + 1]?.label}`}
        finalActionLabel="Process AI Card"
      />
    </div>
  );
}