"use client";
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { jobsService } from '@/lib/services/jobsService';
import { screeningService } from '@/lib/services/screeningService';
import SchedulingModal from './schedulingModal';
import CandidateSelectionModal from './candidateSelectionModal';
import BulkInterviewScheduleCompact from './bulkInterviewScheduleModal';
import ApplicantAICardView from './ApplicantAICardView';
import EvaluationNotesModal from './EvaluationNotesModal';

interface JobData {
  id: string;
  title: string;
  description?: string;
  location?: string;
  applicationsReceived?: number;
  noInterviewed?: number;
  // Add other fields as needed
}

type ShortlistCandidate = { id: string; name: string; fitScore: number; status?: 'shortlisted' | 'scheduled' | 'rejected' };
type PostInterviewCandidate = { id: string; name: string; fitScore: number; interviewRating: number; status?: 'pending' | 'rejected' };

type PendingAction = {
  type: 'schedule' | 'reject' | 'bulk' | 'download';
  candidateId?: string;
  candidateName?: string;
  list: 'shortlist' | 'post' | 'bulk';
};

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState('shortlist');
  const [jobId, setJobId] = useState('');
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [viewMode, setViewMode] = useState<"dashboard" | "ai-card">("dashboard");
  const [selectedApplicant, setSelectedApplicant] = useState<{id: string, name: string, veritalentId?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'fit-desc' | 'name-asc'>('fit-desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);
  const [createdSession, setCreatedSession] = useState<any | null>(null);
  const [sessionDetail, setSessionDetail] = useState<any | null>(null);
  const [shortlistCandidates, setShortlistCandidates] = useState<ShortlistCandidate[]>([
    { id: '1', name: 'Sam Sulek', fitScore: 60, status: 'shortlisted' },
    { id: '2', name: 'Pariola Ajayi', fitScore: 57, status: 'shortlisted' },
    { id: '3', name: 'Peace Olayemi', fitScore: 40, status: 'shortlisted' }
  ]);
  const [postInterviewCandidates, setPostInterviewCandidates] = useState<PostInterviewCandidate[]>([
    { id: '1', name: 'Sam Sulek', fitScore: 60, interviewRating: 72, status: 'pending' },
    { id: '2', name: 'Pariola Ajayi', fitScore: 57, interviewRating: 84, status: 'pending' },
    { id: '3', name: 'Peace Olayemi', fitScore: 40, interviewRating: 55, status: 'pending' }
  ]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showCandidateSelection, setShowCandidateSelection] = useState(false);
  const [showBulkSchedule, setShowBulkSchedule] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedCandidateForNotes, setSelectedCandidateForNotes] = useState<{id: string, name: string} | null>(null);

  const shortlistView = useMemo(() => {
    const base = shortlistCandidates
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const sorted = [...base].sort((a, b) => {
      if (sortOption === 'fit-desc') return b.fitScore - a.fitScore;
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [shortlistCandidates, searchTerm, sortOption]);

  const postInterviewView = useMemo(() => {
    const filtered = postInterviewCandidates
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((c) => statusFilter === 'all' ? true : c.status === statusFilter);

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'fit-desc') return b.fitScore - a.fitScore;
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [postInterviewCandidates, searchTerm, sortOption, statusFilter]);

  const openAction = (action: PendingAction) => {
    setPendingAction(action);
    if (action.type === 'schedule') {
      setShowBulkSchedule(true);
    }
    if (action.type === 'bulk') {
      setShowCandidateSelection(true);
    }
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'reject') {
      if (pendingAction.list === 'shortlist' && pendingAction.candidateId) {
        setShortlistCandidates((prev) => prev.filter((c) => c.id !== pendingAction.candidateId));
      }
      if (pendingAction.list === 'post' && pendingAction.candidateId) {
        setPostInterviewCandidates((prev) => prev.map((c) => c.id === pendingAction.candidateId ? { ...c, status: 'rejected' } : c));
      }
      setActionMessage(`${pendingAction.candidateName || 'Candidate'} rejected`);
    }

    if (pendingAction.type === 'schedule' && pendingAction.candidateId) {
      setShortlistCandidates((prev) => prev.map((c) => c.id === pendingAction.candidateId ? { ...c, status: 'scheduled' } : c));
      setActionMessage(`Interview scheduled for ${pendingAction.candidateName || 'candidate'}`);
    }

    if (pendingAction.type === 'bulk') {
      setActionMessage('Bulk action applied to shortlisted candidates');
    }

    if (pendingAction.type === 'download') {
      setActionMessage(`Download started for ${pendingAction.candidateName || 'candidate'}`);
    }

    setPendingAction(null);
  };

  const handleFetchResult = async () => {
    if (!jobId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const job = await jobsService.getJob(jobId);
      setJobData({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        applicationsReceived: job.applicationsReceived || 0,
        noInterviewed: job.noInterviewed || 0,
      });
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to fetch job data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!jobData) {
      setActionMessage('Select a job or fetch job data first.');
      return;
    }

    setCreatingSession(true);
    setActionMessage(null);

    try {
      const payload = {
        title: `Screening - ${jobData.id}`,
        jobId: jobData.id,
        talentIds: []
      };

      const res = await screeningService.createSession(payload);
      setCreatedSession(res);
      setActionMessage(`Created screening session ${res.id || res.sessionId || 'created'}`);
    } catch (err) {
      console.error('Failed to create screening session:', err);
      setActionMessage('Failed to create screening session');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleViewSession = async () => {
    const sessionId = createdSession?.id || createdSession?.sessionId;
    if (!sessionId) return;

    try {
      const detail = await screeningService.getSession(sessionId);
      setSessionDetail(detail);
      setActionMessage(`Loaded session ${sessionId}`);
    } catch (err) {
      console.error('Failed to load session:', err);
      setActionMessage('Failed to load session details');
    }
  };

  if (viewMode === "ai-card" && selectedApplicant) {
    return (
      <ApplicantAICardView
        veritalentId={selectedApplicant.veritalentId || selectedApplicant.id}
        applicantName={selectedApplicant.name}
        onBack={() => {
          setViewMode("dashboard");
          setSelectedApplicant(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {showScheduling && (
          <SchedulingModal onClose={() => {
            setShowScheduling(false);
            setPendingAction(null);
          }} />
        )}
        {showBulkSchedule && (
          <BulkInterviewScheduleCompact onClose={() => {
            setShowBulkSchedule(false);
            setPendingAction(null);
          }} />
        )}
        {showCandidateSelection && (
          <CandidateSelectionModal onClose={() => {
            setShowCandidateSelection(false);
            setShowScheduling(true);
          }} />
        )}
        {showNotesModal && selectedCandidateForNotes && (
          <EvaluationNotesModal
            isOpen={showNotesModal}
            onClose={() => {
              setShowNotesModal(false);
              setSelectedCandidateForNotes(null);
            }}
            applicantId={selectedCandidateForNotes.id}
            applicantName={selectedCandidateForNotes.name}
            jobId={jobId}
          />
        )}
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
              disabled={loading}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Fetching...' : 'Fetch Result'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job ID</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Job Title</label>
              <div className="h-10 bg-gray-50 rounded border border-gray-200 flex items-center px-3">
                {jobData ? (
                  <span className="text-gray-700">{jobData.title}</span>
                ) : null}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Location</label>
              <div className="h-10 bg-gray-50 rounded border border-gray-200 flex items-center px-3">
                {jobData ? (
                  <span className="text-gray-700">{jobData.location}</span>
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

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleCreateSession}
              disabled={!jobData || creatingSession}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {creatingSession ? 'Creating...' : 'Create Screening Session'}
            </button>

            {createdSession && (
              <button
                onClick={handleViewSession}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                View Session
              </button>
            )}

            {sessionDetail && (
              <div className="ml-4 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                Session: {sessionDetail.title || sessionDetail.id || 'Session'} {sessionDetail.candidates ? `• ${sessionDetail.candidates.length} candidates` : ''}
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
                <label className="sr-only">Sort candidates</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="fit-desc">Sort by Fit Score</option>
                  <option value="name-asc">Sort by Name (A-Z)</option>
                </select>
              </div>
              <div className="relative w-full sm:w-auto">
                <label className="sr-only">Filter by status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              {activeTab === 'shortlist' && (
                <button
                  onClick={() => openAction({ type: 'bulk', list: 'bulk' })}
                  className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
                >
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
                        Notes
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Select & Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortlistView.map((candidate) => (
                      <tr key={candidate.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.fitScore}%
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedApplicant({ id: candidate.id, name: candidate.name });
                              setViewMode('ai-card');
                            }}
                            className="text-sm text-brand-primary hover:text-cyan-700 font-medium"
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedCandidateForNotes({ id: candidate.id, name: candidate.name });
                              setShowNotesModal(true);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Notes
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openAction({ type: 'schedule', candidateId: candidate.id, candidateName: candidate.name, list: 'shortlist' })}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
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
                {shortlistView.map((candidate) => (
                  <div key={candidate.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Fit Score: {candidate.fitScore}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedApplicant({ id: candidate.id, name: candidate.name });
                          setViewMode('ai-card');
                        }}
                        className="px-3 py-2 text-sm text-brand-primary border border-brand-primary rounded-lg hover:bg-cyan-50 font-medium"
                      >
                        View AI Card
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCandidateForNotes({ id: candidate.id, name: candidate.name });
                          setShowNotesModal(true);
                        }}
                        className="px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 font-medium"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => openAction({ type: 'schedule', candidateId: candidate.id, candidateName: candidate.name, list: 'shortlist' })}
                        className="px-3 py-2 text-sm text-white bg-brand-primary rounded-lg hover:bg-cyan-700 font-medium"
                      >
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
                        Notes
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {postInterviewView.map((candidate) => (
                      <tr key={candidate.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.fitScore}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {candidate.interviewRating}%
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openAction({ type: 'download', candidateId: candidate.id, candidateName: candidate.name, list: 'post' })}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Download
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedApplicant({ id: candidate.id, name: candidate.name });
                              setViewMode("ai-card");
                            }}
                            className="text-sm text-brand-primary hover:text-cyan-700 font-medium"
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedCandidateForNotes({ id: candidate.id, name: candidate.name });
                              setShowNotesModal(true);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Notes
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openAction({ type: 'reject', candidateId: candidate.id, candidateName: candidate.name, list: 'post' })}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
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
                {postInterviewView.map((candidate) => (
                  <div key={candidate.id} className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{candidate.name}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Fit Score:</span>
                          <span className="ml-1 font-medium text-gray-900">{candidate.fitScore}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Interview:</span>
                          <span className="ml-1 font-medium text-gray-900">{candidate.interviewRating}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => openAction({ type: 'download', candidateId: candidate.id, candidateName: candidate.name, list: 'post' })}
                          className="px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                        >
                          Download Report
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplicant({ id: candidate.id, name: candidate.name });
                            setViewMode("ai-card");
                          }}
                          className="px-3 py-2 text-sm text-brand-primary border border-brand-primary rounded-lg hover:bg-cyan-50 font-medium"
                        >
                          View AI Card
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCandidateForNotes({ id: candidate.id, name: candidate.name });
                            setShowNotesModal(true);
                          }}
                          className="px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 font-medium"
                        >
                          Notes
                        </button>
                      </div>
                      <button
                        onClick={() => openAction({ type: 'reject', candidateId: candidate.id, candidateName: candidate.name, list: 'post' })}
                        className="w-full px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium"
                      >
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