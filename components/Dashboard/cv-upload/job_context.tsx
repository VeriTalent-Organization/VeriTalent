import React, { useState, useCallback, useEffect } from "react";
import ModeOptionCard from "@/components/molecules/ModeOptionCard";
import ExistingJobSelector from "@/components/molecules/ExistingJobSelector";
import CreateJobForm from "@/components/molecules/CreateJobForm";
import { jobsService } from "@/lib/services/jobsService";
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
  onJobSelected?: (jobData: { jobId: string; companyName: string } | null) => void;
  selectedJobId?: string;
  onJobIdChange?: (jobId: string) => void;
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
  onJobSelected,
  selectedJobId: controlledSelectedJobId,
  onJobIdChange,
  labels = {},
  className,
}: JobContextSelectorProps) {
  const [uncontrolledJobData, setUncontrolledJobData] = useState<JobContextData>(defaultJobData);
  const [uncontrolledSelectedJobId, setUncontrolledSelectedJobId] = useState<string>("");
  const [fetchedJobs, setFetchedJobs] = useState<ExistingJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Use controlled or uncontrolled selectedJobId
  const selectedJobId = controlledSelectedJobId !== undefined ? controlledSelectedJobId : uncontrolledSelectedJobId;

  // Fetch posted jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const response = await jobsService.getMyPosted();
        if (response.success && response.data?.jobs) {
          setFetchedJobs(response.data.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch posted jobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

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
    // Update controlled or uncontrolled state
    if (controlledSelectedJobId !== undefined) {
      onJobIdChange?.(jobId);
    } else {
      setUncontrolledSelectedJobId(jobId);
    }

    if (jobId) {
      onExistingJobSelected?.(jobId);
      const selectedJob = fetchedJobs.find(job => job._id === jobId);
      if (selectedJob) {
        onJobSelected?.({
          jobId: selectedJob._id,
          companyName: selectedJob.companyName,
        });
      }
    } else {
      onJobSelected?.(null);
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
                existingJobs={fetchedJobs.length > 0 ? fetchedJobs : existingJobs}
                onJobSelect={handleExistingJobChange}
                isLoading={loadingJobs}
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