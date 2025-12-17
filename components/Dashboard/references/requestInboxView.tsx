import React, { useState } from 'react';
import WorkReferenceModal from '@/components/Dashboard/career-repo/work-reference-modal';
import { Request } from '@/types/dashboard';
import CertificateVerificationModal from '../career-repo/certificate-verification modal';

interface RequestInboxViewProps {
  requests: Request[];
  viewMode?: "organization" | "talent";
}

export default function RequestInboxView({ 
  requests, 
  viewMode = "organization" 
}: RequestInboxViewProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleViewClick = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  // Render the appropriate modal based on credential type
  const renderModal = () => {
    if (!selectedRequest) return null;

    if (selectedRequest.credentialType === 'Work Reference') {
      return (
        <WorkReferenceModal 
          onClose={handleCloseModal}
          viewMode={viewMode}
          requestData={selectedRequest}
        />
      );
    } else {
      return (
        <CertificateVerificationModal
          onClose={handleCloseModal}
          viewMode={viewMode}
          requestData={selectedRequest}
        />
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Request Inbox
        </h2>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{request.talent}</p>
                  <p className="text-sm text-gray-600">{request.credentialType}</p>
                </div>
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                  {request.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{request.dateSubmitted}</span>
                <button 
                  onClick={() => handleViewClick(request)}
                  className="text-brand-primary hover:text-cyan-700 font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Talents</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Credential Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Date Submitted</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-600">{request.talent}</td>
                  <td className="py-4 px-4 text-gray-600">{request.credentialType}</td>
                  <td className="py-4 px-4 text-gray-600">{request.dateSubmitted}</td>
                  <td className="py-4 px-4">
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleViewClick(request)}
                      className="text-brand-primary hover:text-cyan-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal */}
      {renderModal()}
    </>
  );
}