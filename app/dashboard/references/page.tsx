"use client"
import React, { useState } from 'react';
import StatsCards from '@/components/Dashboard/references/statsCard';
import ViewModeButtons from '@/components/Dashboard/references/viewModeButtons';
import RequestInboxView from '@/components/Dashboard/references/requestInboxView';
import IssuedRecordsView from '@/components/Dashboard/references/IssuedRecordsView';
import NewIssuanceView from '@/components/Dashboard/references/newIssuanceView';
import { ViewMode, FormData, Request, IssuedRecord } from '@/types/dashboard';

const statsData = [
  { label: 'Credentials Issued', value: 4 },
  { label: 'Pending Requests', value: 2 },
  { label: 'Revoked', value: 1 },
];

const requestsData: Request[] = [
  {
    talent: 'Jane Doe',
    credentialType: 'Work Reference',
    dateSubmitted: 'Mar 2025',
    status: 'Pending'
  },
  {
    talent: 'John Ade',
    credentialType: 'Work Reference',
    dateSubmitted: 'Jan 2024',
    status: 'Pending'
  },
  {
    talent: 'Rose Obi',
    credentialType: 'Certificate Verification',
    dateSubmitted: 'Dec 2024',
    status: 'Pending'
  }
];

const issuedRecordsData: IssuedRecord[] = [
  {
    talent: 'Jane Doe',
    credentialType: 'Work Reference',
    dateIssued: 'Mar 2025',
    status: 'Verified Fully',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    talent: 'John Ade',
    credentialType: 'Affiliation Reference',
    dateIssued: 'Jan 2024',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    talent: 'Rose Obi',
    credentialType: 'Certificate Verification',
    dateIssued: 'Dec 2024',
    status: 'Verified Fully',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    talent: 'Credentials.csv',
    credentialType: 'Work Reference',
    dateIssued: 'Sept 2024',
    status: 'Bulk',
    statusColor: 'bg-indigo-100 text-indigo-700',
    isBulk: true,
    bulkRecords: [
      { talent: 'Sam Sulek', credentialType: 'Work Reference', dateIssued: 'Sept 2024', status: 'Verified Fully' },
      { talent: 'Pariola Ajayi', credentialType: 'Work Reference', dateIssued: 'Sept 2024', status: 'Verified Fully' },
      { talent: 'Peace Olayemi', credentialType: 'Work Reference', dateIssued: 'Sept 2024', status: 'Verified Fully' }
    ]
  },
  {
    talent: 'Rose Obi',
    credentialType: 'Performance Appraisal',
    dateIssued: 'Dec 2024',
    status: 'Verified Fully',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    talent: 'Kelvin Morris',
    credentialType: 'Digital Certificate',
    dateIssued: 'Jun 2025',
    status: 'Verified Fully',
    statusColor: 'bg-green-100 text-green-700'
  }
];

export default function VerifyIssueTrustedRecords() {
  const [activeView, setActiveView] = useState<ViewMode>('new');
  const [formData, setFormData] = useState<FormData>({
    issuer: '',
    talentName: '',
    talentEmail: '',
    roleDepartment: '',
    employmentType: '',
    onsite: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
  });

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Verify & Issue Trusted Career Records
        </h1>

        {/* Stats Cards */}
        <StatsCards stats={statsData} />

        {/* Action Buttons */}
        <ViewModeButtons activeView={activeView} onViewChange={setActiveView} />

        {/* Views */}
        {activeView === 'inbox' && <RequestInboxView requests={requestsData} />}
        {activeView === 'issued' && <IssuedRecordsView records={issuedRecordsData} />}
        {activeView === 'new' && (
          <NewIssuanceView
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}