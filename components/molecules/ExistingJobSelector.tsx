import React from 'react';
import { ExistingJob } from '@/types/dashboard';

interface ExistingJobSelectorProps {
  selectedJobId: string;
  existingJobs: ExistingJob[];
  onJobSelect: (jobId: string) => void;
  isLoading?: boolean;
}

export default function ExistingJobSelector({
  selectedJobId,
  existingJobs,
  onJobSelect,
  isLoading = false
}: ExistingJobSelectorProps) {
  return (
    <div className="w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <select
        className="w-full p-2 lg:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700 bg-white"
        value={selectedJobId}
        onChange={(e) => onJobSelect(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">{isLoading ? 'Loading jobs...' : 'Choose from your existing job posts'}</option>
        {!isLoading && existingJobs.length > 0 ? (
          existingJobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} - {job.companyName} ({job.status})
            </option>
          ))
        ) : !isLoading && existingJobs.length === 0 ? (
          <option value="" disabled>No jobs posted yet</option>
        ) : null}
      </select>
    </div>
  );
}