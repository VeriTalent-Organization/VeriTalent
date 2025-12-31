'use client';

// this component should pass all its data to is parent component

import React from 'react';
import { Calendar } from 'lucide-react';
import { Text } from '@/components/reuseables/text';
import FormComponent from '@/components/forms/form'; 

interface JobBasicsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onDataChange?: (data: Record<string, string>) => void;
}

const JobBasicsStep: React.FC<JobBasicsStepProps> = ({ onNext, onDataChange }) => {
  const handleSubmit = (data: Record<string, string>) => {
    console.log('[JobBasicsStep] Form submitted with data:', data);
    
    // Convert applicationDeadline to ISO 8601 if it exists
    const processedData = { ...data };
    if (processedData.applicationDeadline) {
      // If it's already a date string, convert to ISO
      const date = new Date(processedData.applicationDeadline);
      if (!isNaN(date.getTime())) {
        processedData.applicationDeadline = date.toISOString();
      } else {
        // If invalid, set to 7 days from now
        processedData.applicationDeadline = new Date(Date.now() + 7*24*60*60*1000).toISOString();
      }
    } else {
      // Default to 7 days from now if not provided
      processedData.applicationDeadline = new Date(Date.now() + 7*24*60*60*1000).toISOString();
    }
    
    console.log('[JobBasicsStep] Processed data with ISO date:', processedData);
    onDataChange?.(processedData);
    onNext?.();
  };

  const formFields = [
    { name: 'title', label: 'Job Title', placeholder: 'Job Title', type: 'text', row: 'row1', colSpan: 6 },
    { name: 'companyName', label: 'Company Name', placeholder: 'Company Name', type: 'text', row: 'row1', colSpan: 6 },
    { name: 'employmentType', label: 'Employment Type', placeholder: 'Full Time', type: 'text', row: 'row2', colSpan: 6,
      dropdown: { options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'], defaultValue: 'Full Time' } 
    },
    { name: 'location', label: 'Location', placeholder: 'Location', type: 'text', row: 'row2', colSpan: 6,
      dropdown: { options: ['Remote', 'Lagos, Nigeria', 'Abuja, Nigeria', 'Port Harcourt, Nigeria', 'Hybrid'], defaultValue: 'Remote' } 
    },
    { name: 'otherInfo', label: 'Other Info (Optional)', placeholder: 'Additional info', type: 'textarea', rows: 4, colSpan: 12 },
    { name: 'applicationDeadline', label: 'Application Deadline', placeholder: '', type: 'date', colSpan: 6,
      icons: [
        { icon: <Calendar className="w-5 h-5 text-gray-400" />, position: 'inline-end' as const, type: 'icon' as const },
      ],
    },
  ];

  return (
    <div className="bg-white p-1 lg:p-8 rounded-b-lg space-y-8">
      <Text variant="SubHeadings" as="h2" className="text-2xl mb-6" color="#111827">
        Job Basics
      </Text>

      <FormComponent
        fields={formFields}
        submitFunction={handleSubmit}
        showSubmitButton={true}
        submitButtonText="Next: Job Description"
        submitButtonPosition="right"
        submitButtonStyle="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
      />
    </div>
  );
};

export default JobBasicsStep;
