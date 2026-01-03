"use client";

import React from 'react';
import { FormData } from '@/types/dashboard';

interface MembershipReferenceFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function MembershipReferenceForm({
  formData,
  onFormChange,
  onSubmit
}: MembershipReferenceFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Membership Reference</h3>
        <p className="text-sm text-green-800">
          Verify membership in a professional organization, association, or community group.
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
            Organization Name *
          </label>
          <input
            type="text"
            value={formData.roleDepartment}
            onChange={(e) => onFormChange('roleDepartment', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="e.g., Nigerian Institute of Management"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Type
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => onFormChange('employmentType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select membership type</option>
            <option value="full">Full Member</option>
            <option value="associate">Associate Member</option>
            <option value="student">Student Member</option>
            <option value="fellow">Fellow</option>
            <option value="honorary">Honorary Member</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Period
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
              placeholder="End date (leave empty if current)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Status
          </label>
          <select
            value={formData.onsite}
            onChange={(e) => onFormChange('onsite', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Membership Details & Contributions
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFormChange('responsibilities', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Describe the member's contributions, roles held, committees served on, or notable achievements within the organization..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
        >
          Issue Membership Reference
        </button>
      </div>
    </div>
  );
}