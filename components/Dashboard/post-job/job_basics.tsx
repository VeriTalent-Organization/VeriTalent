import React, { useState } from 'react';

export interface JobBasicsData {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  additionalInfo: string;
  applicationDeadline: string;
}

interface JobBasicsProps {
  data: JobBasicsData;
  onChange: (data: JobBasicsData) => void;
  onNext: () => void;
  // If we want a 'Save Draft' functionality in parent, we might pass it here or handle it in the footer
}

export default function JobBasics({ data, onChange, onNext }: JobBasicsProps) {

  const handleChange = (field: keyof JobBasicsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="min-h-[500px] flex flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Job Basics</h2>

        {/* Row 1: Job ID (Title) & Company Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job ID</label>
            <input
              type="text"
              placeholder="Job Title"
              value={data.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={data.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Row 2: Employment Type & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Employment Type</label>
            <div className="relative">
              <select
                value={data.employmentType}
                onChange={(e) => handleChange("employmentType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-500 bg-white appearance-none cursor-pointer"
              >
                <option value="">Full Time</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
            <div className="relative">
              <select
                value={data.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-500 bg-white appearance-none cursor-pointer"
              >
                <option value="">Location</option>
                <option value="New York">New York</option>
                <option value="Remote">Remote</option>
                <option value="London">London</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Other Info */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Other Info (Optional)</label>
          <input
            type="text"
            placeholder="Additional info"
            value={data.additionalInfo}
            onChange={(e) => handleChange("additionalInfo", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 placeholder-gray-400 bg-white"
          />
        </div>

        {/* Row 4: Application Deadline */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Application Deadline</label>
          <div className="relative">
            <input
              type="date"
              value={data.applicationDeadline}
              onChange={(e) => handleChange("applicationDeadline", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-500 placeholder-gray-400 bg-white"
            />
            {/* Custom Calendar Icon override if needed, but native date picker usually suffices. 
                     The design shows a calendar icon on the right. 
                     Native inputs put it there or use a custom component. 
                     For now native is functional. */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
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
          Next: Job description
        </button>
      </div>
    </div>
  );
}
