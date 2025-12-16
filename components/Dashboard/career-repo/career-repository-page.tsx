"use client";

import React, { useState } from "react";
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

const repositories: RepositoryItem[] = [
  {
    type: "Work Reference",
    badge: "Pending",
    badgeColor: "bg-yellow-100 text-yellow-700",
    organization: "ABC Corp",
    subtitle: "Internship (Developer)",
    period: "2018 - Ended",
    showOnCard: true,
    actions: 3,
  },
  {
    type: "Membership Reference",
    badge: "Verified/Fully",
    badgeColor: "bg-green-100 text-green-700",
    organization: "Alumni Association",
    subtitle: "Membership",
    period: "Active (2023–2025)",
    showOnCard: true,
    actions: 3,
  },
  {
    type: "Certificate Verification",
    badge: "Processed",
    badgeColor: "bg-green-100 text-green-700",
    organization: "University of Lagos",
    subtitle: "B.Sc. Computer Science",
    period: "Issued Oct 2020",
    showOnCard: true,
    actions: 3,
  },
  {
    type: "Certificate",
    badge: "Check Verification Link",
    badgeColor: "bg-red-100 text-red-700",
    organization: "Certificate",
    subtitle: "Google Digital Certificate",
    period: "Jan 2023 – Mar 2024",
    showOnCard: true,
    actions: 1,
  },
  {
    type: "Work History",
    badge: "Not Verified",
    badgeColor: "bg-red-100 text-red-700",
    organization: "Marketing Associate",
    subtitle: "BlueBridge Systems",
    period: "Jan 2023 – Mar 2024",
    showOnCard: false,
    actions: 1,
  },
  {
    type: "Recommendation",
    badge: "Verified/Fully",
    badgeColor: "bg-green-100 text-green-700",
    organization: "Mr Akinola Jacob",
    subtitle: "Supervisor (Nestle)",
    period: "2021 – 2025",
    showOnCard: false,
    actions: 3,
  },
];

export default function CareerRepositoryPage() {
  const [activeTab, setActiveTab] = useState<"references" | "lpi">("references");
  const [pageMode, setPageMode] = useState<PageMode>("dashboard");
  const [lpiMode, setLpiMode] = useState<LPIMode>("reports");
  const [activeModal, setActiveModal] = useState<RepositoryType | null>(null);

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