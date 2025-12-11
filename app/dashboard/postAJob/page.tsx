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
// import CvUploadForm from '@/components/Dashboard/cv_steps/cv_upload_form';
// import CvPreview from '@/components/Dashboard/cv_steps/cv_preview';

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
  const [cvUploadMode, setCvUploadMode] = useState<'existing' | 'create' | null>(null);
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
        // Wrapper for JobContextSelector to match step interface if needed
        component: (props: any) => (
          <CVUploadJobContext
            {...props}
            onModeChange={(mode: any) => {
              setCvUploadMode(mode);
              if (mode === 'existing') {
                // optionally auto-advance or let user click next
              }
            }}
          // Adapter: if component expects onNext/onBack, pass them.
          // But JobContextSelector might handle its own logic.
          // We can check if `onNext` is used inside JobContextSelector (it was added in prev steps)
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================================ */}
        {/* TOP TABS */}
        {/* ================================ */}
        <div className="flex gap-6 mb-6 border-b pb-4">
          {[
            { key: "post-job", label: "Post Job" },
            { key: "cv-upload", label: "CV Upload" },
            { key: "veritilent-ai", label: "Veritilent AI Card ID" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 rounded-md font-medium transition-colors
                ${activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
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
            <div className="px-8 py-8 border-b border-gray-100">
              <div className="flex items-center justify-between relative">
                {/* Background track */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-0 mx-10" />

                {postJobSteps.map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="relative z-10 flex flex-col items-center bg-white px-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ring-4 ring-white
                            ${index <= postJobStep
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200 text-gray-400'}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8 flex-1">
              {/* Render the component for the current step */}
              {PostJobComponent && <PostJobComponent
                // Pass common navigation props if the components accept them
                onNext={nextPost}
                onBack={backPost}
              // Some components might behave differently if they receive specific props
              />}

              {/* Footer Navigation (Global fallback if component doesn't have its own footer) */}
              <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                <button
                  onClick={backPost}
                  disabled={postJobStep === 0}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Back
                </button>

                <div className="flex gap-4">
                  <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium">
                    Save Draft
                  </button>

                  {postJobStep < postJobSteps.length - 1 ? (
                    <button
                      onClick={nextPost}
                      className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-sm"
                    >
                      Next: {postJobSteps[postJobStep].nextLabel}
                    </button>
                  ) : (
                    <button
                      onClick={publishPostJob}
                      className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-sm"
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
          <div className="bg-white p-8 rounded-lg shadow min-h-[600px] flex flex-col">
            {/* Progress */}
            <div className="mb-12">
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-teal-600 -z-0 rounded-full transition-all duration-300"
                  style={{ width: `${(cvStep / (cvSteps.length - 1)) * 100}%` }}
                />
                <div className="flex justify-between w-full">
                  {cvSteps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center z-10 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ring-4 ring-white
                                ${i <= cvStep ? 'bg-teal-600 text-white' : 'bg-gray-300 text-white'}`}>
                        {i <= cvStep && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <span className={`absolute top-10 whitespace-nowrap text-sm font-medium ${i === cvStep ? 'text-teal-600' : 'text-gray-500'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {CurrentCvStep && <CurrentCvStep
                onNext={nextCv}
                onBack={backCv}
                canBack={cvStep > 0}
              />}
            </div>

            <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
              <button
                onClick={backCv}
                disabled={cvStep === 0}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {cvStep < cvSteps.length - 1 ? (
                <button onClick={nextCv} className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
                  Next: {cvSteps[cvStep + 1]?.label}
                </button>
              ) : (
                <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                  {cvUploadMode === 'existing' ? 'Analyze CVs' : 'Process Applications'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Placeholder for AI Card Tab */}
        {activeTab === "veritilent-ai" && (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <h2 className="text-2xl font-bold text-gray-400">VeriTalent AI Card ID</h2>
            <p className="text-gray-500 mt-2">Feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}