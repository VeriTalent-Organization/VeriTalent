import React from "react";
import { FileText, Award } from "lucide-react";

interface NewRequestsSectionProps {
  onWorkReference: () => void;
  onCertificateVerification: () => void;
}

export default function NewRequestsSection({
  onWorkReference,
  onCertificateVerification,
}: NewRequestsSectionProps) {
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