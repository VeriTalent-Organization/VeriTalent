"use client";

import React from 'react';
import { FormData } from '@/types/dashboard';

interface StudentshipReferenceFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function StudentshipReferenceForm({
  formData,
  onFormChange,
  onSubmit
}: StudentshipReferenceFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Studentship Reference</h3>
        <p className="text-sm text-purple-800">
          Verify enrollment and academic performance at an educational institution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name *
          </label>
          <input
            type="text"
            value={formData.talentName}
            onChange={(e) => onFormChange('talentName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter student's full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Email *
          </label>
          <input
            type="email"
            value={formData.talentEmail}
            onChange={(e) => onFormChange('talentEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="student@university.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.roleDepartment}
            onChange={(e) => onFormChange('roleDepartment', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="e.g., University of Lagos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program/Degree *
          </label>
          <input
            type="text"
            value={formData.employmentType}
            onChange={(e) => onFormChange('employmentType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="e.g., Bachelor of Science in Computer Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollment Period
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => onFormChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              placeholder="Start date"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => onFormChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              placeholder="Expected graduation"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Status
          </label>
          <select
            value={formData.onsite}
            onChange={(e) => onFormChange('onsite', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select status</option>
            <option value="enrolled">Currently Enrolled</option>
            <option value="graduated">Graduated</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="suspended">Suspended</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Academic Performance & Achievements
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFormChange('responsibilities', e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Describe the student's academic performance, GPA, notable achievements, extracurricular activities, or special recognitions..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
        >
          Issue Studentship Reference
        </button>
      </div>
    </div>
  );
}