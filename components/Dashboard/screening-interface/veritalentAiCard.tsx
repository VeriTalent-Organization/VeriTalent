import React, { useState } from 'react';
import { Download, ChevronDown, Eye, FileCheck } from 'lucide-react';

export default function VeriTalentAICard() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerAction = (label: string) => {
    setFeedback(`${label} initiated`);
  };

  // TODO: Replace with real data from profiles API for specific talent
  const skills = [
    { name: 'Digital Marketing', verifiedBy: 'AI + References', level: 'Advanced', color: 'bg-green-100 text-green-700' },
    { name: 'SEO & Analytics', verifiedBy: 'Recommendation (Manager)', level: 'Advanced', color: 'bg-green-100 text-green-700' },
    { name: 'Content Strategy', verifiedBy: 'AI', level: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
    { name: 'Communication', verifiedBy: 'AI + Reference + Certificate', level: 'Advanced', color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Veritalent AI card</h1>
          <p className="text-sm text-gray-600">AI-powered Career Insights with Verifiable Credibility.</p>
        </div>

        {/* Talent Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Talent Information</h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Talent Name:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Jane Doe
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Job Market</span>
                <button
                  onClick={() => triggerAction('Job market status')}
                  className="px-4 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  Active
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">VeriTalent ID:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              VT/1345-JD
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Status:</label>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Verified
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">AI Fit Score</span>
              <span className="text-sm font-bold text-gray-900">82%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-brand-primary h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Other Role Matched:</label>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                Marketing Manager
              </span>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                Brand Strategist
              </span>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                Content Lead
              </span>
            </div>
          </div>
        </div>

        {/* Basic Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Profile Info</h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current / Target Role:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Marketing Specialist
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Lagos, Nigeria
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                BSc. Business Administration, University of Lagos
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Linkedin Profile:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-blue-600">
                linkedin.com/in/janedoe
              </div>
            </div>
          </div>
        </div>

        {/* Career Snapshot */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Career Snapshot</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                Results-driven marketing professional with 5+ years of experience in digital marketing, brand strategy, and content creation. Proven track record of increasing brand awareness and driving customer engagement through data-driven campaigns.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                5+ years in marketing roles, specialising in digital marketing and brand management. Led campaigns that increased engagement by 45% at Tech Corp.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                BSc. Business Administration from University of Lagos (2018). Additional certifications in Digital Marketing and SEO Analytics.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accomplishments:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 space-y-1">
                <div>• Led rebranding campaign resulting in 45% increase in brand awareness</div>
                <div>• Managed marketing budget of $200K+</div>
                <div>• Published 3 industry articles on marketing trends</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Competency Signals */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill & Competency Signals (AI + Verified Data)</h2>

          <div className="overflow-x-auto mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Skill</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Verified By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Competency Level</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm text-gray-700">{skill.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{skill.verifiedBy}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${skill.color}`}>
                        {skill.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <span className="font-medium">AI Signal Summary:</span> AI analyses CV data, verified references and activity footprints to rank competencies as Beginner / Intermediate / Advanced or percentage strength scores.
            </p>
          </div>
        </div>

        {/* VeriTalent Repository */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">VeriTalent Repository</h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Affiliation Reference Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Affiliation Reference</h3>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">Pending</span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-700 font-medium">Nigeria Computer Society</p>
                <p className="text-xs text-gray-600">Associate Member</p>
                <p className="text-xs text-gray-600">Expired - Since 2024</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerAction('View affiliation reference')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => triggerAction('Download affiliation reference')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <Download className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => triggerAction('Mark affiliation reference complete')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <FileCheck className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Certificate Verification Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Certificate Verification</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Verified</span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-700 font-medium">University of Lagos</p>
                <p className="text-xs text-gray-600">B.Sc. Computer Science</p>
                <p className="text-xs text-gray-600">Issued - Oct 2020</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerAction('View certificate verification')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => triggerAction('Download certificate verification')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <Download className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => triggerAction('Mark certificate verification complete')}
                  className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <FileCheck className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Certificate</h3>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">Under verification</span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-700 font-medium">Certificate</p>
                <p className="text-xs text-gray-600">Google Digital Certificate</p>
                <p className="text-xs text-gray-600">Jan 2023 - Mar 2024</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => triggerAction('View certificate record')}
                  className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <button
            onClick={() => triggerAction('Download AI card PDF')}
            className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF (VeriTalent AI Card)
          </button>
        </div>

        {feedback && (
          <div className="fixed bottom-4 right-4 z-40 bg-white shadow-lg border border-gray-200 px-4 py-3 rounded-lg text-sm text-gray-800">
            {feedback}
            <button onClick={() => setFeedback(null)} className="ml-3 text-brand-primary font-medium">Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}