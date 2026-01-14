'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Clock, Calendar, Briefcase, Eye, FileText, CheckSquare } from 'lucide-react';
import { jobsService } from '@/lib/services/jobsService';
import { formatDate } from '@/lib/utils';

interface Applicant {
  _id: string;
  fullName: string;
}

interface PostedBy {
  _id: string;
  fullName: string;
  professionalDesignation?: string;
}

interface JobDetails {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  status: string;
  aboutRole: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  applicationDeadline: string;
  postedBy: PostedBy;
  views: number;
  createdAt: string;
  updatedAt: string;
  applicants?: Applicant[];
}

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsService.getJob(jobId);
      if (response.success && response.data?.job) {
        setJob(response.data.job);
      } else {
        setError('Failed to load job details');
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, fetchJobDetails]);

  const filteredApplicants = job?.applicants || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error || 'Job not found'}</p>
            <button
              onClick={fetchJobDetails}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Job Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600 font-medium mb-4">{job.companyName}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-brand-primary">
                    {job.applicants?.length || 0} Applicant{job.applicants?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{job.views || 0} Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>Posted by: <span className="font-medium">{job.postedBy.fullName}</span> ({job.postedBy.professionalDesignation || 'N/A'})</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'N/A'}
            </span>
          </div>

          {/* Job Details Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            {/* About Role */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-brand-primary" />
                <h3 className="font-semibold text-gray-900">About Role</h3>
              </div>
              <p className="text-sm text-gray-600">{job.aboutRole}</p>
            </div>

            {/* Key Responsibilities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-5 h-5 text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Key Responsibilities</h3>
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                {job.keyResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Required Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        {filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applicants</h3>
            <p className="text-gray-600">No one has applied to this job yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-lg">
                      {applicant.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{applicant.fullName}</h3>
                      <p className="text-sm text-gray-600 font-mono">Applicant ID: {applicant._id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
