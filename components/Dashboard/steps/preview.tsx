import React, { useState } from 'react';
import { Text } from "@/components/reuseables/text";

interface PreviewAndPublishProps {
  onNext?: () => void;
  onDataChange?: (data: Record<string, boolean | string>) => void;
}

export default function PreviewAndPublish({ onDataChange }: PreviewAndPublishProps) {
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState('public');

  const handleSaveAsTemplateChange = (checked: boolean) => {
    setSaveAsTemplate(checked);
    onDataChange?.({
      saveAsTemplate: checked,
      visibilityOption
    });
  };

  const handleVisibilityChange = (value: string) => {
    setVisibilityOption(value);
    onDataChange?.({
      saveAsTemplate,
      visibilityOption: value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">

        {/* Preview & Publish Section */}
        <Text variant="SubHeadings" as="h2" className="text-xl mb-6" color="#111827">
          Preview & Publish
        </Text>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Card */}
          <div className="bg-white rounded-lg shadow-sm p-2 lg:p-6">
            <Text variant="SubHeadings" as="h3" className="text-lg mb-6" color="#111827">
              Preview
            </Text>
            
            <div className="bg-white border border-gray-200 rounded-lg p-2 lg:p-6">
              <Text variant="RegularText" as="h4" className="text-xl mb-4" color="#111827">
                Software Engineer
              </Text>
              
              <div className="space-y-2 mb-4">
                <Text variant="SubText" className="font-medium" color="#374151">
                  TechCorp
                </Text>

                <Text variant="SubText" className="text-sm" color="#4b5563">
                  Fountain Hills, Arizona
                </Text>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-emerald-100 text-brand-primary px-4 py-1 rounded-full text-sm font-medium">
                  Full - time
                </span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <Text variant="SubText" className="text-sm" color="#4b5563">
                  We are seeking a highly motivated Software Engineer...
                </Text>
              </div>

              <button className="w-full bg-brand-primary hover:bg-cyan-700 text-white py-3 rounded-lg font-medium">
                Apply Now
              </button>
            </div>
          </div>

          {/* Options Panel */}
          <div className="bg-white rounded-lg shadow-sm p-2 lg:p-6 space-y-6">
            {/* Template Options */}
            <div>
              <Text variant="SubHeadings" as="h3" className="text-base mb-4" color="#111827">
                Template Options
              </Text>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => handleSaveAsTemplateChange(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                />
                <Text variant="SubText" color="#374151">
                  Save as Template for Reuse
                </Text>
              </label>
            </div>

            {/* Visibility Options */}
            <div>
              <Text variant="SubHeadings" as="h3" className="text-base mb-4" color="#111827">
                Visibility Options
              </Text>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="featured"
                    checked={visibilityOption === 'featured'}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    className="mt-0.5 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                  />
                  <Text variant="SubText" color="#374151">
                    Featured Listing on VeriTalent Only
                  </Text>
                </label>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibilityOption === 'public'}
                      onChange={(e) => handleVisibilityChange(e.target.value)}
                      className="mt-0.5 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                    />
                    <Text variant="SubText" className="font-medium" color="#374151">
                      Public (Default)
                    </Text>

                    <Text variant="SubText" className="text-sm" color="#6b7280">
                      Promote on Social Media
                    </Text>
                  </label>
                </div>
              </div>
            </div>

            {/* Job ID Info */}
            <div className="pt-4 border-t border-gray-200">
              <Text variant="SubText" className="text-sm mb-2" color="#374151">
                Job ID will be generated after Publishing
              </Text>

              <Text variant="SubText" className="text-sm" color="#6b7280">
                Example: VT-1247
              </Text>
            </div>

            {/* Shareable Link */}
            <div className="pt-4 border-t border-gray-200">
              <Text variant="SubHeadings" as="h3" className="text-base mb-2" color="#111827">
                Shareable Link
              </Text>

              <Text variant="SubText" className="text-sm" color="#4b5563">
                Shareable link will be available after publishing
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}