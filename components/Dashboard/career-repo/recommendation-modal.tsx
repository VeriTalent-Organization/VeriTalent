import { X } from 'lucide-react';
import React from 'react'
// import RecommendationModal from '../screening-interface/recommendationModal';

interface RecommendationModalProps {
  onClose: () => void;
}

const RecommendationModal = ({ onClose }: RecommendationModalProps) => {

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end p-4 justify-center">
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
        <div className="flex items-center justify-between sticky top-0 p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recommendation</h2>
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
          <button className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Share
          </button>
          <button className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationModal;