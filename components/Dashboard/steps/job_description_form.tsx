'use client'
import React from 'react';
import { Text } from '@/components/reuseables/text';
import FormComponent from '@/components/forms/form'; // Adjust path as needed

interface JobDescriptionFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function JobDescriptionForm({ onNext, onBack }: JobDescriptionFormProps) {
  const handleSubmit = (data: Record<string, string>) => {
    console.log('Job Description data:', data);
    onNext?.();
  };

  const formFields = [
    {
      name: 'aboutRole',
      label: 'About the Role',
      placeholder: 'Describe the role and responsibilities...',
      type: 'textarea',
      rows: 4,
      colSpan: 12,
    },
    {
      name: 'keyResponsibilities',
      label: 'Key Responsibilities',
      placeholder: 'Enter key responsibilities (one per line or separated by commas)...',
      type: 'textarea',
      rows: 6,
      colSpan: 6,
    },
    {
      name: 'requiredSkills',
      label: 'Required Skills',
      placeholder: 'Enter required skills (one per line or separated by commas)...',
      type: 'textarea',
      rows: 6,
      colSpan: 6,
      row: 'row2',
    },
    {
      name: 'additionalInfo',
      label: 'Add More Info (e.g Team context)',
      placeholder: 'Add any additional information about the team, work environment, etc...',
      type: 'textarea',
      rows: 4,
      colSpan: 12,
    },
  ];

  return (
    <div className="">
      <div className="">
        <div className="bg-white p-2 lg:p-8 rounded-b-lg">
          <Text variant="SubHeadings" as="h2" className="text-2xl mb-6" color="#111827">
            Job Description
          </Text>

          <FormComponent
            fields={formFields}
            submitButtonText="Next: Screening Criteria"
            submitButtonStyle="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
            submitButtonPosition="right"
            showSubmitButton={false}
            submitFunction={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}