'use client';

import React, { useState } from 'react';

// POST JOB STEPS (User Requested Components)
import JobBasicsStep from '@/components/Dashboard/steps/job_basics_step';
import JobDescriptionForm from '@/components/Dashboard/steps/job_description_form';
import ScreeningCriteriaForm from '@/components/Dashboard/steps/screen_criteria_form';
import ApplicationInstructions from '@/components/Dashboard/steps/application_instruction_form';
import PreviewAndPublish from '@/components/Dashboard/steps/preview';

// CV UPLOAD STEPS
import CVUploadJobContext from '@/components/Dashboard/cv-upload/job_context';
import BulkUpload from '@/components/Dashboard/cv-upload/bulk_upload';
import ReviewAndAnalyze from '@/components/Dashboard/cv-upload/review';

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
}

export default function CreateJobPage() {
  // ================================
  // MAIN TOP TABS
  // ================================
  const [activeTab, setActiveTab] = useState("post-job");
  const [aiStep, setAiStep] = useState(0);
  const [cvUploadMode, setCvUploadMode] = useState<'existing' | 'create' | null>('create');
  const [cvStep, setCvStep] = useState(0);

  // ================================
  // POST JOB STEPS CONFIGURATION
  // ================================
  const postJobSteps = [
    { component: JobBasicsStep, nextLabel: "Job description" },
    { component: JobDescriptionForm, nextLabel: "Screening Criteria" },
    { component: ScreeningCriteriaForm, nextLabel: "Application Instructions" },
    { component: ApplicationInstructions, nextLabel: "Preview & Publish" },
    { component: PreviewAndPublish, nextLabel: "Publish" },
  ];

  const [postJobStep, setPostJobStep] = useState(0);
  const PostJobComponent = postJobSteps[postJobStep].component;

  const nextPost = () => {
    if (postJobStep < postJobSteps.length - 1) {
      setPostJobStep(postJobStep + 1);
    }
  };

  const backPost = () => {
    if (postJobStep > 0) {
      setPostJobStep(postJobStep - 1);
    }
  };

  const publishPostJob = () => {
    console.log("Publishing job...");
  };

  // ================================
  // CV UPLOAD STEPS CONFIGURATION
  // ================================
  const getCvSteps = () => {
    const baseSteps = [
      {
        component: (props: any) => (
          <CVUploadJobContext
            value={cvUploadMode!}
            onModeChange={setCvUploadMode}
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

    if (cvUploadMode === 'existing') {
      return [
        ...baseSteps,
        { component: ReviewAndAnalyze, label: "Review & Match" },
      ];
    }

    if (cvUploadMode === 'create') {
      return [
        ...baseSteps,
        { component: ScreeningCriteriaForm, label: "Screening Criteria" },
        { component: PreviewAndPublish, label: "Review & Process" },
      ];
    }

    return baseSteps;
  };

  const veritalentAISteps = () => {
    const baseSteps = [
      {
        component: (props: any) => (
          <CVUploadJobContext
            value={cvUploadMode!}
            onModeChange={setCvUploadMode}
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

    if (cvUploadMode === 'existing') {
      return [
        ...baseSteps,
        { component: ReviewAndAnalyze, label: "Review & Match" },
      ];
    }

    if (cvUploadMode === 'create') {
      return [
        ...baseSteps,
        { component: ScreeningCriteriaForm, label: "Screening Criteria" },
        { component: PreviewAndPublish, label: "Review & Process" },
      ];
    }

    return baseSteps;
  };

  const cvSteps = getCvSteps();
  const CurrentCvStep = cvSteps[cvStep]?.component;

  const nextCv = () => setCvStep(prev => Math.min(prev + 1, cvSteps.length - 1));
  const backCv = () => setCvStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================================ */}
        {/* TOP TABS */}
        {/* ================================ */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6 border-b pb-4 overflow-x-auto">
          {[
            { key: "post-job", label: "Post Job" },
            { key: "cv-upload", label: "CV Upload" },
            { key: "veritilent-ai", label: "Veritilent AI Card ID" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base whitespace-nowrap
                ${activeTab === tab.key
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: POST JOB */}
        {/* ================================================================= */}
        {activeTab === "post-job" && (
          <div className="bg-white rounded-lg shadow min-h-[600px] flex flex-col">

            {/* Step Counter Header */}
            <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-gray-100">
              <div className="flex items-center justify-between relative">
                {/* Background track */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 z-0 mx-4 sm:mx-10" /> 

                {postJobSteps.map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="relative flex flex-col items-center bg-white px-1 sm:px-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ring-2 sm:ring-4 ring-white
                            ${index <= postJobStep
                            ? 'bg-brand-primary text-white'
                            : 'bg-gray-200 text-gray-400'}`}
                      
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-4 sm:p-6 lg:p-8 flex-1">
              {PostJobComponent && <PostJobComponent
                onNext={nextPost}
                onBack={backPost}
              />}

              {/* Footer Navigation */}
              <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-gray-100">
                <button
                  onClick={backPost}
                  disabled={postJobStep === 0}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Back
                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="w-full sm:w-auto px-6 py-3 border border-brand-primary text-brand-primary rounded-lg hover:bg-cyan-50 transition font-medium text-sm sm:text-base order-2 sm:order-1">
                    Save Draft
                  </button>

                  {postJobStep < postJobSteps.length - 1 ? (
                    <button
                      onClick={nextPost}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-sm text-sm sm:text-base order-1 sm:order-2"
                    >
                      Next: {postJobSteps[postJobStep].nextLabel}
                    </button>
                  ) : (
                    <button
                      onClick={publishPostJob}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-sm text-sm sm:text-base order-1 sm:order-2"
                    >
                      Publish Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: CV UPLOAD */}
        {/* ================================================================= */}
        {activeTab === "cv-upload" && (
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow min-h-[600px] flex flex-col">
            {/* Progress */}
            {cvUploadMode === "create" && (
              <div className="mb-8 sm:mb-12">
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 z-0 rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    {cvSteps.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center bg-white px-1 sm:px-2">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ring-2 sm:ring-4 ring-white
                              ${index <= cvStep
                                ? 'bg-brand-primary text-white'
                                : 'bg-gray-200 text-gray-400'}`}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">
              {CurrentCvStep && <CurrentCvStep
                onNext={nextCv}
                onBack={backCv}
                canBack={cvStep > 0}
              />}
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-gray-100">
              <button
                onClick={backCv}
                disabled={cvStep === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Back
              </button>

              {cvStep < cvSteps.length - 1 ? (
                <button 
                  onClick={nextCv} 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm sm:text-base"
                >
                  Next: {cvSteps[cvStep + 1]?.label}
                </button>
              ) : (
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm sm:text-base">
                  {cvUploadMode === 'existing' ? 'Analyze CVs' : 'Process Applications'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: AI CARD */}
        {/* ================================================================= */}
        {activeTab === "veritilent-ai" && (
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow min-h-[600px] flex flex-col">
            
            {/* Progress */}
            {cvUploadMode === "create" && (
              <div className="mb-8 sm:mb-12">
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 z-0 rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    {veritalentAISteps().map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center bg-white px-1 sm:px-2">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ring-2 sm:ring-4 ring-white
                              ${index <= aiStep
                                ? 'bg-brand-primary text-white'
                                : 'bg-gray-200 text-gray-400'}`}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1">
              {veritalentAISteps()[aiStep]?.component &&
                React.createElement(veritalentAISteps()[aiStep].component, {
                  onNext: () =>
                    setAiStep(prev => Math.min(prev + 1, veritalentAISteps().length - 1)),
                  onBack: () =>
                    setAiStep(prev => Math.max(prev - 1, 0)),
                  canBack: aiStep > 0,
                })}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-gray-100">
              <button
                onClick={() => setAiStep(prev => Math.max(prev - 1, 0))}
                disabled={aiStep === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Back
              </button>

              {aiStep < veritalentAISteps().length - 1 ? (
                <button
                  onClick={() =>
                    setAiStep(prev => Math.min(prev + 1, veritalentAISteps().length - 1))
                  }
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm sm:text-base"
                >
                  Next: {veritalentAISteps()[aiStep + 1]?.label}
                </button>
              ) : (
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm sm:text-base">
                  Process AI Card
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}