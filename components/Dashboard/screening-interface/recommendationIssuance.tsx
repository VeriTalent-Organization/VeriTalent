"use client";
import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import RecommendationModal from './recommendationModal';

export default function RecommendationIssuance() {
  const [activeTab, setActiveTab] = useState('new');
  const [talentName, setTalentName] = useState('');
  const [talentEmail, setTalentEmail] = useState('');
  const [relationshipTimeline, setRelationshipTimeline] = useState('2021 - 2025');
  const [relationshipContext, setRelationshipContext] = useState('I was his direct supervisor at Nestle.');
  const [recommendations, setRecommendations] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  // Sample recommendations data
  const issuedRecommendations = [
    {
      issuer: 'Current User',
      talentName: 'Hakeem Adetiba',
      dateIssued: '03-may-2024',
      timeline: '2020 - 2024',
      relationshipContext: 'I worked directly with Hakeem as his team lead for 4 years.',
      recommendations: 'Hakeem is an exceptional developer with strong problem-solving skills. He consistently delivered high-quality work and was always willing to help team members.'
    },
    {
      issuer: 'Current User',
      talentName: 'Joshua Zanni',
      dateIssued: '09-mar-2024',
      timeline: '2021 - 2025',
      relationshipContext: 'I was his direct supervisor at Nestle.',
      recommendations: 'Joshua demonstrated excellent leadership qualities and technical expertise throughout our time working together. His dedication to quality and team collaboration was outstanding.'
    },
    {
      issuer: 'Current User',
      talentName: 'Julius Abari',
      dateIssued: '17-Jan-2024',
      timeline: '2019 - 2024',
      relationshipContext: 'Julius reported to me as a senior engineer for 5 years.',
      recommendations: 'Julius is a highly skilled engineer with deep technical knowledge. He has mentored junior developers and contributed significantly to our architecture decisions.'
    }
  ];

  const handleViewClick = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecommendation(null);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Issue trustable professional recommendation</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-1">Issued Recommendations</p>
            <p className="text-3xl font-bold text-gray-900">4</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-1">Revoked</p>
            <p className="text-3xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'new'
              ? 'bg-cyan-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Plus className="w-5 h-5" />
            New Issuance
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'issued'
              ? 'bg-cyan-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FileText className="w-5 h-5" />
            Issued Recommendations
          </button>
        </div>

        {/* New Issuance Form */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">New Issuance</h2>

            <div className="space-y-6">
              {/* Talent Name and Email */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Talent Name
                  </label>
                  <input
                    type="text"
                    value={talentName}
                    onChange={(e) => setTalentName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Talent Email
                  </label>
                  <input
                    type="email"
                    value={talentEmail}
                    onChange={(e) => setTalentEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Relationship Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Relationship Timeline
                </label>
                <input
                  type="text"
                  value={relationshipTimeline}
                  onChange={(e) => setRelationshipTimeline(e.target.value)}
                  placeholder="2021 - 2025"
                  className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-500"
                />
              </div>

              {/* Relationship in Context */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Relationship in Context
                </label>
                <div className="relative">
                  <textarea
                    value={relationshipContext}
                    onChange={(e) => setRelationshipContext(e.target.value)}
                    placeholder="I was his direct supervisor at Nestle."
                    rows={4}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-500"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {relationshipContext.length}/100
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Recommendations
                </label>
                <div className="relative">
                  <textarea
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {recommendations.length}/500
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
                  Submit for Reference
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issued Recommendations Tab */}
        {activeTab === 'issued' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Issued Recommendations</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Talents Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date Issued
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issuedRecommendations.map((rec, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {rec.talentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {rec.dateIssued}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleViewClick(rec)}
                            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            View
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
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
