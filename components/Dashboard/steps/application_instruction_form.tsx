'use client'
import React, { useState } from 'react';
import { Text } from '@/components/reuseables/text';
import FormComponent from '@/components/forms/form'; // Adjust path as needed

interface ApplicationInstructionsProps {
  onNext?: () => void;
  onDataChange?: (data: Record<string, string | boolean>) => void;
}

export default function ApplicationInstructions({ onNext, onDataChange }: ApplicationInstructionsProps) {
  const [selectedMethod, setSelectedMethod] = useState('platform');

  const handleSubmit = (data: Record<string, string>) => {
    const fullData = {
      applicationMethod: selectedMethod,
      ...data
    };
    console.log('Application Instructions data:', fullData);
    onDataChange?.(fullData);
    onNext?.();
  };

  // Define conditional fields based on selected method
  const getFormFields = () => {
    const baseFields = [];

    if (selectedMethod === 'cv') {
      baseFields.push({
        name: 'cvEmail',
        label: 'Email Address',
        placeholder: 'Enter Email Address',
        type: 'email',
        colSpan: 12,
      });
    }

    if (selectedMethod === 'aicard') {
      baseFields.push({
        name: 'aicardEmail',
        label: 'Email Address',
        placeholder: 'Enter Email Address',
        type: 'email',
        colSpan: 12,
      });
    }

    if (selectedMethod === 'custom') {
      baseFields.push({
        name: 'customInstruction',
        label: 'Custom Instructions',
        placeholder: 'Enter your custom application instructions...',
        type: 'textarea',
        rows: 4,
        colSpan: 12,
      });
    }

    return baseFields;
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-2 lg:p-8">
          <Text variant="SubHeadings" as="h2" className="mb-6" color="#111827">
            Application Instructions
          </Text>
          
          <div className="space-y-6">
            <Text variant="RegularText" as="h3" className="mb-4" color="#111827">
              Choose how to Apply:
            </Text>

            {/* Apply via VeriTalent platform */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="applicationMethod"
                value="platform"
                checked={selectedMethod === 'platform'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
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
                  className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-gray-700">Share your VeriTalent AI Card ID</span>
              </label>
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
            </div>

            {/* Conditional Form Fields */}
            {selectedMethod !== 'platform' && (
              <div className="lg:ml-8 max-w-md">
                <FormComponent
                  fields={getFormFields()}
                  submitButtonText="Next: Preview & Publish"
                  submitButtonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6"
                  submitButtonPosition="right"
                  showSubmitButton={true}
                  submitFunction={handleSubmit}
                />
              </div>
            )}

            {/* Show submit button for platform method */}
            {selectedMethod === 'platform' && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handleSubmit({})}
                  className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700"
                >
                  Next: Preview & Publish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}