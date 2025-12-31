"use client"
import React, { useState, useEffect } from 'react';
import StatsCards from '@/components/Dashboard/references/statsCard';
import ViewModeButtons from '@/components/Dashboard/references/viewModeButtons';
import RequestInboxView from '@/components/Dashboard/references/requestInboxView';
import IssuedRecordsView from '@/components/Dashboard/references/IssuedRecordsView';
import NewIssuanceView from '@/components/Dashboard/references/newIssuanceView';
import { ViewMode, FormData, Request, IssuedRecord } from '@/types/dashboard';
import { referencesService } from '@/lib/services/referencesService';
import RoleGuard from '@/components/guards/RoleGuard';

export default function VerifyIssueTrustedRecords() {
  const [activeView, setActiveView] = useState<ViewMode>('inbox');
  const [statsData, setStatsData] = useState([
    { label: 'Credentials Issued', value: 0 },
    { label: 'Pending Requests', value: 0 },
    { label: 'Revoked', value: 0 },
  ]);
  const [requestsData, setRequestsData] = useState<Request[]>([]);
  const [issuedRecordsData, setIssuedRecordsData] = useState<IssuedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myRefs, issued] = await Promise.all([
          referencesService.getMyReferences(),
          referencesService.getIssued()
        ]);
        // Assuming API returns arrays, map to component format
        setRequestsData(myRefs.map((ref: any) => ({
          talent: ref.talentName || 'Unknown',
          credentialType: ref.type,
          dateSubmitted: ref.dateSubmitted,
          status: ref.status
        })));
        setIssuedRecordsData(issued.map((ref: any) => ({
          talent: ref.talentName || 'Unknown',
          credentialType: ref.type,
          dateIssued: ref.dateIssued,
          status: ref.status,
          statusColor: ref.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        })));
        setStatsData([
          { label: 'Credentials Issued', value: issued.length },
          { label: 'Pending Requests', value: myRefs.filter((r: any) => r.status === 'pending').length },
          { label: 'Revoked', value: issued.filter((r: any) => r.status === 'revoked').length },
        ]);
      } catch (error) {
        console.error('Failed to fetch references:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleSubmit = async () => {
    try {
      await referencesService.issue({
        referenceId: 'some-id', // Need to get from form or selection
        status: 'verified',
        description: formData.responsibilities,
        skillsEndorsed: [] // Add from form
      });
      alert('Reference issued successfully!');
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to issue reference:', error);
      alert('Failed to issue reference.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-2 sm:p-6 lg:p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <RoleGuard allowedRoles={['org_admin']}>
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
    </RoleGuard>
  );
}