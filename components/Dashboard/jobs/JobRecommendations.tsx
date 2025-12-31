"use client";

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import { jobsService } from '@/lib/services/jobsService';
import JobCard from '@/components/Dashboard/jobs/JobCard';
import ApplicationsTracker from '@/components/Dashboard/jobs/ApplicationsTracker';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  requirements?: string;
  employmentType?: string;
  tags?: string[];
  postedAt?: string;
  closesAt?: string;
  aiMatchScore?: number;
  matchedSkills?: string[];
  skillGaps?: string[];
  organizationName?: string;
}

export default function JobRecommendations() {
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'applications'>('recommended');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    employmentType: 'all',
    location: 'all',
    minMatchScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFitInsights, setUserFitInsights] = useState<{
    location?: string;
    skills?: string[];
    experienceYears?: number;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (activeTab === 'recommended') {
        // Use recommendations endpoint for AI-matched jobs
        response = await jobsService.getRecommendations();
        console.log('[JobRecommendations] Recommendations API response:', response);
        
        // Extract data from response
        const jobsArray = response?.data?.jobs || [];
        const insights = response?.data?.userFitInsights || null;
        const paginationData = response?.data?.pagination || null;
        
        console.log('[JobRecommendations] Extracted jobs array:', jobsArray);
        console.log('[JobRecommendations] User fit insights:', insights);
        
        // Store user fit insights and pagination
        setUserFitInsights(insights);
        setPagination(paginationData);
        
        // Transform data - recommendations already include AI match scores from backend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobsWithScores = jobsArray.map((job: any) => ({
          ...job,
          id: job._id || job.id,
          company: job.company || job.organizationName || job.postedBy?.fullName || 'Company Name',
          description: job.description || job.aboutRole || 'No description available',
          aiMatchScore: job.matchScore || job.aiMatchScore || 0,
          matchedSkills: job.matchedSkills || [],
          skillGaps: job.skillGaps || [],
        }));
        
        setJobs(jobsWithScores);
        setFilteredJobs(jobsWithScores);
      } else if (activeTab === 'all') {
        // Use feed endpoint for all jobs
        response = await jobsService.getFeed();
        response = await jobsService.getFeed();
        console.log('[JobRecommendations] Feed API response:', response);
        
        // Extract jobs array from response (handle different response structures)
        const jobsArray = response?.data?.jobs || response?.jobs || response || [];
        console.log('[JobRecommendations] Extracted jobs array:', jobsArray);
        
        // Transform data for all jobs view (no AI scores)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedJobs = jobsArray.map((job: any) => ({
          ...job,
          id: job._id || job.id,
          company: job.company || job.organizationName || job.postedBy?.fullName || 'Company Name',
          description: job.description || job.aboutRole || 'No description available',
        }));
        
        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load job recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Employment type filter
    if (selectedFilters.employmentType !== 'all') {
      filtered = filtered.filter(job => job.employmentType === selectedFilters.employmentType);
    }

    // Location filter
    if (selectedFilters.location !== 'all') {
      filtered = filtered.filter(job => job.location === selectedFilters.location);
    }

    // Match score filter
    if (selectedFilters.minMatchScore > 0) {
      filtered = filtered.filter(job => (job.aiMatchScore || 0) >= selectedFilters.minMatchScore);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedFilters, jobs]);

  const handleApply = async (jobId: string) => {
    try {
      console.log('[JobRecommendations] Applying to job:', jobId);
      
      // Validate user has required data
      const { user } = useCreateUserStore.getState();
      if (!user?.token) {
        alert('Please log in to apply for jobs.');
        return;
      }
      
      // Optional: Check if user has completed profile
      if (!user?.veritalent_id && !user?.id) {
        console.warn('[JobRecommendations] User may not have completed profile');
      }
      
      const result = await jobsService.apply(jobId);
      console.log('[JobRecommendations] Application result:', result);
      
      // Show success message
      const successMessage = result?.message || 'Application submitted successfully!';
      alert(successMessage);
      
      // Optionally refresh the job list to update UI
      await fetchJobs();
    } catch (err: unknown) {
      console.error('[JobRecommendations] Failed to apply:', err);
      
      // Extract error details
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } };
        const backendMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
        const statusCode = axiosError.response?.status;
        
        if (backendMessage) {
          errorMessage = backendMessage;
        } else if (statusCode === 500) {
          errorMessage = 'Server error occurred. This may be a backend issue. Please ensure your profile is complete and try again later.';
        } else if (statusCode === 400) {
          errorMessage = 'Invalid application request. Please ensure your profile is complete.';
        } else if (statusCode === 409) {
          errorMessage = 'You have already applied to this job.';
        } else if (statusCode === 404) {
          errorMessage = 'Job not found. It may have been removed.';
        }
        
        console.error('[JobRecommendations] Error details:', {
          message: backendMessage,
          status: statusCode,
          fullResponse: axiosError.response?.data,
        });
      }
      
      alert(errorMessage);
    }
  };

  const tabs = [
    { id: 'recommended', label: 'AI Recommended', icon: Sparkles },
    { id: 'all', label: 'All Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Jobs & Opportunities
          </h1>
          <p className="text-gray-600">
            Discover AI-matched jobs tailored to your skills and experience
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'recommended' | 'all' | 'applications')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-brand-primary border-b-2 border-brand-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Applications View */}
        {activeTab === 'applications' ? (
          <ApplicationsTracker />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Employment Type Filter */}
                <div>
                  <select
                    value={selectedFilters.employmentType}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, employmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    <option value="Remote">Remote</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              {/* Match Score Filter (only for recommended) */}
              {activeTab === 'recommended' && (
                <div className="mt-4 flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Minimum Match Score:
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={selectedFilters.minMatchScore}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, minMatchScore: parseInt(e.target.value) })}
                    className="flex-1 max-w-xs"
                  />
                  <span className="text-sm font-medium text-brand-primary">
                    {selectedFilters.minMatchScore}%
                  </span>
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
                {activeTab === 'recommended' && (
                  <div className="flex items-center gap-2 text-sm text-brand-primary">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by VeriTalent AI</span>
                  </div>
                )}
              </div>
              
              {/* User Fit Insights */}
              {activeTab === 'recommended' && userFitInsights && (
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                    Your Profile Insights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {userFitInsights.location && (
                      <div>
                        <span className="text-gray-600">Location: </span>
                        <span className="font-medium text-gray-900">{userFitInsights.location}</span>
                      </div>
                    )}
                    {userFitInsights.experienceYears !== undefined && (
                      <div>
                        <span className="text-gray-600">Experience: </span>
                        <span className="font-medium text-gray-900">{userFitInsights.experienceYears} years</span>
                      </div>
                    )}
                    {userFitInsights.skills && userFitInsights.skills.length > 0 && (
                      <div>
                        <span className="text-gray-600">Skills Matched: </span>
                        <span className="font-medium text-gray-900">{userFitInsights.skills.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading opportunities...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="mt-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Jobs List */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedFilters({
                          employmentType: 'all',
                          location: 'all',
                          minMatchScore: 0,
                        });
                      }}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      showMatchScore={activeTab === 'recommended'}
                      onApply={handleApply}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
