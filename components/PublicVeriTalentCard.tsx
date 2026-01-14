'use client';

import React, { useState, useEffect } from 'react';
import { TalentCardData } from '@/types/dashboard';
import { competencyService, CompetencySignal } from '@/lib/services/competencyService';

interface PublicVeriTalentCardProps {
  shareToken: string;
}

const defaultTalentData: TalentCardData = {
  name: "Loading...",
  id: "Loading...",
  role: "Loading...",
  location: "Loading...",
  education: "No education data available",
  linkedin: "Not provided",
  bio: "No bio available",
  workExperience: "No work experience data available",
  educationSummary: "No education summary available",
  accomplishments: [],
  aiFitScore: 0,
  careerSignalStrength: 0,
  matchedRoles: [],
  skillGaps: [],
  growthRecommendations: "No recommendations available"
};

const PublicVeriTalentCard: React.FC<PublicVeriTalentCardProps> = ({ shareToken }) => {
  const [talentData, setTalentData] = useState<TalentCardData>(defaultTalentData);
  const [competencySignals, setCompetencySignals] = useState<CompetencySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPublicProfile = async () => {
      try {
        // TODO: Call backend API to get public profile data by share token
        // const response = await apiClient.get(`/ai-card/public/${shareToken}`);
        // const profileData = response.data;

        // For now, use mock data
        const mockProfileData = {
          name: "John Doe",
          id: "VT-2024-001",
          role: "Senior Digital Marketing Specialist",
          location: "Lagos, Nigeria",
          education: "B.Sc. Computer Science, University of Lagos",
          linkedin: "linkedin.com/in/johndoe",
          bio: "Experienced digital marketing professional with 5+ years in SEO, content strategy, and analytics. Proven track record of driving organic growth and improving conversion rates.",
          workExperience: "Senior Marketing Manager at TechCorp (2022-Present), Digital Marketing Specialist at StartupXYZ (2020-2022)",
          educationSummary: "B.Sc. Computer Science, University of Lagos (2016-2020)",
          accomplishments: ["Increased organic traffic by 150%", "Led successful rebranding campaign", "Managed $500K+ marketing budget"],
          aiFitScore: 92,
          careerSignalStrength: 88,
          matchedRoles: ["Digital Marketing Manager", "Growth Hacker", "Marketing Director"],
          skillGaps: ["Advanced Analytics", "Data Science"],
          growthRecommendations: "Consider certifications in Google Analytics and data visualization tools to bridge skill gaps."
        };

        setTalentData(mockProfileData);

        // Load mock competency signals
        const mockSignals = competencyService.getMockCompetencySignals();
        setCompetencySignals(mockSignals);

      } catch (err: any) {
        console.error('Failed to load public profile:', err);
        setError('Failed to load profile. The link may be expired or invalid.');
      } finally {
        setLoading(false);
      }
    };

    loadPublicProfile();
  }, [shareToken]);

  const skills = competencySignals.length > 0 ? competencySignals.map(signal => ({
    name: signal.skill,
    verifiedBy: signal.verifiedBy === 'AI' ? 'AI Analysis' :
                signal.verifiedBy === 'Reference' ? 'Professional Reference' :
                signal.verifiedBy === 'Certificate' ? 'Verified Certificate' :
                signal.verifiedBy === 'LPI' ? 'LPI Assessment' :
                signal.verifiedBy === 'Experience' ? 'Work Experience' : signal.verifiedBy,
    level: signal.level.charAt(0).toUpperCase() + signal.level.slice(1),
    color: signal.level === 'advanced' ? 'bg-green-100 text-green-700' :
           signal.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
           'bg-gray-100 text-gray-700',
    score: signal.score
  })) : [
    { name: 'Digital Marketing', verifiedBy: 'AI + References', level: 'Advanced', color: 'bg-green-100 text-green-700', score: 85 },
    { name: 'SEO & Analytics', verifiedBy: 'Recommendation (Manager)', level: 'Advanced', color: 'bg-green-100 text-green-700', score: 88 },
    { name: 'Content Strategy', verifiedBy: 'AI', level: 'Intermediate', color: 'bg-blue-100 text-blue-700', score: 72 },
    { name: 'Communication', verifiedBy: 'AI + Reference + Certificate', level: 'Advanced', color: 'bg-green-100 text-green-700', score: 90 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Veritalent AI card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <p className="text-gray-600">Please check the link or contact the profile owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="veritalent-card-content bg-white rounded-lg shadow-lg p-6 sm:p-8">
      {/* Talent Information Card */}
      <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Talent Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Talent Name:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">VeriTalent ID:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.id}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Profile Status:</label>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            Verified
          </span>
        </div>

        {/* AI Fit Score */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">AI Fit Score</span>
            <span className="text-sm font-bold text-gray-900">{talentData.aiFitScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full"
              style={{ width: `${talentData.aiFitScore}%` }}
            ></div>
          </div>
        </div>

        {/* Other Roles Matched */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Other Role Matched:</label>
          <div className="flex flex-wrap gap-2">
            {talentData.matchedRoles?.map((role, index) => (
              <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Profile Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Profile Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Current / Target Role:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.role}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Location:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Education:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.education}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Linkedin Profile:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-blue-600 break-all">
              {talentData.linkedin}
            </div>
          </div>
        </div>
      </div>

      {/* Career Snapshot */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Career Snapshot</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Bio:</label>
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
              {talentData.bio}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Work Experience Summary:</label>
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
              {talentData.workExperience}
            </div>
          </div>
        </div>
      </div>

      {/* Competency Signals */}
      {skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Competency Signals</h2>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-sm text-gray-700">{skill.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{skill.verifiedBy}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${skill.color}`}>
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {skill.score ? `${skill.score}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{skill.name}</h3>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${skill.color} mb-1`}>
                      {skill.level}
                    </span>
                    {skill.score && (
                      <div className="text-xs text-gray-500">{skill.score}%</div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600">Verified by: {skill.verifiedBy}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-xs sm:text-sm text-green-800">
              <span className="font-medium">AI Signal Summary:</span> Competency levels are calculated from multiple verified sources including AI CV analysis, professional references, LPI assessments, certificates, and work experience duration. Higher scores indicate stronger validation across multiple sources.
            </p>
          </div>
        </div>
      )}

      {/* AI Insights & Growth Path */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Growth Path</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Skill Gaps:</label>
          <div className="flex flex-wrap gap-2">
            {talentData.skillGaps?.map((gap, index) => (
              <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm">{gap}</span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Growth Recommendations:</label>
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700">
            {talentData.growthRecommendations}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-900">Career Signal Strength</label>
            <span className="text-sm font-bold text-gray-900">{talentData.careerSignalStrength}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div className="bg-brand-primary h-3 rounded-full" style={{ width: `${talentData.careerSignalStrength}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVeriTalentCard;