import React from "react";
import { FileText } from "lucide-react";
import StatsSection from "./StatsSection";
import NewRequestsSection from "./NewRequestsSection";
import RepositoryCard from "./RepositoryCard";
import { RepositoryItem, RepositoryType } from "@/types/dashboard";

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
  const stats = [
    { label: "Placement ID", value: "VT-98421-NG" },
    { label: "Verified Credentials", value: 6 },
    { label: "Pending Requests", value: 2 },
  ];

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