import React, { useState, useEffect } from 'react';

export default function ReviewAndAnalyze({
  onNext,
  onBack,
  canBack = true,
}: {
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[500px] flex flex-col justify-between">
      {/* Header */}
      <div className="bg-white">

        {/* Review & Analyze Section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Analyze</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Job Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 border border-gray-100">
            {/* Number of CVs Uploaded */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700 font-medium">Number of CVs Uploaded</span>
              <span className="text-gray-900 font-bold">95</span>
            </div>

            {/* Screening Criteria */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Screening Criteria:</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-700">Culture</span>
                  <span className="text-gray-600 font-medium">20%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-700">Experience</span>
                  <span className="text-gray-600 font-medium">60%</span>
                </div>
              </div>
            </div>

            {/* Job Context Info */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Job Context Info:</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Job Title:</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-700 text-sm font-medium">Software Engineer</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Company Name:</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-700 text-sm font-medium">TechCorp</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Employment Type</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-700 text-sm font-medium">Full Time</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-700 text-sm font-medium">Fountain Hills, Arizona</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Job ID */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Generated Job ID:</h3>
              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">VT-1247</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100 min-h-[500px]">
            {/* Progress Circle */}
            <div className="relative w-48 h-48 mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#0D9488"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isComplete ? (
                  <span className="text-4xl text-teal-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </span>
                ) : (
                  <span className="text-lg font-bold text-gray-700">{progress}%</span>
                )}
              </div>
            </div>

            {/* Status Text */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center animate-in fade-in slide-in-from-bottom-2">
              {isComplete ? 'Analysis Complete!' : 'Analyzing 95 CVs...'}
            </h3>
            <p className="text-gray-500 text-center mb-8 max-w-xs mx-auto">
              Extracting skills, education, and culture alignment.
            </p>

            {/* Completion Status */}
            {isComplete && (
              <div className="space-y-4 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-gray-700 bg-teal-50 p-3 rounded-lg border border-teal-100">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Your Upload has processed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-teal-50 p-3 rounded-lg border border-teal-100">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Job ID VT-1247 generated</span>
                </div>
                <p className="text-gray-600 mt-4 text-center text-sm">You can now view candidate insights</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Footer */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        {/* Hide Back button if analysis is complete to encourage forward movement, or allow it but typical wizard flow locks in */}
        <button
          onClick={onBack}
          className={`px-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition ${isComplete ? 'invisible' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="flex gap-4">
          {isComplete && (
            <button
              onClick={() => alert("Template Saved!")}
              className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Save as Template
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!isComplete}
            className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {isComplete ? "Go to Screening results" : "Analyzing..."}
          </button>
        </div>
      </div>
    </div>
  );
}