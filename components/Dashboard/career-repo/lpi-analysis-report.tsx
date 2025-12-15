import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function LPIAnalysisReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          VeriTalent Internal LPI Analysis Report
        </h1>

        {/* Talent Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Talent Information
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name:
              </label>
              <div className="bg-gray-100 px-4 py-2 rounded">
                Adewale Daniel
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Title:
              </label>
              <div className="bg-gray-100 px-4 py-2 rounded">
                GitHub Contributions - Open Source Projects
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VeriTalent ID:
              </label>
              <div className="bg-gray-100 px-4 py-2 rounded">
                VT-671204
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Reviewed
              </label>
              <div className="bg-gray-100 px-4 py-2 rounded">
                08 Dec 2025
              </div>
            </div>
          </div>
        </div>

        {/* Summary of Submission */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Summary of Submission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The talent&apos;s GitHub footprint includes contributions to multiple open-source repositories, including bug fixes, feature additions, 
            and documentation improvements. The LPI agent analyzed commit history, pull requests, issue resolutions, and repository 
            engagement to evaluate technical competency and collaboration behaviour.
          </p>
        </div>

        {/* Key Competency Signals */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Key Competency Signals
          </h2>

          {/* Technical Skills */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technical Skills
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Programming (Python/Javascript)</span>
              <span className="text-brand-primary font-medium">High</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Version Control (Git/GitHub)</span>
              <span className="text-brand-primary font-medium">High</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Code Review & Collaboration</span>
              <span className="text-brand-primary font-medium">Medium - High</span>
            </div>
          </div>

          {/* Cognitive Skills */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cognitive Skills
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Problem Solving</span>
              <span className="text-brand-primary font-medium">High</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Logical Thinking</span>
              <span className="text-brand-primary font-medium">High</span>
            </div>
          </div>

          {/* Work Behaviours */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Work Behaviours
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Initiative</span>
              <span className="text-brand-primary font-medium">High</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Collaboration</span>
              <span className="text-brand-primary font-medium">Medium - High</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded">
              <span className="text-gray-700">Accountability</span>
              <span className="text-brand-primary font-medium">Medium - High</span>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Strengths
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consistently contributes to active repositories</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Provides well-documented commits and clear pull requests</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Shows initiative by improving features and fixing issues independently</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Engages with other contributors via discussions and issue tracking</span>
            </li>
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Areas for Improvement
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Increase contributions to larger or high-impact projects</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add descriptive comments to all code for clarity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Participate in code reviews more actively to enhance collaboration</span>
            </li>
          </ul>
        </div>

        {/* Overall Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Overall Performance
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Competency Score</span>
              <span className="text-brand-primary text-xl font-bold">87%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Performance Level
            </label>
            <div className="bg-gray-100 px-4 py-2 rounded text-gray-700">
              Proficient - Strong Technical Contributor
            </div>
          </div>
        </div>

        {/* Career Signals */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Career Signals
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The GitHub footprint demonstrates strong coding skills, initiative, and ability to contribute to team projects. The talent is suitable 
            for junior-to mid-level software development, open-source contributions, or backend/frontend engineering roles, with potential 
            to grow into system design or technical leadership positions.
          </p>

          {/* Notes Box */}
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Submission Requirement:</strong> Only publicly acknowledged or administratively verified activities or bodies of work are 
                  accepted for Internal LPI Analysis.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Caveat:</strong> All insights and signals in this report are AI-generated and should be interpreted with this understanding.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Verification
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Status
            </label>
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Accepted</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Type
            </label>
            <div className="bg-gray-100 px-4 py-2 rounded text-gray-700">
              Automated Internal LPI Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}