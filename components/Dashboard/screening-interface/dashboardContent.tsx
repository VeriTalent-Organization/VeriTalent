import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface JobData {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicationsReceived: number;
  noInterviewed: number;
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('shortlist');
  const [jobId, setJobId] = useState('');
  const [jobData, setJobData] = useState<JobData | null>(null);

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
    // Simulate fetching job data
    setJobData(sampleJobData);
    setJobId(sampleJobData.jobId);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Job ID Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Job ID
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={handleFetchResult}
              className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
            >
              Fetch Result
            </button>
          </div>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job ID</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
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
              <span className="text-2xl font-bold text-gray-900">
                {jobData ? jobData.applicationsReceived : '245'}
              </span>
            </div>
            {jobData && activeTab === 'post-interview' && (
              <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">No. Interviewed</span>
                <span className="text-2xl font-bold text-gray-900">{jobData.noInterviewed}</span>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('shortlist')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'shortlist'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => setActiveTab('post-interview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'post-interview'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Post-interview Review
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="relative">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[140px]">
                  Sort by
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[160px]">
                  Filter by Status
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              {activeTab === 'shortlist' && (
                <button className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium text-sm">
                  Bulk Actions
                </button>
              )}
            </div>
          </div>

          {/* Table - Shortlist View */}
          {activeTab === 'shortlist' && (
            <div className="overflow-x-auto">
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
                        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
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
          )}

          {/* Table - Post-interview Review */}
          {activeTab === 'post-interview' && (
            <div className="overflow-x-auto">
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
                        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
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
          )}
        </div>
      </div>
    </div>
  );
}