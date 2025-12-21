import React from 'react';
import JobFormField from './JobFormField';
import { JobContextData, JobContextLabels } from '@/types/dashboard';

interface CreateJobFormProps {
  jobData: JobContextData;
  onFieldChange: (field: keyof JobContextData, value: string) => void;
  labels: Required<JobContextLabels>;
}

const employmentTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export default function CreateJobForm({
  jobData,
  onFieldChange,
  labels
}: CreateJobFormProps) {
  return (
    <div className="bg-white rounded-lg p-2 lg:p-8 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <JobFormField
          label={labels.jobTitle}
          type="text"
          value={jobData.jobTitle}
          onChange={(value) => onFieldChange("jobTitle", value)}
          placeholder="Software Engineer"
        />

        <JobFormField
          label={labels.companyName}
          type="text"
          value={jobData.companyName}
          onChange={(value) => onFieldChange("companyName", value)}
          placeholder="TechCorp"
        />

        <JobFormField
          label={labels.employmentType}
          type="select"
          value={jobData.employmentType}
          onChange={(value) => onFieldChange("employmentType", value)}
          options={employmentTypeOptions}
        />

        <JobFormField
          label={labels.location}
          type="text"
          value={jobData.location}
          onChange={(value) => onFieldChange("location", value)}
          placeholder="Fountain Hills, Arizona"
        />
      </div>

      <JobFormField
        label={labels.roleOverview}
        type="textarea"
        value={jobData.roleOverview}
        onChange={(value) => onFieldChange("roleOverview", value)}
        placeholder="Brief overview of the role and responsibilities..."
        rows={4}
      />
    </div>
  );
}