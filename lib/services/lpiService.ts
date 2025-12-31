import { apiClient } from "./apiClient";
import { LPIReport } from "@/types/dashboard";

export type SubmissionStatus = "queued" | "processing" | "completed" | "failed";

export interface LearnerSubmission {
  id: string;
  learnerName: string;
  learnerEmail: string;
  program: string;
  submissionType: string;
  submittedAt: string;
  status: SubmissionStatus;
  downloadUrl?: string;
  failureReason?: string;
}

export interface ProcessingSummary {
  processed: number;
  inQueue: number;
  failed: number;
  lastUpdated?: string;
  failedItems?: Array<{ id: string; learnerName: string; reason?: string }>;
}

export interface CompetencySignal {
  label: string;
  score: number; // 0-100
}

export interface LPIReportWithSignals extends LPIReport {
  learnerName?: string;
  learnerEmail?: string;
  competencySignals?: CompetencySignal[];
  downloadUrl?: string;
}

export interface InstitutionSyncPayload {
  institutions: string[];
}

export async function listReports(): Promise<LPIReport[]> {
  // Placeholder API path; replace with real backend route when available
  const res = await apiClient.get("/api/lpi/reports");
  return res.data as LPIReport[];
}

export async function listReportsWithSignals(): Promise<LPIReportWithSignals[]> {
  const res = await apiClient.get("/api/lpi/reports-with-signals");
  return res.data as LPIReportWithSignals[];
}

export async function submitInternalFeed(formData: FormData): Promise<{ id: string }> {
  // Uses generic submission endpoint until dedicated LPI route exists
  const res = await apiClient.post("/tapi/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { id: string };
}

export async function syncInstitutions(payload: InstitutionSyncPayload): Promise<{ success: boolean }>{
  // Placeholder API path; replace with real backend route when available
  const res = await apiClient.post("/api/lpi/institutions/sync", payload);
  return res.data as { success: boolean };
}

export async function listSubmissions(): Promise<LearnerSubmission[]> {
  const res = await apiClient.get("/api/lpi/submissions");
  return res.data as LearnerSubmission[];
}

export async function createSubmission(formData: FormData): Promise<{ id: string }> {
  const res = await apiClient.post("/api/lpi/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { id: string };
}

export async function getProcessingStatus(): Promise<ProcessingSummary> {
  const res = await apiClient.get("/api/lpi/processing-status");
  return res.data as ProcessingSummary;
}

export async function retrySubmission(id: string): Promise<{ success: boolean }> {
  const res = await apiClient.post(`/api/lpi/submissions/${id}/retry`);
  return res.data as { success: boolean };
}
