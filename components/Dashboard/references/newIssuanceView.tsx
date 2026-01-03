import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import WorkReferenceForm from './workReferenceForm';
import PerformanceReferenceForm from './PerformanceReferenceForm';
import MembershipReferenceForm from './MembershipReferenceForm';
import StudentshipReferenceForm from './StudentshipReferenceForm';
import AcknowledgementReferenceForm from './AcknowledgementReferenceForm';
import { FormData, TabType } from '@/types/dashboard';

interface NewIssuanceViewProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export default function NewIssuanceView({ formData, onFormChange, onSubmit }: NewIssuanceViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('work');
  const [otherReferenceType, setOtherReferenceType] = useState<'performance' | 'membership' | 'studentship' | 'acknowledgement'>('performance');

  const renderOtherReferenceForm = () => {
    switch (otherReferenceType) {
      case 'performance':
        return <PerformanceReferenceForm formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />;
      case 'membership':
        return <MembershipReferenceForm formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />;
      case 'studentship':
        return <StudentshipReferenceForm formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />;
      case 'acknowledgement':
        return <AcknowledgementReferenceForm formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />;
      default:
        return <PerformanceReferenceForm formData={formData} onFormChange={onFormChange} onSubmit={onSubmit} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Direct Issuance</h2>
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
        <div className="relative">
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
          {activeTab === 'other' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <button
                onClick={() => setOtherReferenceType('performance')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  otherReferenceType === 'performance' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                Performance Reference
              </button>
              <button
                onClick={() => setOtherReferenceType('membership')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  otherReferenceType === 'membership' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                }`}
              >
                Membership Reference
              </button>
              <button
                onClick={() => setOtherReferenceType('studentship')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  otherReferenceType === 'studentship' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
              >
                Studentship Reference
              </button>
              <button
                onClick={() => setOtherReferenceType('acknowledgement')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  otherReferenceType === 'acknowledgement' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                }`}
              >
                Acknowledgement Reference
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'work' && (
        <WorkReferenceForm
          formData={formData}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
        />
      )}

      {activeTab === 'other' && renderOtherReferenceForm()}
    </div>
  );
}