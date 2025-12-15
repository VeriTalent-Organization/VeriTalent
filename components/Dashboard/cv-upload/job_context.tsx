import React, { useState, useCallback } from "react";

export type CVUploadMode = "existing" | "create";

export interface JobContextData {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  roleOverview: string;
}

interface JobContextSelectorProps {
  defaultMode?: CVUploadMode;
  value?: CVUploadMode;
  onModeChange?: (mode: CVUploadMode) => void;
  jobData?: JobContextData;
  onJobDataChange?: (data: JobContextData) => void;
  existingJobs?: { id: string; title: string }[];
  onExistingJobSelected?: (jobId: string) => void;
  labels?: {
    title?: string;
    existingOption?: string;
    createOption?: string;
    jobTitle?: string;
    companyName?: string;
    employmentType?: string;
    location?: string;
    roleOverview?: string;
  };
  className?: string;
}

const defaultJobData: JobContextData = {
  jobTitle: "",
  companyName: "",
  employmentType: "",
  location: "",
  roleOverview: "",
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
  onNext,
  onBack,
  canBack,
}: JobContextSelectorProps & { onNext?: () => void; onBack?: () => void; canBack?: boolean }) {
  const [uncontrolledJobData, setUncontrolledJobData] = useState<JobContextData>(defaultJobData);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedMode = controlledMode
  const jobData = controlledJobData ?? uncontrolledJobData;

  const handleModeChange = useCallback((mode: CVUploadMode) => {
    if (controlledMode === undefined) {
      onModeChange?.(mode);
    } else {
      onModeChange?.(mode);
    }
  }, [controlledMode, onModeChange]);
  

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

  const canProceed = () => {
    if (selectedMode === "create") {
      return !!jobData.jobTitle && !!jobData.companyName;
    }
    if (selectedMode === "existing") {
      return !!selectedJobId;
    }
    return false;
  };

  const {
    title = "Job Context",
    existingOption = "Link to Existing Job Post",
    createOption = "Create Job Context",
    jobTitle: labelJobTitle = "Job Title",
    companyName: labelCompanyName = "Company Name",
    employmentType: labelEmploymentType = "Employment Type",
    location: labelLocation = "Location",
    roleOverview: labelRoleOverview = "Role Overview",
  } = labels;

  return (
    <div className={` min-h-[500px] flex flex-col justify-between ${className || ""}`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">{title}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className={`bg-white rounded-xl p-2 lg:p-8 border-2 cursor-pointer transition-all shadow-sm group ${selectedMode === "existing" ? "border-brand-primary bg-brand-primary-50/20" : "border-gray-200 hover:border-gray-300"
              }`}
            onClick={() => handleModeChange("existing")}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {/* Checkbox circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedMode === "existing" ? "bg-brand-primary text-white" : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                  }`}
              >
                {selectedMode === "existing" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{existingOption}</h3>

              {selectedMode === "existing" && (
                <div className="w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <select
                    className="w-full p-2 lg:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700 bg-white"
                    value={selectedJobId}
                    onChange={(e) => handleExistingJobChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Choose from your existing job posts</option>
                    {existingJobs.length > 0 ? (
                      existingJobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="job1">Software Engineer at TechCorp</option>
                        <option value="job2">Product Manager at InnovateX</option>
                        <option value="job3">Data Analyst at DataSolutions</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div
            className={`bg-white rounded-xl p-8 border-2 cursor-pointer transition-all shadow-sm group ${selectedMode === "create" ? "border-brand-primary bg-brand-primary-50/20" : "border-gray-200 hover:border-gray-300"
              }`}
            onClick={() => handleModeChange("create")}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedMode === "create" ? "bg-brand-primary text-white" : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                  }`}
              >
                {selectedMode === "create" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{createOption}</h3>
            </div>
          </div>
        </div>

        {selectedMode === "create" && (
          <div className="bg-white rounded-lg p-2 lg:p-8 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{labelJobTitle}</label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={jobData.jobTitle}
                  onChange={(e) => handleJobDataChange("jobTitle", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{labelCompanyName}</label>
                <input
                  type="text"
                  placeholder="TechCorp"
                  value={jobData.companyName}
                  onChange={(e) => handleJobDataChange("companyName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{labelEmploymentType}</label>
                <select
                  value={jobData.employmentType}
                  onChange={(e) => handleJobDataChange("employmentType", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700 bg-white"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{labelLocation}</label>
                <input
                  type="text"
                  placeholder="Fountain Hills, Arizona"
                  value={jobData.location}
                  onChange={(e) => handleJobDataChange("location", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{labelRoleOverview}</label>
              <textarea
                placeholder="Brief overview of the role and responsibilities..."
                rows={4}
                value={jobData.roleOverview}
                onChange={(e) => handleJobDataChange("roleOverview", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}