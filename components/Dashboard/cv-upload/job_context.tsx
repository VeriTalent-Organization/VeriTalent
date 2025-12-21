import React, { useState, useCallback } from "react";
import ModeOptionCard from "@/components/molecules/ModeOptionCard";
import ExistingJobSelector from "@/components/molecules/ExistingJobSelector";
import CreateJobForm from "@/components/molecules/CreateJobForm";
import {
  CVUploadMode,
  JobContextData,
  JobContextLabels,
  ExistingJob,
  defaultJobData
} from "@/types/dashboard";

interface JobContextSelectorProps {
  value?: CVUploadMode;
  onModeChange?: (mode: CVUploadMode) => void;
  jobData?: JobContextData;
  onJobDataChange?: (data: JobContextData) => void;
  existingJobs?: ExistingJob[];
  onExistingJobSelected?: (jobId: string) => void;
  labels?: JobContextLabels;
  className?: string;
  onNext?: () => void;
  onBack?: () => void;
  canBack?: boolean;
}

const defaultLabels: Required<JobContextLabels> = {
  title: "Job Context",
  existingOption: "Link to Existing Job Post",
  createOption: "Create Job Context",
  jobTitle: "Job Title",
  companyName: "Company Name",
  employmentType: "Employment Type",
  location: "Location",
  roleOverview: "Role Overview",
};

export default function JobContextSelector({
  value: controlledMode,
  onModeChange,
  jobData: controlledJobData,
  onJobDataChange,
  existingJobs = [],
  onExistingJobSelected,
  labels = {},
  className,
}: JobContextSelectorProps) {
  const [uncontrolledJobData, setUncontrolledJobData] = useState<JobContextData>(defaultJobData);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedMode = controlledMode;
  const jobData = controlledJobData ?? uncontrolledJobData;
  const mergedLabels = { ...defaultLabels, ...labels };

  const handleModeChange = useCallback((mode: CVUploadMode) => {
    onModeChange?.(mode);
  }, [onModeChange]);

  const handleJobDataChange = (field: keyof JobContextData, value: string) => {
    if (controlledJobData === undefined) {
      setUncontrolledJobData(prev => {
        const updatedData = { ...prev, [field]: value };
        onJobDataChange?.(updatedData);
        return updatedData;
      });
    } else {
      const updatedData = { ...controlledJobData, [field]: value };
      onJobDataChange?.(updatedData);
    }
  };

  const handleExistingJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    if (jobId) {
      onExistingJobSelected?.(jobId);
    }
  };

  return (
    <div className={`min-h-[500px] flex flex-col justify-between ${className || ""}`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          {mergedLabels.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ModeOptionCard
            mode="existing"
            isSelected={selectedMode === "existing"}
            title={mergedLabels.existingOption}
            onSelect={handleModeChange}
          >
            {selectedMode === "existing" && (
              <ExistingJobSelector
                selectedJobId={selectedJobId}
                existingJobs={existingJobs}
                onJobSelect={handleExistingJobChange}
              />
            )}
          </ModeOptionCard>

          <ModeOptionCard
            mode="create"
            isSelected={selectedMode === "create"}
            title={mergedLabels.createOption}
            onSelect={handleModeChange}
          />
        </div>

        {selectedMode === "create" && (
          <CreateJobForm
            jobData={jobData}
            onFieldChange={handleJobDataChange}
            labels={mergedLabels}
          />
        )}
      </div>
    </div>
  );
}