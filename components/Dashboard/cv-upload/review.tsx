import React, { useState, useEffect } from 'react';

export default function ReviewAndAnalyze() {
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">

        {/* Review & Analyze Section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Analyze</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Job Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Number of CVs Uploaded */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700 font-medium">Number of CVs Uploaded</span>
              <span className="text-gray-900 font-semibold">95</span>
            </div>

            {/* Screening Criteria */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Screening Criteria:</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-700">Culture</span>
                  <span className="text-gray-600">20%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-700">Experience</span>
                  <span className="text-gray-600">60%</span>
                </div>
              </div>
            </div>

            {/* Job Context Info */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Job Context Info:</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Job Title:</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-600 text-sm">Software Engineer</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Company Name:</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-600 text-sm">TechCorp</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Employment Type</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-600 text-sm">Full Time</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Location</p>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-gray-600 text-sm">Fountain Hills, Arizona</p>
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
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
            {/* Progress Circle */}
            <div className="relative w-48 h-48 mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#0D9488"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            {/* Status Text */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {isComplete ? 'Analysis Complete!' : 'Analyzing 95 CVs...'}
            </h3>
            <p className="text-gray-500 text-center mb-8">
              Extracting skills, education, and culture alignment.
            </p>

            {/* Completion Status */}
            {isComplete && (
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Your Upload has processed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Job ID VT-1247 generated</span>
                </div>
                <p className="text-gray-600 mt-4">You can now view candidate insights</p>
              </div>
            )}
          </div>
        </div>

    
      </div>
    </div>
  );
}