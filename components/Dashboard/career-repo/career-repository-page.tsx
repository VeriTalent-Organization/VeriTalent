"use client";

import React, { useState, useEffect } from "react";
import AddExistingRecordForm from "@/components/molecules/addExistingRecordForm";
import CertificateVerificationComponent from "./certificate-verification-component";
import WorkReferenceComponent from "./work-reference-component";
import NewRequestsSection from "@/components/molecules/NewRequestsSection";
import ReferencesDashboard from "@/components/molecules/ReferenceDashboard";
import LPIReportsView from "@/components/molecules/LPIReportsView";
import InternalLPIFeed from "@/components/molecules/InternalLPIFeed";
import InstitutionalLPISync from "@/components/molecules/InstitutionalLPISync";
import ModalManager from "@/components/molecules/ModalManager";
import { PageMode, LPIMode, RepositoryType, RepositoryItem } from "@/types/dashboard";
import { referencesService } from "@/lib/services/referencesService";

export default function CareerRepositoryPage() {
  const [activeTab, setActiveTab] = useState<"references" | "lpi">("references");
  const [pageMode, setPageMode] = useState<PageMode>("dashboard");
  const [lpiMode, setLpiMode] = useState<LPIMode>("reports");
  const [activeModal, setActiveModal] = useState<RepositoryType | null>(null);
  const [repositories, setRepositories] = useState<RepositoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refs = await referencesService.getMyReferences();
        // Map references to RepositoryItem format
        const mappedRefs: RepositoryItem[] = refs.map((ref: any) => ({
          type: ref.type as RepositoryType,
          badge: ref.status === 'verified' ? 'Verified/Fully' : ref.status === 'pending' ? 'Pending' : 'Processed',
          badgeColor: ref.status === 'verified' ? 'bg-green-100 text-green-700' : ref.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700',
          organization: ref.issuerName || 'Unknown',
          subtitle: ref.title,
          period: ref.startDate && ref.endDate ? `${ref.startDate} - ${ref.endDate}` : 'Ongoing',
          showOnCard: true,
          actions: 3,
        }));
        // Add profile-related items if any
        setRepositories(mappedRefs);
      } catch (error) {
        console.error('Failed to fetch repository data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Career Repository
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Verified career records with learning and performance intelligence
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {([
              { id: "references", label: "References & Verifications" },
              { id: "lpi", label: "LPI Integration & Reports" },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "lpi") setLpiMode("reports");
                }}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-brand-primary border-b-2 border-brand-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "references" && (
          <>
            {pageMode === "work-reference" && (
              <>
                <NewRequestsSection
                  onWorkReference={() => setPageMode("work-reference")}
                  onCertificateVerification={() => setPageMode("certificate-verification")}
                />
                <WorkReferenceComponent
                  onSubmit={() => setPageMode("dashboard")}
                  onCancel={() => setPageMode("dashboard")}
                />
              </>
            )}

            {pageMode === "certificate-verification" && (
              <>
                <NewRequestsSection
                  onWorkReference={() => setPageMode("work-reference")}
                  onCertificateVerification={() => setPageMode("certificate-verification")}
                />
                <CertificateVerificationComponent
                  onSubmit={() => setPageMode("dashboard")}
                  onCancel={() => setPageMode("dashboard")}
                />
              </>
            )}

            {pageMode === "add-existing" && (
              <AddExistingRecordForm onBack={() => setPageMode("dashboard")} />
            )}

            {pageMode === "dashboard" && (
              <ReferencesDashboard
                repositories={repositories}
                onAddExisting={() => setPageMode("add-existing")}
                onWorkReference={() => setPageMode("work-reference")}
                onCertificateVerification={() => setPageMode("certificate-verification")}
                onViewRepository={setActiveModal}
              />
            )}
          </>
        )}

        {activeTab === "lpi" && (
          <>
            {lpiMode === "reports" && <LPIReportsView onNavigate={setLpiMode} />}
            {lpiMode === "internal-feed" && <InternalLPIFeed onBack={() => setLpiMode("reports")} />}
            {lpiMode === "institutional-sync" && <InstitutionalLPISync onBack={() => setLpiMode("reports")} />}
          </>
        )}
      </div>

      {/* Modals */}
      <ModalManager activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}