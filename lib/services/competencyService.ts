import { apiClient } from "./apiClient";

export interface CompetencySignal {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  score: number; // 0-100
  verifiedBy: 'AI' | 'Reference' | 'Certificate' | 'LPI' | 'Experience';
  source?: string; // Additional context about verification source
  lastUpdated?: string;
}

export interface CompetencyBreakdown {
  skill: string;
  level: CompetencySignal['level'];
  score: number;
  factors: {
    experience: number; // years of experience contribution
    references: number; // reference endorsements contribution
    lpiReports: number; // LPI assessment contribution
    certificates: number; // certificate validation contribution
    aiAnalysis: number; // AI CV analysis contribution
  };
  evidence: string[]; // List of evidence supporting this competency level
}

export interface CompetencyValidationRequest {
  skill: string;
  validationType: 'reference' | 'certificate';
  validatorId?: string; // Reference or certificate ID
  evidence?: string;
}

export async function getCompetencySignals(veritalentId: string): Promise<CompetencySignal[]> {
  const res = await apiClient.get(`/competency-signals/${veritalentId}`);
  return res.data as CompetencySignal[];
}

export async function calculateCompetencySignals(veritalentId: string): Promise<{ success: boolean; signals: CompetencySignal[] }> {
  const res = await apiClient.post(`/competency/calculate/${veritalentId}`);
  return res.data;
}

export async function getCompetencyBreakdown(veritalentId: string, skill: string): Promise<CompetencyBreakdown> {
  const res = await apiClient.get(`/competency/breakdown/${veritalentId}/${skill}`);
  return res.data;
}

export async function validateCompetency(request: CompetencyValidationRequest): Promise<{ success: boolean }> {
  const res = await apiClient.post('/competency/validate', request);
  return res.data;
}

// Mock data for development - remove when backend is ready
export function getMockCompetencySignals(): CompetencySignal[] {
  return [
    {
      skill: "JavaScript",
      level: "advanced",
      score: 85,
      verifiedBy: "AI",
      source: "CV analysis and project portfolio",
      lastUpdated: "2024-01-15"
    },
    {
      skill: "React",
      level: "intermediate",
      score: 72,
      verifiedBy: "Reference",
      source: "Professional reference from TechCorp",
      lastUpdated: "2024-01-10"
    },
    {
      skill: "Node.js",
      level: "advanced",
      score: 88,
      verifiedBy: "LPI",
      source: "LPI assessment completed",
      lastUpdated: "2024-01-12"
    },
    {
      skill: "Python",
      level: "beginner",
      score: 45,
      verifiedBy: "AI",
      source: "Limited experience detected",
      lastUpdated: "2024-01-08"
    },
    {
      skill: "TypeScript",
      level: "intermediate",
      score: 68,
      verifiedBy: "Certificate",
      source: "Microsoft TypeScript certification",
      lastUpdated: "2024-01-05"
    }
  ];
}

export const competencyService = {
  getCompetencySignals,
  calculateCompetencySignals,
  getCompetencyBreakdown,
  validateCompetency,
  getMockCompetencySignals
};