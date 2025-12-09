import React, { useState } from 'react';

export default function PreviewAndPublish() {
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState('public');

  const steps = [
    { id: 1, label: 'Post job', completed: true },
    { id: 2, label: 'CV Upload', completed: true },
    { id: 3, label: 'VeriTalent AI Card ID', completed: true },
    { id: 4, label: 'Application Instructions', completed: true },
    { id: 5, label: 'Preview & Publish', completed: true }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">

        {/* Preview & Publish Section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview & Publish</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Preview</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Software Engineer</h4>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-700 font-medium">TechCorp</p>
                <p className="text-gray-600 text-sm">Fountain Hills, Arizona</p>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-emerald-100 text-brand-primary px-4 py-1 rounded-full text-sm font-medium">
                  Full - time
                </span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-gray-600 text-sm">We are seeking a highly motivated Software Engineer...</p>
              </div>

              <button className="w-full bg-brand-primary hover:bg-cyan-700 text-white py-3 rounded-lg font-medium">
                Apply Now
              </button>
            </div>
          </div>

          {/* Options Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Template Options */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Template Options</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                />
                <span className="text-gray-700">Save as Template for Reuse</span>
              </label>
            </div>

            {/* Visibility Options */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Visibility Options</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="featured"
                    checked={visibilityOption === 'featured'}
                    onChange={(e) => setVisibilityOption(e.target.value)}
                    className="mt-0.5 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-gray-700">Featured Listing on VeriTalent Only</span>
                </label>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibilityOption === 'public'}
                      onChange={(e) => setVisibilityOption(e.target.value)}
                      className="mt-0.5 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">Public (Default)</span>
                      <p className="text-gray-500 text-sm">Promote on Social Media</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Job ID Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm mb-2">Job ID will be generated after Publishing</p>
              <p className="text-gray-500 text-sm">Example: VT-1247</p>
            </div>

            {/* Shareable Link */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Shareable Link</h3>
              <p className="text-gray-600 text-sm">Shareable link will be available after publishing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}