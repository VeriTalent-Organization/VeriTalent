'use client';

import React, { useState } from 'react';

// POST JOB STEPS
import JobBasicsStep from '@/components/Dashboard/steps/job_basics_step';
import JobDescriptionForm from '@/components/Dashboard/steps/job_description_form';
import ScreeningCriteriaForm from '@/components/Dashboard/steps/screen_criteria_form';
import ApplicationInstructions from '@/components/Dashboard/steps/application_instruction_form';
import PreviewAndPublish from '@/components/Dashboard/steps/preview';

// CV UPLOAD STEPS (example imports)
import CVUploadJobContext from '@/components/Dashboard/cv-upload/job_context';
import BulkUpload from '@/components/Dashboard/cv-upload/bulk_upload';
import ReviewAndAnalyze from '@/components/Dashboard/cv-upload/review';
// import CvUploadForm from '@/components/Dashboard/cv_steps/cv_upload_form';
// import CvPreview from '@/components/Dashboard/cv_steps/cv_preview';

export default function CreateJobPage() {
  // ================================
  // MAIN TOP TABS
  // ================================
  const [activeTab, setActiveTab] = useState("cv-upload");
  const [cvUploadMode, setCvUploadMode] = useState<'existing' | 'create' | null>(null);
  const [cvStep, setCvStep] = useState(0);

  // ================================
  // POST JOB STEPS
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

  const getCvSteps = () => {
    const baseSteps = [
      {
        component: () => (
          <CVUploadJobContext
            onModeSelect={(mode) => {
              setCvUploadMode(mode);
              // Auto-advance if they pick "existing" (no form needed)
              if (mode === 'existing') {
                setCvStep(1);
              }
            }}
            onContinue={() => setCvStep(1)}
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

    return baseSteps; // fallback
  };

  const cvSteps = getCvSteps();
  const CurrentStep = cvSteps[cvStep]?.component;

  const nextCv = () => setCvStep(prev => Math.min(prev + 1, cvSteps.length - 1));
  const backCv = () => setCvStep(prev => Math.max(prev - 1, 0));
//   const nextCv = () => {
//     if (cvStep < cvSteps.length - 1) {
//       setCvStep(cvStep + 1);
//     }
//   };

//   const backCv = () => {
//     if (cvStep > 0) {
//       setCvStep(cvStep - 1);
//     }
//   };

  const finishCv = () => {
    console.log("CV uploaded successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

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
                px-4 py-2 rounded-md 
                ${activeTab === tab.key 
                  ? "bg-brand-primary text-white" 
                  : "text-gray-600 hover:bg-gray-200"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: POST JOB (with step counter) */}
        {/* ================================================================= */}
        {activeTab === "post-job" && (
          <div className="bg-white rounded-lg shadow">

            {/* Step Counter Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {postJobSteps.map((_, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center 
                      ${index <= postJobStep 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-gray-200 text-gray-400'}`}
                    />
                    {index < postJobSteps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded 
                        ${index < postJobStep 
                          ? 'bg-brand-primary' 
                          : 'bg-gray-200'}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              <PostJobComponent />

              {/* Footer Navigation */}
              <div className="flex justify-between mt-6">

                <button
                  onClick={backPost}
                  disabled={postJobStep === 0}
                  className="px-6 py-3 rounded-lg border border-gray-300 disabled:opacity-40"
                >
                  Back
                </button>

                <div className="flex gap-3">
                  <button className="px-6 py-2 border-brand-primary border bg-white text-brand-primary rounded-lg">
                    Save Draft
                  </button>

                  {postJobStep < postJobSteps.length - 1 ? (
                    <button
                      onClick={nextPost}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg"
                    >
                      Next: {postJobSteps[postJobStep].nextLabel}
                    </button>
                  ) : (
                    <button
                      onClick={publishPostJob}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg"
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
        {/* TAB 2: CV UPLOAD (NO step counter but still has steps) */}
        {/* ================================================================= */}
        {activeTab === "cv-upload" && (
            <div className="bg-white p-8 rounded-lg shadow">
                {/* Optional: Show progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {cvSteps.map((step, i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            i <= cvStep ? 'bg-teal-600 text-white' : 'bg-gray-300'
                            }`}>
                            {i + 1}
                            </div>
                            {i < cvSteps.length - 1 && (
                            <div className={`w-24 h-1 mx-2 ${i < cvStep ? 'bg-teal-600' : 'bg-gray-300'}`} />
                            )}
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        {cvSteps.map((s, i) => (
                        <span key={i}>{s.label}</span>
                        ))}
                    </div>
                </div>

                {CurrentStep && <CurrentStep />}

                <div className="flex justify-between mt-12">
                    <button onClick={backCv} disabled={cvStep === 0} className="...">
                        Back
                    </button>

                    {cvStep < cvSteps.length - 1 ? (
                        <button onClick={nextCv} className="px-8 py-3 bg-teal-600 text-white rounded-lg">
                        Next: {cvSteps[cvStep + 1].label}
                        </button>
                    ) : (
                        <button className="px-8 py-3 bg-green-600 text-white rounded-lg">
                        {cvUploadMode === 'existing' ? 'Analyze CVs' : 'Process Applications'}
                        </button>
                    )}
                </div>
            </div>

        )}
      </div>
    </div>
  );
}
