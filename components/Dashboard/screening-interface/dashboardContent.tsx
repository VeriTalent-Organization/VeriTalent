"use client";
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface JobData {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicationsReceived: number;
  noInterviewed: number;
}

// Mock VeriTalent AI Card component
function VeriTalentAICard() {
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">VeriTalent AI Card</h2>
        <p className="text-gray-600">Candidate details would be displayed here...</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('shortlist');
  const [jobId, setJobId] = useState('');
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [viewMode, setViewMode] = useState<"dashboard" | "ai-card">("dashboard");

  // Sample data for when job is fetched
  const sampleJobData = {
    jobId: 'REQ-2025-SWE-001',
    jobTitle: 'Software Engineer',
    companyName: 'TechCorp',
    applicationsReceived: 245,
    noInterviewed: 30
  };

  const shortlistCandidates = [
    { name: 'Sam Sulek', fitScore: '60%' },
    { name: 'Pariola Ajayi', fitScore: '57%' },
    { name: 'Peace Olayemi', fitScore: '40%' }
  ];

  const postInterviewCandidates = [
    { name: 'Sam Sulek', fitScore: '60%', interviewRating: '72%' },
    { name: 'Pariola Ajayi', fitScore: '57%', interviewRating: '84%' },
    { name: 'Peace Olayemi', fitScore: '40%', interviewRating: '55%' }
  ];

  const handleFetchResult = () => {
    setJobData(sampleJobData);
    setJobId(sampleJobData.jobId);
  };

  if (viewMode === "ai-card") {
    return <VeriTalentAICard />;
  }

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Job ID Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Job ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Enter Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
            <button
              onClick={handleFetchResult}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Fetch Result
            </button>
          </div>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job ID</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Job Title</label>
              <div className="h-10 bg-gray-50 rounded border border-gray-200 flex items-center px-3">
                {jobData ? (
                  <span className="text-gray-700">{jobData.jobTitle}</span>
                ) : null}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company Name</label>
              <div className="h-10 bg-gray-50 rounded border border-gray-200 flex items-center px-3">
                {jobData ? (
                  <span className="text-gray-700">{jobData.companyName}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Applications Received</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {jobData ? jobData.applicationsReceived : '245'}
              </span>
            </div>
            {jobData && activeTab === 'post-interview' && (
              <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">No. Interviewed</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">{jobData.noInterviewed}</span>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('shortlist')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'shortlist'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => setActiveTab('post-interview')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'post-interview'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Post-interview Review
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between sm:justify-center gap-2 sm:min-w-[140px]">
                  Sort by
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-full sm:w-auto">
                <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between sm:justify-center gap-2 sm:min-w-40">
                  Filter by Status
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              {activeTab === 'shortlist' && (
                <button className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm">
                  Bulk Actions
                </button>
              )}
            </div>
          </div>

          {/* Mobile Card View - Shortlist */}
          {activeTab === 'shortlist' && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Applicant Names
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Fit Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        VeriTalent AI Card
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Select & Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortlistCandidates.map((candidate, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.fitScore}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-brand-primary hover:text-cyan-700 font-medium">
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Schedule Interview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {shortlistCandidates.map((candidate, index) => (
                  <div key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Fit Score: {candidate.fitScore}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-3 py-2 text-sm text-brand-primary border border-brand-primary rounded-lg hover:bg-cyan-50 font-medium">
                        View AI Card
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm text-white bg-brand-primary rounded-lg hover:bg-cyan-700 font-medium">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Mobile Card View - Post-interview */}
          {activeTab === 'post-interview' && (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Applicant Names
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Fit Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Interview Rating
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Interview Report
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        VeriTalent AI Card
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {postInterviewCandidates.map((candidate, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.fitScore}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.interviewRating}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Download
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setViewMode("ai-card")}
                            className="text-sm text-brand-primary hover:text-cyan-700 font-medium"
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {postInterviewCandidates.map((candidate, index) => (
                  <div key={index} className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Fit Score:</span>
                          <span className="ml-1 font-medium text-gray-900">{candidate.fitScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Interview:</span>
                          <span className="ml-1 font-medium text-gray-900">{candidate.interviewRating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                          Download Report
                        </button>
                        <button
                          onClick={() => setViewMode("ai-card")}
                          className="flex-1 px-3 py-2 text-sm text-brand-primary border border-brand-primary rounded-lg hover:bg-cyan-50 font-medium"
                        >
                          View AI Card
                        </button>
                      </div>
                      <button className="w-full px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium">
                        Reject Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}