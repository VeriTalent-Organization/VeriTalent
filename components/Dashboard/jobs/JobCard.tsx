"use client";

import React, { useState } from 'react';
import { MapPin, Clock, Briefcase, ChevronRight, TrendingUp, Check, Sparkles } from 'lucide-react';

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
}

interface JobCardProps {
  job: Job;
  showMatchScore?: boolean;
  onApply: (jobId: string) => void;
}

export default function JobCard({ job, showMatchScore = false, onApply }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await onApply(job.id);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Potential Match';
    return 'Low Match';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company || 'Company Name'}</p>
              </div>
              
              {/* AI Match Score Badge */}
              {showMatchScore && job.aiMatchScore !== undefined && (
                <div className={`px-3 py-2 rounded-lg border flex flex-col items-center ${getMatchScoreColor(job.aiMatchScore)}`}>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xl font-bold">{job.aiMatchScore}%</span>
                  </div>
                  <span className="text-xs font-medium">{getMatchScoreLabel(job.aiMatchScore)}</span>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.employmentType && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.employmentType}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(job.postedAt)}</span>
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-gray-700 mb-3 line-clamp-2">
              {job.description}
            </p>

            {/* Matched Skills (for AI recommendations) */}
            {showMatchScore && job.matchedSkills && job.matchedSkills.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  Matched Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gaps (for AI recommendations) */}
            {showMatchScore && job.skillGaps && job.skillGaps.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Skills to Develop
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skillGaps.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Expanded Content */}
            {expanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {job.requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Full Description</h4>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
                {job.closesAt && (
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Application Deadline:</span>{' '}
                      {new Date(job.closesAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            disabled={applying}
            className="flex-1 sm:flex-none px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors font-medium"
          >
            {expanded ? 'Show Less' : 'View Details'}
            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
