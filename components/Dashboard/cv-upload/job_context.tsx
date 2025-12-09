import React, { useState } from 'react';

type CVUploadMode = 'existing' | 'create';

interface CVUploadJobContextProps {
  onModeSelect: (mode: CVUploadMode) => void;
  onContinue: () => void; // still needed to go to next step after form
}

export default function CVUploadJobContext({ onModeSelect, onContinue }: CVUploadJobContextProps) {
  const [selectedOption, setSelectedOption] = useState<CVUploadMode | null>(null);

  // Fields for Create Job Context
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const [seniority, setSeniority] = useState('');
  const [roleOverview, setRoleOverview] = useState('');

  const handleModeSelect = (mode: CVUploadMode) => {
    setSelectedOption(mode);
    onModeSelect(mode); // This tells parent: "user chose this path"
  };

  const handleContinue = () => {
    // validate + save context
    onContinue(); // proceed to Bulk Upload
  };

//   const handleContinue = () => {
//     const payload = {
//       jobTitle,
//       companyName,
//       department,
//       employmentType,
//       location,
//       seniority,
//       roleOverview,
//     };

//     console.log("Job Context:", payload);
//   };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Job Context
        </h2>

        {/* Option Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Existing Job Post */}
          <div
            className={`bg-white rounded-lg p-6 border-2 cursor-pointer transition-all ${
              selectedOption === 'existing'
                ? 'border-teal-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleModeSelect('existing')}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === 'existing'
                    ? 'bg-teal-600'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {selectedOption === 'existing' && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Link to Existing Job Post
                </h3>
                {selectedOption === 'existing' && (
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-500 bg-white">
                    <option>Choose from your existing job posts</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* CREATE JOB CONTEXT */}
          <div
            className={`bg-white rounded-lg p-6 border-2 cursor-pointer transition-all ${
              selectedOption === 'create'
                ? 'border-teal-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleModeSelect('create')}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === 'create'
                    ? 'bg-teal-600'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {selectedOption === 'create' && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create Job Context
              </h3>
            </div>
          </div>
        </div>

        {/* FORM FIELDS SHOW ONLY WHEN CREATE IS SELECTED */}
        {selectedOption === 'create' && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="TechCorp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-500 bg-white"
                >
                  <option value="">Full Time</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Fountain Hills, Arizona"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Role Overview</label>
              <textarea
                placeholder="Role Overview"
                value={roleOverview}
                onChange={(e) => setRoleOverview(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-400 placeholder-gray-400 resize-none"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}