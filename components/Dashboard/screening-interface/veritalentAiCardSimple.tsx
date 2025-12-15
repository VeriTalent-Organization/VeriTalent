import React from 'react';
import { Download, ChevronDown } from 'lucide-react';

export default function VeriTalentAICardSimple() {
  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Talent Name:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Jane Doe
              </div>
            </div>
            <div className="flex flex-col items-end justify-end">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Job Market</span>
                <button className="px-4 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium flex items-center gap-1">
                  Active
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">VeriTalent ID:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              Not Available
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Profile Status:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg w-20"></div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">AI Fit Score</span>
              <span className="text-sm font-bold text-gray-900">82%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Other Role Matched:</label>
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Current / Target Role:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Marketing Specialist
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Location:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                Lagos, Nigeria
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Education:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                BSc. Business Administration, University of Lagos
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Linkedin Profile:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Bio:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                Results-driven marketing professional with 5+ years of experience in digital marketing, brand strategy, and content creation. Proven track record of increasing brand awareness and driving customer engagement through data-driven campaigns.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Work Experience Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                5+ years in marketing roles, specialising in digital marketing and brand management. Led campaigns that increased engagement by 45% at Tech Corp.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Education Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                BSc. Business Administration from University of Lagos (2018). Additional certifications in Digital Marketing and SEO Analytics.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Accomplishments:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 space-y-2">
                <div>• Led rebranding campaign resulting in 45% increase in brand awareness</div>
                <div>• Managed marketing budget of $200K+</div>
                <div>• Published 3 industry articles on marketing trends</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <button className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF (VeriTalent AI Card)
          </button>
        </div>
      </div>
    </div>
  );
}