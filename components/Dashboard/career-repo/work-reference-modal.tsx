"use client";

import React, { useState } from "react";
import { Request, IssuedRecord } from "@/types/dashboard";
import { Spinner } from "@/components/ui/spinner";
import Modal from "@/components/ui/modal";

interface WorkReferenceModalProps {
  onClose: () => void;
  viewMode?: "organization" | "talent";
  requestData?: Request;
  recordData?: IssuedRecord;
}

const WorkReferenceModal = ({ 
  onClose, 
  viewMode = "talent",
  requestData,
  recordData
}: WorkReferenceModalProps) => {
  const [declineReason, setDeclineReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);

  // Use whichever data is provided
  const data = requestData || recordData;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // TODO: Replace with actual API call
      // await referencesService.approve(data?.id);
      console.log("Approved", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error("Failed to approve:", error);
      // TODO: Show error message to user
    } finally {
      setIsApproving(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      // TODO: Show validation error
      return;
    }
    setIsDeclining(true);
    try {
      // TODO: Replace with actual API call
      // await referencesService.decline(data?.id, declineReason);
      console.log("Declined with reason:", declineReason, data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error("Failed to decline:", error);
      // TODO: Show error message to user
    } finally {
      setIsDeclining(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // TODO: Replace with actual API call
      // await referencesService.share(data?.id);
      console.log("Share reference", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
      // await referencesService.download(data?.id);
      console.log("Download reference", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
      // await referencesService.requestUpdate(data?.id);
      console.log("Request update", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
      title={data?.credentialType || "Work Reference"}
      size="lg"
      position="bottom"
      showCloseButton={true}
    >
      {/* Modal Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Status Badge */}
        <div className="flex justify-end">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-full font-medium">
            {data?.status || "Pending"}
          </span>
        </div>

          {/* Issuer and Talent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                ABC Corp
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                {data?.talent || "Jane Doe"}
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className={viewMode === "organization" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role & Department
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                Developer, Engineering
              </div>
            </div>

            {/* Employment Type - Show side by side for organization view */}
            {viewMode === "organization" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <div className="space-y-2">
                  <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                    Internship
                  </div>
                  <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                    Onsite
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employment Type - Show separately for talent view */}
          {viewMode === "talent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <div className="space-y-2">
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Internship
                </div>
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Onsite
                </div>
              </div>
            </div>
          )}

          {/* Employment Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Period (Start)
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                Jan 2018
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Period (End)
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                Jun 2018
              </div>
            </div>
          </div>

          {/* Responsibilities & Accomplishments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities & Accomplishments
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm">
              <p>Developed API services</p>
              <p>Led 5 person dev team</p>
              <p>Implemented CI/CD pipeline</p>
            </div>
          </div>

          {/* Reference Verification - Only show for talent view */}
          {viewMode === "talent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Verification & Audit Trail
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg">
                <a
                  href="#"
                  className="text-brand-primary hover:text-cyan-700 font-medium text-sm"
                >
                  Blockchain Hash
                </a>
                <span className="text-gray-500 text-xs sm:text-sm ml-2">
                  (0•7a8bB...3ca0)
                </span>
              </div>
            </div>
          )}

          {/* Timestamps - Only show for talent view */}
          {viewMode === "talent" && (
            <div className="text-xs sm:text-sm text-gray-500 space-y-1">
              <p>Request Created: {(requestData?.dateSubmitted || recordData?.dateIssued) || "01/12/2022"}</p>
              <p>Issuance: 02/01/2023</p>
              <p>Updated(1): 10/10/2023</p>
              <p>Updated(2): 23/01/2024</p>
            </div>
          )}

          {/* Approval Instructions - Only show for organization view */}
          {viewMode === "organization" && (
            <div className="space-y-4">
              <div className="text-xs sm:text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Approve:</strong> Check the request input diligently against your organisation record to correct false or wrong claim before clicking approval.
                </p>
                <p>
                  <strong>Decline:</strong> Click on decline and state reason for the decline in the message box.
                </p>
              </div>

              <div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none text-sm"
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
        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0">
          {viewMode === "talent" ? (
            <>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 px-3 sm:px-6 py-2.5 text-xs sm:text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSharing && <Spinner className="text-white" />}
                Share
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 px-3 sm:px-6 text-xs sm:text-sm py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDownloading && <Spinner className="text-white" />}
                Download
              </button>
              <button 
                onClick={handleRequestUpdate}
                disabled={isRequestingUpdate}
                className="flex-1 px-3 text-xs sm:text-sm sm:px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRequestingUpdate && <Spinner className="text-white" />}
                Request Update
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleApprove}
                disabled={isApproving || isDeclining}
                className="flex-1 px-4 sm:px-6 py-2.5 text-xs sm:text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApproving && <Spinner className="text-white" />}
                Approve
              </button>
              <button 
                onClick={handleDecline}
                disabled={isApproving || isDeclining}
                className="flex-1 px-4 sm:px-6 py-2.5 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeclining && <Spinner className="text-white" />}
                Decline
              </button>
            </>
          )}
        </div>
    </Modal>
  );
};

export default WorkReferenceModal;