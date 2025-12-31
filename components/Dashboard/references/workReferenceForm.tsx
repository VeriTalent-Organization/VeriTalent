import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FormData } from '@/types/dashboard';
import { Spinner } from '@/components/ui/spinner';

interface WorkReferenceFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function WorkReferenceForm({ formData, onFormChange, onSubmit, isSubmitting = false }: WorkReferenceFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Issuer
          </label>
          <input
            type="text"
            value={formData.issuer}
            onChange={(e) => onFormChange('issuer', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Talent Name
          </label>
          <input
            type="text"
            value={formData.talentName}
            onChange={(e) => onFormChange('talentName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Talent Email
          </label>
          <input
            type="email"
            value={formData.talentEmail}
            onChange={(e) => onFormChange('talentEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Current/Last Role & Department
          </label>
          <input
            type="text"
            value={formData.roleDepartment}
            onChange={(e) => onFormChange('roleDepartment', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Employment Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <select
              value={formData.employmentType}
              onChange={(e) => onFormChange('employmentType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-500 outline-none"
            >
              <option value="">Internship</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={formData.onsite}
              onChange={(e) => onFormChange('onsite', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-500 outline-none"
            >
              <option value="">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Employment Period(Start)
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onFormChange('startDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Employment Period(End)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => onFormChange('endDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Responsibilities & Accomplishments
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFormChange('responsibilities', e.target.value)}
          rows={6}
          maxLength={500}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none outline-none"
          placeholder=""
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {formData.responsibilities.length}/500
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Spinner className="text-white" />}
          Submit for Reference
        </button>
      </div>
    </div>
  );
}