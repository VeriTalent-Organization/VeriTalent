"use client"
import React, { useState } from 'react';
import { Monitor, Inbox, FileText, ChevronDown, Download } from 'lucide-react';

export default function VerifyIssueTrustedRecords() {
  const [employmentType, setEmploymentType] = useState('');
  const [onsite, setOnsite] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [activeView, setActiveView] = useState('new');
  const [activeTab, setActiveTab] = useState('work');
  const [issuer, setIssuer] = useState('');
  const [talentName, setTalentName] = useState('');
  const [talentEmail, setTalentEmail] = useState('');
  const [roleDepartment, setRoleDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedBulk, setExpandedBulk] = useState<number | null>(null);

  const requests = [
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

  const issuedRecords = [
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

  const handleSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Verify & Issue Trusted Career Records
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Credentials Issued</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">4</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">2</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Revoked</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => setActiveView('new')}
            className={`font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base ${
              activeView === 'new'
                ? 'bg-brand-primary text-white'
                : 'bg-white hover:bg-gray-50 text-brand-primary border-2 border-brand-primary'
            }`}
          >
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            New Issuance
          </button>
          <button 
            onClick={() => setActiveView('inbox')}
            className={`font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base ${
              activeView === 'inbox'
                ? 'bg-brand-primary text-white'
                : 'bg-white hover:bg-gray-50 text-brand-primary border-2 border-brand-primary'
            }`}
          >
            <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
            Request Inbox
          </button>
          <button 
            onClick={() => setActiveView('issued')}
            className={`font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base ${
              activeView === 'issued'
                ? 'bg-brand-primary text-white'
                : 'bg-white hover:bg-gray-50 text-brand-primary border-2 border-brand-primary'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Issued Records
          </button>
        </div>

        {/* Request Inbox View */}
        {activeView === 'inbox' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Request Inbox</h2>
            
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
                    <button className="text-brand-primary hover:text-cyan-700 font-medium">
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
                        <button className="text-brand-primary hover:text-cyan-700 font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Issued Records View */}
        {activeView === 'issued' && (
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
              {issuedRecords.map((record, index) => (
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
                        <button className="text-brand-primary hover:text-cyan-700 font-medium">
                          View
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Bulk Records - Mobile */}
                  {record.isBulk && expandedBulk === index && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm">Credentials.csv</h3>
                        <button className="text-brand-primary hover:text-cyan-700 font-medium text-sm">
                          Update
                        </button>
                      </div>
                      <div className="p-3 space-y-3">
                        {record.bulkRecords?.map((bulkRecord, bulkIndex) => (
                          <div key={bulkIndex} className="bg-gray-50 rounded p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-gray-900 text-sm">{bulkRecord.talent}</p>
                              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                                {bulkRecord.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>{bulkRecord.credentialType}</p>
                              <p>{bulkRecord.dateIssued}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
                  {issuedRecords.map((record, index) => (
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
                            <button className="text-brand-primary hover:text-cyan-700 font-medium">
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                      
                      {/* Expanded Bulk Records - Desktop */}
                      {record.isBulk && expandedBulk === index && (
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
                                    {record.bulkRecords?.map((bulkRecord, bulkIndex) => (
                                      <tr key={bulkIndex} className="border-b border-gray-100 last:border-0">
                                        <td className="py-3 px-4 text-sm text-gray-600">{bulkRecord.talent}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{bulkRecord.credentialType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{bulkRecord.dateIssued}</td>
                                        <td className="py-3 px-4">
                                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {bulkRecord.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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
        )}

        {/* New Issuance View */}
        {activeView === 'new' && (
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

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Issuer
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Talent Name
                  </label>
                  <input
                    type="text"
                    value={talentName}
                    onChange={(e) => setTalentName(e.target.value)}
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
                    value={talentEmail}
                    onChange={(e) => setTalentEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Current/Last Role & Department
                  </label>
                  <input
                    type="text"
                    value={roleDepartment}
                    onChange={(e) => setRoleDepartment(e.target.value)}
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
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
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
                      value={onsite}
                      onChange={(e) => setOnsite(e.target.value)}
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Employment Period(End)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Responsibilities & Accomplishments
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  rows={6}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none outline-none"
                  placeholder=""
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {responsibilities.length}/500
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition"
                >
                  Submit for Reference
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}