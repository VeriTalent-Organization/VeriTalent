import { X } from 'lucide-react';
import React, { useState } from 'react';
import { Request, IssuedRecord } from '@/types/dashboard';

interface CertificateVerificationModalProps {
  onClose: () => void;
  viewMode?: "organization" | "talent";
  requestData?: Request;
  recordData?: IssuedRecord;
}

const CertificateVerificationModal = ({ 
  onClose, 
  viewMode = "talent",
  requestData,
  recordData
}: CertificateVerificationModalProps) => {
  const [declineReason, setDeclineReason] = useState("");

  // Use whichever data is provided
  const data = requestData || recordData;

  const handleApprove = () => {
    console.log("Certificate approved");
    onClose();
  };

  const handleDecline = () => {
    console.log("Certificate declined with reason:", declineReason);
    onClose();
  };

  const handleShare = () => {
    console.log("Share certificate");
  };

  const handleDownload = () => {
    console.log("Download certificate");
  };

  const handleViewCertificate = () => {
    console.log("View uploaded certificate");
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-end p-4 justify-center">
      {/* Backdrop click closes modal */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[100dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between sticky top-0 p-6 border-b bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Certificate Verification
            </h2>
            {viewMode === "organization" && (
              <span className="text-sm text-red-600">
                (Payment confirmation before approval)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full font-medium">
              {data?.status || "Provisional"}
            </span>
          </div>

          {/* Issuer and Talent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                University of Lagos
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                {data?.talent || "Jane Doe"}
              </div>
            </div>
          </div>

          {/* Certificate Title and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Title
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                B.Sc. Computer Science
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Metadata:
              </label>
              <div className="space-y-2">
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Certificate Number: UNILAG/2025/1234
                </div>
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Date Awarded: July 2023
                </div>
              </div>
            </div>
          </div>

          {/* Context Extract */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context Extract
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm space-y-1">
              <p>Holder Name: {data?.talent || "Jane Doe"}</p>
              <p>Certificate Title: B.Sc. Computer Science</p>
              <p>Certificate Number: UNILAG/2023/1234</p>
              <p>Date Awarded: July 2023</p>
              <p>Grade: Second Class Upper</p>
              <p>Issuing Institution: University of Lagos.</p>
            </div>
          </div>

          {/* Upload Scanned Certificate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Scanned Certificate
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">Scanned Certificate Uploaded</p>
                <button 
                  onClick={handleViewCertificate}
                  className="text-brand-primary text-sm font-medium hover:text-cyan-700"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Verification & Audit Trail - Only show for talent view */}
          {viewMode === "talent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification & Audit Trail
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg">
                <a
                  href="#"
                  className="text-brand-primary hover:text-cyan-700 font-medium"
                >
                  Blockchain Hash
                </a>
                <span className="text-gray-500 text-sm ml-2">
                  (0•7a8bB...3ca0)
                </span>
              </div>
            </div>
          )}

          {/* Timestamps - Only show for talent view */}
          {viewMode === "talent" && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>Request Created: {(requestData?.dateSubmitted || recordData?.dateIssued) || "22/07/2024"}</p>
              <p>Issuance: 30/07/2024 (Provisional)</p>
            </div>
          )}

          {/* Approval Instructions - Only show for organization view */}
          {viewMode === "organization" && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Approve:</strong> Check the request input diligently against your organisation record to correct false or wrong claim before clicking approval.
                </p>
                <p>
                  <strong>Decline:</strong> Click on decline and state reason for the decline in the message box.
                </p>
              </div>

              <div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Enter reason for decline (if applicable)..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  maxLength={60}
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {declineReason.length}/60
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Conditional based on viewMode */}
        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-gray-50">
          {viewMode === "talent" ? (
            <>
              <button 
                onClick={handleShare}
                className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Share
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Download
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleApprove}
                className="flex-1 px-6 py-2.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-teal-700 transition font-medium"
              >
                Expired
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 px-6 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Revoked
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateVerificationModal;