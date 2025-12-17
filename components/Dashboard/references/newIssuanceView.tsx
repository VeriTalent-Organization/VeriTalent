import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import WorkReferenceForm from './workReferenceForm';
import { FormData, TabType } from '@/types/dashboard';

interface NewIssuanceViewProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function NewIssuanceView({ formData, onFormChange, onSubmit }: NewIssuanceViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('work');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">New Issuance</h2>
        <div className="text-left sm:text-right">
          <button className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-lg transition">
            Bulk Issuance
          </button>
          <p className="text-xs text-brand-primary mt-1">Bulk issuance or CSV upload</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('work')}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap ${
            activeTab === 'work'
              ? 'bg-white text-brand-primary border-2 border-brand-primary'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Work Reference
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition flex items-center gap-1 text-sm whitespace-nowrap ${
            activeTab === 'other'
              ? 'bg-white text-brand-primary border-2 border-brand-primary'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Other References
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'work' && (
        <WorkReferenceForm
          formData={formData}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
        />
      )}

      {activeTab === 'other' && (
        <div className="text-center py-12 text-gray-500">
          Other references form coming soon...
        </div>
      )}
    </div>
  );
}