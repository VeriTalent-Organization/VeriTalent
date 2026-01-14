import React, { useState } from 'react'
import { Request } from '@/types/dashboard';
import { Spinner } from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      // TODO: Replace with actual API call
      console.log("Approved", requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecline = async () => {
    setIsRevoking(true);
    try {
      // TODO: Replace with actual API call
      console.log("Declined with reason:", declineReason, requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error("Failed to revoke:", error);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // TODO: Replace with actual API call
      console.log("Share reference", requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to share:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Download reference", requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to download:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRequestUpdate = async () => {
    setIsRequestingUpdate(true);
    try {
      // TODO: Replace with actual API call
      console.log("Request update", requestData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to request update:", error);
    } finally {
      setIsRequestingUpdate(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Membership Reference"
      size="lg"
      position="bottom"
    >
      {/* Modal Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
        <div className="flex gap-3 p-2 md:p-6 border-t bg-white">
          {viewMode === "organization" ? (
            <>
              <button 
                onClick={handleApprove}
                disabled={isUpdating || isRevoking}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating && <Spinner className="text-white" />}
                Update
              </button>
              <button 
                onClick={handleDecline}
                disabled={isUpdating || isRevoking}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRevoking && <Spinner className="text-white" />}
                Revoke
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSharing && <Spinner className="text-white" />}
                Share
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 px-2 md:px-6 text-sm py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDownloading && <Spinner className="text-white" />}
                Download
              </button>
              <button 
                onClick={handleRequestUpdate}
                disabled={isRequestingUpdate}
                className="flex-1 px-2 text-sm md:px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRequestingUpdate && <Spinner className="text-white" />}
                Request Update
              </button>
            </>
          )}
        </div>
    </Modal>
  )
}

export default MembershipReferenceModal