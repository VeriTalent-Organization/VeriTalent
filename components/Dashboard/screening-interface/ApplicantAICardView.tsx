import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { aiCardService, RecruiterViewDto } from '@/lib/services/aiCardService';

interface ApplicantAICardViewProps {
  veritalentId: string;
  applicantName: string;
  onBack: () => void;
}

const ApplicantAICardView: React.FC<ApplicantAICardViewProps> = ({
  veritalentId,
  applicantName,
  onBack
}) => {
  const [data, setData] = useState<RecruiterViewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cardData = await aiCardService.getRecruiterView(veritalentId);
        setData(cardData);
      } catch (err) {
        console.error('Failed to fetch AI card data:', err);
        setError('Failed to load AI card data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [veritalentId]);

  const handleShare = async () => {
    try {
      const result = await aiCardService.generateShareLink(veritalentId);
      navigator.clipboard.writeText(result.shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to generate share link:', err);
      alert('Failed to generate share link');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await aiCardService.downloadPDF(veritalentId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName}-AI-Card.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading AI Card...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error || 'Failed to load AI card'}</div>
          </div>
        </div>
      </div>
    );
  }

  const { talentData, fitScore, competencySignals } = data;

  return (
    <div className="flex-1 bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Screening
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {applicantName}&apos;s VeriTalent AI Card
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered Career Insights with Verifiable Credibility.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Fit Score Banner */}
        {fitScore && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">AI Fit Score</h3>
                <p className="text-blue-700">Based on job requirements analysis</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">{fitScore}%</div>
            </div>
          </div>
        )}

        {/* Talent Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Talent Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Talent Name:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VeriTalent ID:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.id}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Role:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.role}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.location}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {talentData.bio}
            </div>
          </div>
        </div>

        {/* Competency Signals */}
        {competencySignals && competencySignals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Competency Signals</h2>
            <div className="space-y-4">
              {competencySignals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{signal.skill}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        signal.level === 'advanced' ? 'bg-green-100 text-green-700' :
                        signal.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {signal.level}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Verified by: {signal.verifiedBy}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{signal.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
          <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700 whitespace-pre-line">
            {talentData.workExperience}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
          <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700 whitespace-pre-line">
            {talentData.education}
          </div>
        </div>

        {/* Skills */}
        {talentData.skills && talentData.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {talentData.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${skill.color}`}>
                      {skill.level}
                    </span>
                    <span className="text-xs text-gray-600">({skill.verifiedBy})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accomplishments */}
        {talentData.accomplishments && talentData.accomplishments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Accomplishments</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {talentData.accomplishments.map((accomplishment, index) => (
                <li key={index}>{accomplishment}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Career Insights */}
        {talentData.growthRecommendations && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Career Insights</h2>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700 whitespace-pre-line">
              {talentData.growthRecommendations}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantAICardView;