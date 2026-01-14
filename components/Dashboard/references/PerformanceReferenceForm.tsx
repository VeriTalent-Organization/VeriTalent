"use client";

import React from 'react';
import { FormData } from '@/types/dashboard';

interface PerformanceReferenceFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function PerformanceReferenceForm({
  formData,
  onFormChange,
  onSubmit
}: PerformanceReferenceFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Performance Reference</h3>
        <p className="text-sm text-blue-800">
          Issue a reference based on the talent's performance in a specific project, task, or role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Talent Name *
          </label>
          <input
            type="text"
            value={formData.talentName}
            onChange={(e) => onFormChange('talentName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter talent's full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Talent Email *
          </label>
          <input
            type="email"
            value={formData.talentEmail}
            onChange={(e) => onFormChange('talentEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="talent@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project/Task Name *
          </label>
          <input
            type="text"
            value={formData.roleDepartment}
            onChange={(e) => onFormChange('roleDepartment', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="e.g., E-commerce Platform Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Period
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => onFormChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => onFormChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Performance Description *
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFormChange('responsibilities', e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Describe the talent's performance, achievements, skills demonstrated, and overall contribution to the project/task..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
        >
          Issue Performance Reference
        </button>
      </div>
    </div>
  );
}