import React from 'react';
import { X } from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: any;
}


export default function RecommendationModal({ isOpen, onClose, recommendation }: RecommendationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recommendation</h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
              Verified Fully
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Issuer */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Issuer
            </label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {recommendation?.issuer || 'Joshua Zanni'}
            </div>
          </div>

          {/* Talent Name and Timeline */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Talent Name
              </label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {recommendation?.talentName || 'Joshua Zanni'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Timeline
              </label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {recommendation?.timeline || '2021 - 2025'}
              </div>
            </div>
          </div>

          {/* Relationship in context */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Relationship in context
            </label>
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700">
              {recommendation?.relationshipContext || 'I was his direct supervisor at Nestle.'}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Recommendations
            </label>
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700">
              {recommendation?.recommendations || 'lorem ipsum.'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Share
          </button>
          <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// Example usage in parent component:
/*
import { useState } from 'react';
import RecommendationModal from './RecommendationModal';

function ParentComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const handleViewClick = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecommendation(null);
  };

  const sampleRecommendation = {
    issuer: 'Joshua Zanni',
    talentName: 'Joshua Zanni',
    timeline: '2021 - 2025',
    relationshipContext: 'I was his direct supervisor at Nestle.',
    recommendations: 'lorem ipsum.'
  };

  return (
    <>
      <button onClick={() => handleViewClick(sampleRecommendation)}>
        View
      </button>
      
      <RecommendationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recommendation={selectedRecommendation}
      />
    </>
  );
}
*/