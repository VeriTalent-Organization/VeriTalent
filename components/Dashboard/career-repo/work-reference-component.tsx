import React, { useState } from 'react';
import { Search } from 'lucide-react';
import WorkReferenceModal from './work-reference-modal';
import { iso } from 'zod';

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
  const [formData, setFormData] = useState<WorkReferenceData>({
    issuerSearch: '',
    issuerOption: 'search',
    organisationName: '',
    location: '',
    contactName: '',
    designation: '',
    email: '',
    phoneNumber: '',
    talentName: '',
    currentRole: '',
    employmentType1: 'Onsite',
    employmentType2: 'Internship',
    employmentStart: '',
    employmentEnd: '',
    responsibilities: ''
  });

  
    

  const handleInputChange = (field: keyof WorkReferenceData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = () => {
  //   if (
  //     onSubmit(formData);
  //   }
  // };
 

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Reference</h2>

      {/* Issuer Search */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Issuer</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={formData.issuerOption === 'search'}
              onChange={() => handleInputChange('issuerOption', 'search')}
              className="w-4 h-4 text-brand-primary"
            />
            <span className="text-sm text-gray-700">Search and select</span>
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Issuer"
              value={formData.issuerSearch}
              onChange={(e) => handleInputChange('issuerSearch', e.target.value)}
              disabled={formData.issuerOption !== 'search'}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={formData.issuerOption === 'not-found'}
              onChange={() => handleInputChange('issuerOption', 'not-found')}
              className="w-4 h-4 text-brand-primary"
            />
            <span className="text-sm text-gray-700">Not found</span>
          </label>
        </div>
      </div>

      {/* Organization Details */}
      <div className="bg-gray-50 rounded-lg p-2 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name of Organisation
            </label>
            <input
              type="text"
              value={formData.organisationName}
              onChange={(e) => handleInputChange('organisationName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>

        <div className="grid grid-col-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Official Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>
      </div>

      {/* Talent Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Talent Name
          </label>
          <input
            type="text"
            value={formData.talentName}
            onChange={(e) => handleInputChange('talentName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Current / Last Role & Department
          </label>
          <input
            type="text"
            value={formData.currentRole}
            onChange={(e) => handleInputChange('currentRole', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Employment Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Employment Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            value={formData.employmentType1}
            onChange={(e) => handleInputChange('employmentType1', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700"
          >
            <option>Onsite</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
          <select
            value={formData.employmentType2}
            onChange={(e) => handleInputChange('employmentType2', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700"
          >
            <option>Internship</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
        </div>
      </div>

      {/* Employment Period */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Employment Period(Start)
          </label>
          <input
            type="date"
            value={formData.employmentStart}
            onChange={(e) => handleInputChange('employmentStart', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Employment Period(End)
          </label>
          <input
            type="date"
            value={formData.employmentEnd}
            onChange={(e) => handleInputChange('employmentEnd', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Responsibilities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Responsibilities & Accomplishments
        </label>
        <div className="relative">
          <textarea
            value={formData.responsibilities}
            onChange={(e) => handleInputChange('responsibilities', e.target.value)}
            maxLength={400}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {formData.responsibilities.length}/400
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Subject to the Issuer Review</p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
        <button
          
          className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
        >
          Submit for Reference
        </button>
        
      </div>
      {/* {isOpen && <WorkReferenceModal/>} */}
      {/* <WorkReferenceModal/> */}
    </div>
  );
}

// Example usage:
/*
import WorkReferenceComponent from './WorkReferenceComponent';

function ParentComponent() {
  const handleSubmit = (data) => {
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