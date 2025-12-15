"use client";

import React, { useState } from "react";
import { FileText, Award, Eye, Download, Share2, Upload, X } from "lucide-react";
import AddExistingRecordForm from "@/components/molecules/addExistingRecordForm";
import CertificateVerificationComponent from "./certificate-verification-component";
import WorkReferenceComponent from "./work-reference-component";
import WorkReferenceModal from "./work-reference-modal";
import MembershipReferenceModal from "./membership-reference-modal";
import CertificateVerificationModal from "./certificate-verification modal";
import CertificateModal from "./certificate-modal";
import WorkHistoryModal from "./work-history";
import RecommendationModal from "./recommendation-modal";

// =====================
// Types
// =====================
type RepositoryType =
  | "Work Reference"
  | "Membership Reference"
  | "Certificate Verification"
  | "Certificate"
  | "Work History"
  | "Recommendation";

type PageMode =
  | "dashboard"
  | "work-reference"
  | "certificate-verification"
  | "add-existing";

type LPIMode = "reports" | "internal-feed" | "institutional-sync";

interface RepositoryItem {
  type: RepositoryType;
  badge: string;
  badgeColor: string;
  organization: string;
  subtitle: string;
  period: string;
  showOnCard: boolean;
  actions: number;
}

interface NewRequestsProps {
  onWorkReference: () => void;
  onCertificateVerification: () => void;
}

// =====================
// Placeholder Components - Replace with your actual imports
// =====================
// function WorkReferenceComponent({ onSubmit, onCancel }: any) {
//   return (
//     <div className="bg-white rounded-lg p-4 sm:p-6">
//       <h3 className="text-lg font-semibold mb-4">Work Reference Form</h3>
//       <p className="text-gray-600 mb-4">Replace with your actual WorkReferenceComponent</p>
//       <div className="flex flex-col sm:flex-row gap-3">
//         <button onClick={onSubmit} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
//           Submit
//         </button>
//         <button onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// function CertificateVerificationComponent({ onSubmit, onCancel }: any) {
//   return (
//     <div className="bg-white rounded-lg p-4 sm:p-6">
//       <h3 className="text-lg font-semibold mb-4">Certificate Verification Form</h3>
//       <p className="text-gray-600 mb-4">Replace with your actual CertificateVerificationComponent</p>
//       <div className="flex flex-col sm:flex-row gap-3">
//         <button onClick={onSubmit} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
//           Submit
//         </button>
//         <button onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// function AddExistingRecordForm({ onBack }: any) {
//   return (
//     <div className="bg-white rounded-lg p-4 sm:p-6">
//       <button onClick={onBack} className="text-teal-600 mb-4">← Back</button>
//       <h3 className="text-lg font-semibold mb-4">Add Existing Record</h3>
//       <p className="text-gray-600">Replace with your actual AddExistingRecordForm component</p>
//     </div>
//   );
// }

// Placeholder Modal Components - Replace with your actual modal imports
// function WorkReferenceModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual WorkReferenceModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

// function MembershipReferenceModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual MembershipReferenceModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

// function CertificateVerificationModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual CertificateVerificationModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

// function CertificateModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual CertificateModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

// function WorkHistoryModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual WorkHistoryModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

// function RecommendationModal({ onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <p className="text-gray-600">Replace with your actual RecommendationModal</p>
//         <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
//       </div>
//     </div>
//   );
// }

export default function CareerRepositoryPage() {
function NewRequests({
  onWorkReference,
  onCertificateVerification,
}: NewRequestsProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        New Requests
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onWorkReference}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm sm:text-base">Work Reference</span>
        </button>

        <button
          onClick={onCertificateVerification}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors"
        >
          <Award className="w-5 h-5" />
          <span className="text-sm sm:text-base">Certificate Verification</span>
        </button>
      </div>
    </div>
  );
}

// Internal LPI Feed Component
function InternalLPIFeed({ onBack }: { onBack: () => void }) {
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file");
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionCategory, setSubmissionCategory] = useState("");
  const [pasteLink, setPasteLink] = useState("");

  return (
    <div>
      {/* Header with back navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-brand-primary hover:text-cyan-700 mb-4 flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Reports
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Internal LPI Feed</h2>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-4">
          <input
            type="radio"
            id="upload-file"
            checked={uploadMethod === "file"}
            onChange={() => setUploadMethod("file")}
            className="w-4 h-4 text-brand-primary mt-0.5 shrink-0"
          />
          <label htmlFor="upload-file" className="text-xs sm:text-sm text-gray-700">
            Upload any verified body of work or activity footprint for LPI analysis (PDF, DOCX, TXT)
          </label>
        </div>

        {uploadMethod === "file" && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center bg-white">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-700 mb-1">Upload file (pdf, Docx, TXT) or</p>
            <p className="text-sm sm:text-base text-gray-700 mb-2">click to browse</p>
            <p className="text-xs sm:text-sm text-gray-500">Upload Multiple files (limit 100MB total)</p>
          </div>
        )}
      </div>

      {/* Or Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">Or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Paste Link Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="radio"
            id="paste-link"
            checked={uploadMethod === "link"}
            onChange={() => setUploadMethod("link")}
            className="w-4 h-4 text-brand-primary"
          />
          <label htmlFor="paste-link" className="text-xs sm:text-sm font-medium text-brand-primary">
            Paste Link
          </label>
        </div>

        {uploadMethod === "link" && (
          <input
            type="text"
            value={pasteLink}
            onChange={(e) => setPasteLink(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
            placeholder="Enter link..."
          />
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Title
          </label>
          <input
            type="text"
            value={submissionTitle}
            onChange={(e) => setSubmissionTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Category
          </label>
          <select
            value={submissionCategory}
            onChange={(e) => setSubmissionCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none text-sm sm:text-base"
          >
            <option value="">Select category...</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Note Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-900 mb-2">Note:</p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-1">
          <li>Submitted work must be publicly or administratively recognised</li>
          <li>Unverified uploads may be rejected.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
          Submit
        </button>
      </div>
    </div>
  );
}

// Institutional LPI Sync Component
function InstitutionalLPISync({ onBack }: { onBack: () => void }) {
  const [institutions, setInstitutions] = useState<string[]>([]);

  const addInstitution = () => {
    setInstitutions([...institutions, ""]);
  };

  const removeInstitution = (index: number) => {
    setInstitutions(institutions.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Header with back navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-brand-primary hover:text-cyan-700 mb-4 flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Reports
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Institutions In-Sync</h2>
      </div>

      {/* Connected Institutions Section */}
      <div className="mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
          Connected Institutions
        </h3>

        {/* Empty state boxes */}
        {institutions.length === 0 ? (
          <>
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              {/* Empty placeholder */}
            </div>
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              {/* Empty placeholder */}
            </div>
          </>
        ) : (
          institutions.map((institution, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              <input
                type="text"
                value={institution}
                onChange={(e) => {
                  const newInstitutions = [...institutions];
                  newInstitutions[index] = e.target.value;
                  setInstitutions(newInstitutions);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
                placeholder="Enter institution name..."
              />
            </div>
          ))
        )}

        {/* Add More Button */}
        <button
          onClick={addInstitution}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-cyan-50 transition-colors font-medium text-sm sm:text-base"
        >
          Add More
        </button>
      </div>

      {/* Note Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-900 mb-2">Note:</p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-cyan-700 space-y-1">
          <li>Syncing and sharing of reports requires institutional approval or acceptance.</li>
          <li>Ensure your institutional identity verifying Email is linked to your VeriTalent ID as a form of your consent to the institution.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
          Submit
        </button>
      </div>
    </div>
  );
}

// LPI Reports View Component
function LPIReportsView({ onNavigate }: { onNavigate: (mode: LPIMode) => void }) {
  const [activeFilter, setActiveFilter] = useState<"all" | "internal" | "institutional">("all");

  const reports = [
    {
      id: 1,
      title: "Activity Footprint",
      type: "internal",
      subtitle: "Internal",
      description: "Github contributions - open source",
      date: "08 - Dec - 2025",
    },
    {
      id: 2,
      title: "Portfolios",
      type: "internal",
      subtitle: "Internal",
      description: "Brand Identity & Logo design",
      date: "05 - Dec - 2025",
    },
  ];

  const filteredReports = reports.filter(report => {
    if (activeFilter === "all") return true;
    return report.type === activeFilter;
  });

  return (
    <div>
      {/* Stats Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Your Learning and performance intelligence report
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Placement ID</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">VT-98421-NG</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Internal LPI Report</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Institutional LPI Report</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate("internal-feed")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm sm:text-base">Internal LPI Feed</span>
        </button>
        <button
          onClick={() => onNavigate("institutional-sync")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm sm:text-base">Institutional LPI In-Sync</span>
        </button>
      </div>

      {/* Reports Section */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Reports</h2>
        
        {/* Filter Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("internal")}
            className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === "internal"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Internal LPI Reports
          </button>
          <button
            onClick={() => setActiveFilter("institutional")}
            className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === "institutional"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Institutional LPI Reports
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{report.subtitle}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-700 mb-1">{report.description}</p>
                <p className="text-xs sm:text-sm text-gray-500">{report.date}</p>
              </div>

              <div className="flex justify-end">
                <button className="p-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No reports found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

// =====================
// Components
// =====================
  // =====================
  // Page State
  // =====================
  const [activeTab, setActiveTab] = useState<"references" | "lpi">("references");
  const [pageMode, setPageMode] = useState<PageMode>("dashboard");
  const [lpiMode, setLpiMode] = useState<LPIMode>("reports");

  // 🔑 Single source of truth for modals
  const [activeModal, setActiveModal] = useState<RepositoryType | null>(null);

  // =====================
  // Data
  // =====================
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

  // =====================
  // Render
  // =====================
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
            {/* Stats */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Verified Career Records
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {["Placement ID", "Verified Credentials", "Pending Requests"].map(
                  (label, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-6">
                      <p className="text-sm text-gray-700 mb-1">{label}</p>
                      <p className="text-xl font-bold text-gray-900">
                        {i === 0 ? "VT-98421-NG" : i === 1 ? "6" : "2"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Page Modes */}
            {pageMode === "work-reference" && (
              <>
                <NewRequests
                  onWorkReference={() => setPageMode("work-reference")}
                  onCertificateVerification={() =>
                    setPageMode("certificate-verification")
                  }
                />
                <WorkReferenceComponent
                  onSubmit={() => setPageMode("dashboard")}
                  onCancel={() => setPageMode("dashboard")}
                />
              </>
            )}

            {pageMode === "certificate-verification" && (
              <>
                <NewRequests
                  onWorkReference={() => setPageMode("work-reference")}
                  onCertificateVerification={() =>
                    setPageMode("certificate-verification")
                  }
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
              <>
                <div className="mb-6">
                  <button
                    onClick={() => setPageMode("add-existing")}
                    className="px-6 py-3 bg-brand-primary text-white rounded-lg text-sm text-left flex items-center gap-2 hover:bg-cyan-700 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Add Existing Verifiable Career Record (Listing)
                  </button>
                </div>

                <NewRequests
                  onWorkReference={() => setPageMode("work-reference")}
                  onCertificateVerification={() =>
                    setPageMode("certificate-verification")
                  }
                />

                {/* Repository Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repositories.map((repo, index) => (
                    <div key={index} className="bg-white rounded-lg border p-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-semibold">{repo.type}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${repo.badgeColor}`}
                        >
                          {repo.badge}
                        </span>
                      </div>

                      <div className="mb-4 text-sm">
                        <p className="font-medium">{repo.organization}</p>
                        <p className="text-xs text-gray-600">{repo.subtitle}</p>
                        <p className="text-xs text-gray-600">{repo.period}</p>
                      </div>

                      <div className="flex gap-2">
                        {repo.actions >= 1 && (
                          <button
                            onClick={() => setActiveModal(repo.type)}
                            className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {repo.actions >= 2 && (
                          <button className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {repo.actions >= 3 && (
                          <button className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "lpi" && (
          <>
            {lpiMode === "reports" && (
              <LPIReportsView onNavigate={setLpiMode} />
            )}
            {lpiMode === "internal-feed" && (
              <InternalLPIFeed onBack={() => setLpiMode("reports")} />
            )}
            {lpiMode === "institutional-sync" && (
              <InstitutionalLPISync onBack={() => setLpiMode("reports")} />
            )}
          </>
        )}
      </div>

      Modals
      {activeModal === "Work Reference" && (
        <WorkReferenceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "Membership Reference" && (
        <MembershipReferenceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "Certificate Verification" && (
        <CertificateVerificationModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "Certificate" && (
        <CertificateModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "Work History" && (
        <WorkHistoryModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "Recommendation" && (
        <RecommendationModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  )
}