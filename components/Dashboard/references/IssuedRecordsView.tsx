import React, { useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import BulkRecordsTable from './bulkRecordsTable';
import { IssuedRecord } from '@/types/dashboard';
import WorkReferenceModal from '@/components/Dashboard/career-repo/work-reference-modal';
import CertificateVerificationModal from '../career-repo/certificate-verification modal';

interface IssuedRecordsViewProps {
  records: IssuedRecord[];
  viewMode?: "organization" | "talent";
}

export default function IssuedRecordsView({ 
  records, 
  viewMode = "organization" 
}: IssuedRecordsViewProps) {
  const [expandedBulk, setExpandedBulk] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<IssuedRecord | null>(null);

  const handleViewClick = (record: IssuedRecord) => {
    setSelectedRecord(record);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  // Render the appropriate modal based on credential type
  const renderModal = () => {
    if (!selectedRecord) return null;

    switch (selectedRecord.credentialType) {
      case 'Work Reference':
        return (
          <WorkReferenceModal
            onClose={handleCloseModal}
            viewMode={viewMode}
            recordData={selectedRecord}
          />
        );

      case 'Certificate Verification':
        return (
          <CertificateVerificationModal
            onClose={handleCloseModal}
            viewMode={viewMode}
            recordData={selectedRecord}
          />
        );

      default:
        return null;
    }
  };


  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Issued Records</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none pr-10 text-gray-700 text-sm">
                <option>Filter by Status</option>
                <option>Verified Fully</option>
                <option>Active</option>
                <option>Bulk</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <button className="bg-brand-primary hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {records.map((record, index) => (
            <div key={index}>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{record.talent}</p>
                    <p className="text-sm text-gray-600">{record.credentialType}</p>
                  </div>
                  <span className={`inline-block ${record.statusColor} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2`}>
                    {record.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{record.dateIssued}</span>
                  {record.isBulk ? (
                    <button
                      onClick={() => setExpandedBulk(expandedBulk === index ? null : index)}
                      className="text-brand-primary hover:text-cyan-700 font-medium flex items-center gap-1"
                    >
                      {expandedBulk === index ? 'Hide' : 'View'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedBulk === index ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleViewClick(record)}
                      className="text-brand-primary hover:text-cyan-700 font-medium"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Bulk Records - Mobile */}
              {record.isBulk && expandedBulk === index && record.bulkRecords && (
                <div className="mt-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-sm">Credentials.csv</h3>
                    <button className="text-brand-primary hover:text-cyan-700 font-medium text-sm">
                      Update
                    </button>
                  </div>
                  <BulkRecordsTable bulkRecords={record.bulkRecords} isMobile={true} />
                </div>
              )}
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
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Date Issued</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-600">{record.talent}</td>
                    <td className="py-4 px-4 text-gray-600">{record.credentialType}</td>
                    <td className="py-4 px-4 text-gray-600">{record.dateIssued}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block ${record.statusColor} px-3 py-1 rounded-full text-xs font-medium`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {record.isBulk ? (
                        <button
                          onClick={() => setExpandedBulk(expandedBulk === index ? null : index)}
                          className="text-brand-primary hover:text-cyan-700 font-medium flex items-center gap-1"
                        >
                          {expandedBulk === index ? 'Hide' : 'View'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedBulk === index ? 'rotate-180' : ''}`} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleViewClick(record)}
                          className="text-brand-primary hover:text-cyan-700 font-medium"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Bulk Records - Desktop */}
                  {record.isBulk && expandedBulk === index && record.bulkRecords && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 p-0">
                        <div className="p-4">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b border-gray-200">
                              <h3 className="font-semibold text-gray-900">Credentials.csv</h3>
                              <button className="text-brand-primary hover:text-cyan-700 font-medium text-sm">
                                Update
                              </button>
                            </div>
                            <BulkRecordsTable bulkRecords={record.bulkRecords} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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