import React, { useState } from 'react';

export interface AppInstructionsData {
  method: 'platform' | 'email' | 'ai-card' | 'custom';
  email: string;
  aiCardEmail: string;
  customInstruction: string;
}

interface AppInstructionsProps {
  data: AppInstructionsData;
  onChange: (data: AppInstructionsData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ApplicationInstructions({ data, onChange, onNext, onBack }: AppInstructionsProps) {

  const handleMethodChange = (method: AppInstructionsData['method']) => {
    onChange({ ...data, method });
  };

  const handleFieldChange = (field: keyof AppInstructionsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="min-h-[500px] flex flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Application Instructions</h2>

        <div className="border border-gray-200 rounded-xl p-6 sm:p-8 bg-white">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Choose how to Apply:</h3>

          <div className="space-y-6">

            {/* Option 1: Platform */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="platform"
                  name="apply-method"
                  type="radio"
                  checked={data.method === 'platform'}
                  onChange={() => handleMethodChange('platform')}
                  className="w-5 h-5 border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="platform" className="font-medium text-gray-700 cursor-pointer">
                  Apply via VeriTalent platform (Internal submission)
                </label>
              </div>
            </div>

            {/* Option 2: Email */}
            <div>
              <div className="flex items-start mb-3">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="apply-method"
                    type="radio"
                    checked={data.method === 'email'}
                    onChange={() => handleMethodChange('email')}
                    className="w-5 h-5 border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700 cursor-pointer">
                    Send your CV
                  </label>
                </div>
              </div>
              {data.method === 'email' && (
                <div className="ml-8 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={data.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 bg-gray-50"
                  />
                </div>
              )}
            </div>

            {/* Option 3: AI Card */}
            <div>
              <div className="flex items-start mb-3">
                <div className="flex items-center h-5">
                  <input
                    id="ai-card"
                    name="apply-method"
                    type="radio"
                    checked={data.method === 'ai-card'}
                    onChange={() => handleMethodChange('ai-card')}
                    className="w-5 h-5 border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="ai-card" className="font-medium text-gray-700 cursor-pointer">
                    Share your VeriTalent AI Card ID
                  </label>
                </div>
              </div>
              {data.method === 'ai-card' && (
                <div className="ml-8 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={data.aiCardEmail}
                    onChange={(e) => handleFieldChange('aiCardEmail', e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 bg-gray-50"
                  />
                </div>
              )}
            </div>

            {/* Option 4: Custom */}
            <div>
              <div className="flex items-start mb-3">
                <div className="flex items-center h-5">
                  <input
                    id="custom"
                    name="apply-method"
                    type="radio"
                    checked={data.method === 'custom'}
                    onChange={() => handleMethodChange('custom')}
                    className="w-5 h-5 border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="custom" className="font-medium text-gray-700 cursor-pointer">
                    Custom instruction
                  </label>
                </div>
              </div>
              {data.method === 'custom' && (
                <div className="ml-8 animate-in fade-in slide-in-from-top-1">
                  <textarea
                    placeholder="Enter custom application instructions..."
                    rows={3}
                    value={data.customInstruction}
                    onChange={(e) => handleFieldChange('customInstruction', e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 bg-gray-50 resize-none"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
        <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer font-medium" onClick={onBack}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => alert("Draft Saved")}
            className="px-8 py-3 bg-white border border-teal-200 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition shadow-sm"
          >
            Save Draft
          </button>

          <button
            onClick={onNext}
            className="px-8 py-3 bg-teal-800 text-white rounded-lg font-medium hover:bg-teal-900 transition shadow-md"
          >
            Next: Preview & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
