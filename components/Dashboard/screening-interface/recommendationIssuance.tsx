"use client";
import React, { useState, useEffect } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { referencesService } from '@/lib/services/referencesService';

interface Recommendation {
  issuer: string;
  talentName: string;
  dateIssued: string;
  timeline: string;
  relationshipContext: string;
  recommendations: string;
}

function RecommendationModal({ isOpen, onClose, recommendation }: { 
  isOpen: boolean; 
  onClose: () => void; 
  recommendation: Recommendation | null;
}) {
  if (!isOpen || !recommendation) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[100dvh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recommendation Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Talent Name</p>
            <p className="text-sm sm:text-base text-gray-900 mt-1">{recommendation.talentName}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Date Issued</p>
            <p className="text-sm sm:text-base text-gray-900 mt-1">{recommendation.dateIssued}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Timeline</p>
            <p className="text-sm sm:text-base text-gray-900 mt-1">{recommendation.timeline}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Relationship Context</p>
            <p className="text-sm sm:text-base text-gray-900 mt-1">{recommendation.relationshipContext}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Recommendations</p>
            <p className="text-sm sm:text-base text-gray-900 mt-1">{recommendation.recommendations}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationIssuance() {
  const [activeTab, setActiveTab] = useState('new');
  const [talentName, setTalentName] = useState('');
  const [talentEmail, setTalentEmail] = useState('');
  const [relationshipTimeline, setRelationshipTimeline] = useState('2021 - 2025');
  const [relationshipContext, setRelationshipContext] = useState('I was his direct supervisor at Nestle.');
  const [recommendations, setRecommendations] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [issuedRecommendations, setIssuedRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssuedRecommendations = async () => {
      try {
        const data = await referencesService.getIssued();
        // Transform the data to match the interface
        const transformed = data.map((ref: any) => ({
          issuer: ref.issuer || 'Current User',
          talentName: ref.talentName || ref.title,
          dateIssued: ref.dateIssued || new Date(ref.dateSubmitted).toLocaleDateString(),
          timeline: ref.timeline || `${ref.startDate} - ${ref.endDate}`,
          relationshipContext: ref.relationshipContext || ref.message,
          recommendations: ref.recommendations || ref.description,
        }));
        setIssuedRecommendations(transformed);
      } catch (error) {
        console.error('Failed to fetch issued recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedRecommendations();
  }, []);

  const handleViewClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecommendation(null);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Issue trustable professional recommendation
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Issued Recommendations</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">4</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Request-Led Issuance</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">2</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">Revoked</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'new'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Direct Issuance
          </button>
          <button
            onClick={() => setActiveTab('Request')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'Request'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Request-Led Issuance
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'issued'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Issued Recommendations
          </button>
        </div>

        {/* New Issuance Form */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">New Issuance</h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Talent Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Talent Name
                  </label>
                  <input
                    type="text"
                    value={talentName}
                    onChange={(e) => setTalentName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Talent Email
                  </label>
                  <input
                    type="email"
                    value={talentEmail}
                    onChange={(e) => setTalentEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Relationship Timeline */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Relationship Timeline
                </label>
                <input
                  type="text"
                  value={relationshipTimeline}
                  onChange={(e) => setRelationshipTimeline(e.target.value)}
                  placeholder="2021 - 2025"
                  className="w-full sm:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-500 text-sm sm:text-base"
                />
              </div>

              {/* Relationship in Context */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Relationship in Context
                </label>
                <div className="relative">
                  <textarea
                    value={relationshipContext}
                    onChange={(e) => setRelationshipContext(e.target.value)}
                    placeholder="I was his direct supervisor at Nestle."
                    rows={4}
                    maxLength={100}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-500 text-sm sm:text-base"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-400">
                    {relationshipContext.length}/100
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Recommendations
                </label>
                <div className="relative">
                  <textarea
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-400">
                    {recommendations.length}/500
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
                  Submit for Reference
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Request' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">New Issuance</h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Talent Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Talent Name
                  </label>
                  <input
                    type="text"
                    value={talentName}
                    onChange={(e) => setTalentName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Talent Email
                  </label>
                  <input
                    type="email"
                    value={talentEmail}
                    onChange={(e) => setTalentEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Relationship Timeline */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Relationship Timeline
                </label>
                <input
                  type="text"
                  value={relationshipTimeline}
                  onChange={(e) => setRelationshipTimeline(e.target.value)}
                  placeholder="2021 - 2025"
                  className="w-full sm:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-500 text-sm sm:text-base"
                />
              </div>

              {/* Relationship in Context */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Relationship in Context
                </label>
                <div className="relative">
                  <textarea
                    value={relationshipContext}
                    onChange={(e) => setRelationshipContext(e.target.value)}
                    placeholder="I was his direct supervisor at Nestle."
                    rows={4}
                    maxLength={100}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-500 text-sm sm:text-base"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-400">
                    {relationshipContext.length}/100
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Recommendations
                </label>
                <div className="relative">
                  <textarea
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-400">
                    {recommendations.length}/500
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
                  Submit for Reference
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issued Recommendations Tab */}
        {activeTab === 'issued' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Issued Recommendations</h2>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {issuedRecommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{rec.talentName}</p>
                      <p className="text-xs text-gray-500 mt-1">{rec.dateIssued}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button 
                      onClick={() => handleViewClick(rec)}
                      className="flex-1 text-sm text-cyan-600 hover:text-cyan-700 font-medium py-2 border border-cyan-600 rounded-lg"
                    >
                      View
                    </button>
                    <button className="flex-1 text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-600 rounded-lg">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Talents Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Date Issued
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issuedRecommendations.map((rec, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-700">
                        {rec.talentName}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-700">
                        {rec.dateIssued}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <button 
                            onClick={() => handleViewClick(rec)}
                            className="text-xs sm:text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            View
                          </button>
                          <button className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium">
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <RecommendationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recommendation={selectedRecommendation}
      />
    </div>
  );
}