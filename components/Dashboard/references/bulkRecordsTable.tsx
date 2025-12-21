import React from 'react';
import { BulkRecord } from '@/types/dashboard';

interface BulkRecordsTableProps {
  bulkRecords: BulkRecord[];
  isMobile?: boolean;
}

export default function BulkRecordsTable({ bulkRecords, isMobile = false }: BulkRecordsTableProps) {
  if (isMobile) {
    return (
      <div className="p-3 space-y-3">
        {bulkRecords.map((record, index) => (
          <div key={index} className="bg-gray-50 rounded p-3 space-y-2">
            <div className="flex items-start justify-between">
              <p className="font-medium text-gray-900 text-sm">{record.talent}</p>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                {record.status}
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>{record.credentialType}</p>
              <p>{record.dateIssued}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Talents</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Credential Type</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Date Issued</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
        </tr>
      </thead>
      <tbody>
        {bulkRecords.map((record, index) => (
          <tr key={index} className="border-b border-gray-100 last:border-0">
            <td className="py-3 px-4 text-sm text-gray-600">{record.talent}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{record.credentialType}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{record.dateIssued}</td>
            <td className="py-3 px-4">
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}