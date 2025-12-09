import React, { useState } from 'react';

export default function ApplicationInstructions() {
  const [selectedMethod, setSelectedMethod] = useState('cv');
  const [email, setEmail] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');

  const steps = [
    { id: 1, label: 'Post job', completed: true },
    { id: 2, label: 'CV Upload', completed: true },
    { id: 3, label: 'VeriTalent AI Card ID', completed: true },
    { id: 4, label: 'Application Instructions', completed: true },
    { id: 5, label: 'Preview & Publish', completed: false }
  ];

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <div className="">

        {/* Progress Stepper
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-teal-600' : 'bg-gray-300'
                  }`}>
                    {step.completed ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">{step.id}</span>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    steps[index + 1].completed ? 'bg-teal-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div> */}

        {/* Application Instructions Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Instructions</h2>
          
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-900">Choose how to Apply:</h3>

            {/* Apply via VeriTalent platform */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="applicationMethod"
                value="platform"
                checked={selectedMethod === 'platform'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mt-1 w-5 h-5 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-gray-700">Apply via VeriTalent platform (Internal submission)</span>
            </label>

            {/* Send your CV */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="applicationMethod"
                  value="cv"
                  checked={selectedMethod === 'cv'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-gray-700">Send your CV</span>
              </label>
              {selectedMethod === 'cv' && (
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-8 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>

            {/* Share your VeriTalent AI Card ID */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="applicationMethod"
                  value="aicard"
                  checked={selectedMethod === 'aicard'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">Share your VeriTalent AI Card ID</span>
              </label>
              {selectedMethod === 'aicard' && (
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="ml-8 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>

            {/* Custom instruction */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="applicationMethod"
                  value="custom"
                  checked={selectedMethod === 'custom'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-gray-700">Custom instruction</span>
              </label>
              {selectedMethod === 'custom' && (
                <textarea
                  placeholder=""
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  rows={4}
                  className="ml-8 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex items-center justify-between mt-8 max-w-3xl">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              Next: Preview & Publish
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}