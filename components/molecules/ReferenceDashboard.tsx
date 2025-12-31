import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import StatsSection from "./StatsSection";
import NewRequestsSection from "./NewRequestsSection";
import RepositoryCard from "./RepositoryCard";
import { RepositoryItem, RepositoryType } from "@/types/dashboard";
import { referencesService } from "@/lib/services/referencesService";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";

interface ReferencesDashboardProps {
  repositories: RepositoryItem[];
  onAddExisting: () => void;
  onWorkReference: () => void;
  onCertificateVerification: () => void;
  onViewRepository: (type: RepositoryType) => void;
}

export default function ReferencesDashboard({
  repositories,
  onAddExisting,
  onWorkReference,
  onCertificateVerification,
  onViewRepository,
}: ReferencesDashboardProps) {
  const { user } = useCreateUserStore();
  const [stats, setStats] = useState([
    { label: "Placement ID", value: user.veritalent_id || "Loading..." },
    { label: "Verified Credentials", value: 0 },
    { label: "Pending Requests", value: 0 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const references = await referencesService.getMyReferences();
        
        interface Reference {
          status: 'verified' | 'pending' | 'rejected';
          [key: string]: unknown;
        }
        
        setStats([
          { label: "Placement ID", value: user.veritalent_id || "N/A" },
          { label: "Verified Credentials", value: references.filter((r: Reference) => r.status === 'verified').length },
          { label: "Pending Requests", value: references.filter((r: Reference) => r.status === 'pending').length },
        ]);
      } catch (error) {
        console.error('Failed to fetch references stats:', error);
        setStats([
          { label: "Placement ID", value: user.veritalent_id || "Error" },
          { label: "Verified Credentials", value: 0 },
          { label: "Pending Requests", value: 0 },
        ]);
      }
    };
    fetchStats();
  }, [user.veritalent_id]);

  return (
    <>
      <StatsSection title="Your Verified Career Records" stats={stats} />

      <div className="mb-6">
        <button
          onClick={onAddExisting}
          className="px-6 py-3 bg-brand-primary text-white rounded-lg text-sm text-left flex items-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          Add Existing Verifiable Career Record (Listing)
        </button>
      </div>

      <NewRequestsSection
        onWorkReference={onWorkReference}
        onCertificateVerification={onCertificateVerification}
      />

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo, index) => (
          <RepositoryCard
            key={index}
            repository={repo}
            onView={() => onViewRepository(repo.type)}
          />
        ))}
      </div>
    </>
  );
}