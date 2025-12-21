import { X } from 'lucide-react';
import React, { useState } from 'react'
import { Request } from '@/types/dashboard';

interface MembershipReferenceModalProps {
  requestData?: Request;
  viewMode?: "organization" | "talent";
  onClose: () => void;
}

const MembershipReferenceModal = ({ 
  onClose, 
  viewMode = "talent",
  requestData 
}: MembershipReferenceModalProps) => {
  const [declineReason, setDeclineReason] = useState("");

  const handleApprove = () => {
    console.log("Approved", requestData);
    onClose();
  };

  const handleDecline = () => {
    console.log("Declined with reason:", declineReason, requestData);
    onClose();
  };

  const handleShare = () => {
    console.log("Share reference", requestData);
  };

  const handleDownload = () => {
    console.log("Download reference", requestData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end p-2 md:p-4 justify-center">
      {/* Backdrop click closes modal */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[87vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between sticky top-0 p-2 md:p-6 border-b bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Membership Reference</h2>
            <span className="text-sm text-brand-primary font-medium">Active</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-2 md:p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full font-medium">
              Verified Fully
            </span>
          </div>

          {/* Issuer and Talent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Alumni Association
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Jane Doe
              </div>
            </div>
          </div>

          {/* Reference Title and ID Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Title
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Membership
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                12345-AA-NG
              </div>
            </div>
          </div>

          {/* Validity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validity
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              Active(2023 - 2025)
            </div>
          </div>

          {/* Reference In Context / Status in Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {viewMode === "organization" ? "Reference In Context" : "Status in Context"}
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              Member in good standing, dues paid.
            </div>
          </div>

          {/* Reference Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Verification & Audit Trail
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

          {/* Timestamps */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Request Created: 30/07/2020</p>
            <p>Issuance: Pending</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-2 md:p-6 border-t sticky bottom-0 bg-white">
          {viewMode === "organization" ? (
            <>
              <button 
                onClick={handleApprove}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Update
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Revoke
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleShare}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Share
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 px-2 md:px-6 text-sm py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Download
              </button>
              <button 
                className="flex-1 px-2 text-sm md:px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Request Update
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MembershipReferenceModal