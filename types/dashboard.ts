// types/jobContext.ts
export type CVUploadMode = "existing" | "create";

export interface JobContextData {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  roleOverview: string;
}

export interface JobContextLabels {
  title?: string;
  existingOption?: string;
  createOption?: string;
  jobTitle?: string;
  companyName?: string;
  employmentType?: string;
  location?: string;
  roleOverview?: string;
}

export interface ExistingJob {
  id: string;
  title: string;
}

export const defaultJobData: JobContextData = {
  jobTitle: "",
  companyName: "",
  employmentType: "",
  location: "",
  roleOverview: "",
};

// types/careerRepository.ts
export type RepositoryType =
  | "Work Reference"
  | "Membership Reference"
  | "Certificate Verification"
  | "Certificate"
  | "Work History"
  | "Recommendation";

export type PageMode =
  | "dashboard"
  | "work-reference"
  | "certificate-verification"
  | "add-existing";

export type LPIMode = "reports" | "internal-feed" | "institutional-sync";

export interface RepositoryItem {
  type: RepositoryType;
  badge: string;
  badgeColor: string;
  organization: string;
  subtitle: string;
  period: string;
  showOnCard: boolean;
  actions: number;
}