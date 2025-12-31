import React, { useState } from 'react'
import { Spinner } from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

interface RecommendationModalProps {
  onClose: () => void;
}

const RecommendationModal = ({ onClose }: RecommendationModalProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // TODO: Replace with actual API call
      console.log("Share recommendation");
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
      console.log("Download recommendation");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to download:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Recommendation"
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

          {/* Issuer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuer
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              Joshua Zanni
            </div>
          </div>

          {/* Talent Name and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Joshua Zanni
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                2021 - 2025
              </div>
            </div>
          </div>

          {/* Relationship in context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship in context
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              I was his direct supervisor at Nestle.
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendations
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              lorem ipsum.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-gray-50">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSharing && <Spinner className="text-white" />}
            Share
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDownloading && <Spinner className="text-white" />}
            Download
          </button>
        </div>
    </Modal>
  )
}

export default RecommendationModal;