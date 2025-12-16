import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FormComponent from '@/components/forms/form';

interface WorkReferenceProps {
  onSubmit?: (data: WorkReferenceData) => void;
  onCancel?: () => void;
}

interface WorkReferenceData {
  issuerSearch: string;
  issuerOption: 'search' | 'not-found';
  organisationName: string;
  location: string;
  contactName: string;
  designation: string;
  email: string;
  phoneNumber: string;
  talentName: string;
  currentRole: string;
  employmentType1: string;
  employmentType2: string;
  employmentStart: string;
  employmentEnd: string;
  responsibilities: string;
}

export default function WorkReferenceComponent({ onSubmit, onCancel }: WorkReferenceProps) {
  const [issuerOption, setIssuerOption] = useState<'search' | 'not-found'>('search');
  const [issuerSearch, setIssuerSearch] = useState('');

  const formFields = [
    // Organization Details Section
    {
      name: 'organisationName',
      label: 'Name of Organisation',
      placeholder: 'Enter organisation name',
      row: 'org-row-1',
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'Enter location',
      row: 'org-row-1',
    },
    {
      name: 'contactName',
      label: 'Official Contact Name',
      placeholder: 'Enter contact name',
      row: 'org-row-2',
    },
    {
      name: 'designation',
      label: 'Designation',
      placeholder: 'Enter designation',
      row: 'org-row-2',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter email address',
      type: 'email',
      row: 'contact-row',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      placeholder: 'Enter phone number',
      type: 'tel',
      row: 'contact-row',
    },
    // Talent Details Section
    {
      name: 'talentName',
      label: 'Talent Name',
      placeholder: 'Enter talent name',
      row: 'talent-row',
    },
    {
      name: 'currentRole',
      label: 'Current / Last Role & Department',
      placeholder: 'Enter role and department',
      row: 'talent-row',
    },
    // Employment Type Section
    {
      name: 'employmentType1',
      label: 'Employment Type',
      row: 'employment-type-row',
      dropdown: {
        options: ['Onsite', 'Remote', 'Hybrid'],
        defaultValue: 'Onsite',
      },
    },
    {
      name: 'employmentType2',
      label: 'Employment Category',
      row: 'employment-type-row',
      dropdown: {
        options: ['Internship', 'Full-time', 'Part-time', 'Contract'],
        defaultValue: 'Internship',
      },
    },
    // Employment Period Section
    {
      name: 'employmentStart',
      label: 'Employment Period (Start)',
      type: 'date',
      row: 'employment-period-row',
    },
    {
      name: 'employmentEnd',
      label: 'Employment Period (End)',
      type: 'date',
      row: 'employment-period-row',
    },
    // Responsibilities Section
    {
      name: 'responsibilities',
      label: 'Responsibilities & Accomplishments',
      placeholder: 'Enter responsibilities and accomplishments (max 400 characters)',
      description: 'Subject to the Issuer Review',
      type: 'textarea',
      rows: 6,
      maxLength: 400,
    },
  ];

  const handleFormSubmit = (data: Record<string, string>) => {
    const fullData: WorkReferenceData = {
      ...data,
      issuerOption,
      issuerSearch,
    } as WorkReferenceData;
    
    onSubmit?.(fullData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Reference</h2>

      {/* Issuer Search Section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Issuer</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={issuerOption === 'search'}
              onChange={() => setIssuerOption('search')}
              className="w-4 h-4 text-cyan-600"
            />
            <span className="text-sm text-gray-700">Search and select</span>
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Issuer"
              value={issuerSearch}
              onChange={(e) => setIssuerSearch(e.target.value)}
              disabled={issuerOption !== 'search'}
              className="w-[40%] pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={issuerOption === 'not-found'}
              onChange={() => setIssuerOption('not-found')}
              className="w-4 h-4 text-cyan-600"
            />
            <span className="text-sm text-gray-700">Not found</span>
          </label>
        </div>
      </div>

      {/* Organization Details - Gray Background */}
      <div className="bg-gray-50 rounded-lg p-2 md:p-6 mb-6">
        <FormComponent
          fields={formFields.slice(0, 6)}
          showSubmitButton={false}
          submitFunction={() => {}}
        />
      </div>

      {/* Talent Details & Employment Info */}
      <FormComponent
        fields={formFields.slice(6)}
        submitButtonText="Submit for Reference"
        submitButtonPosition="right"
        submitButtonStyle="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
        submitFunction={handleFormSubmit}
      />
    </div>
  );
}

// Example usage:
/*
import WorkReferenceComponent from './WorkReferenceComponent';

function ParentComponent() {
  const handleSubmit = (data: WorkReferenceData) => {
    console.log('Work reference data:', data);
    // Handle submission
  };

  const handleCancel = () => {
    console.log('Cancelled');
    // Handle cancellation
  };

  return (
    <WorkReferenceComponent 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
*/