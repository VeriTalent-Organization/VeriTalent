"use client";

import React from 'react';
import { FormData } from '@/types/dashboard';

interface AcknowledgementReferenceFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function AcknowledgementReferenceForm({
  formData,
  onFormChange,
  onSubmit
}: AcknowledgementReferenceFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-900 mb-2">Acknowledgement Reference</h3>
        <p className="text-sm text-orange-800">
          Provide a general acknowledgement of association or interaction with the talent.
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
            Relationship Context *
          </label>
          <input
            type="text"
            value={formData.roleDepartment}
            onChange={(e) => onFormChange('roleDepartment', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="e.g., Conference Attendee, Workshop Participant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Association Type
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => onFormChange('employmentType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select association type</option>
            <option value="professional">Professional Association</option>
            <option value="academic">Academic Association</option>
            <option value="community">Community Association</option>
            <option value="personal">Personal Acquaintance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Association Period
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
              placeholder="End date"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acknowledgement Type
          </label>
          <select
            value={formData.onsite}
            onChange={(e) => onFormChange('onsite', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Select acknowledgement type</option>
            <option value="positive">Positive Association</option>
            <option value="neutral">Neutral Association</option>
            <option value="limited">Limited Association</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Acknowledgement Details *
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFormChange('responsibilities', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Provide details about your association with this talent, including any notable interactions, observations, or context..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
        >
          Issue Acknowledgement Reference
        </button>
      </div>
    </div>
  );
}