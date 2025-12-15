import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/reuseables/text';

export default function JobDescriptionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    aboutRole: 'As a Software Engineer, you will be responsible for designing, developing, and maintaining high-quality software solutions that support our business objectives.',
    keyResponsibilities: [
      'Develop, test and deploy software.',
      'Write clean, efficient code, debug issues.',
      'Collaborate with product, design, and engineering teams.',
      'Ensure performance, security, and scalability.'
    ],
    requiredSkills: [
      'Proficiency in one or more programming languages.',
      'Solid grasp of algorithms, data structures, and databases.',
      'Experience with Git and APIs.',
      'Strong problem-solving and teamwork abilities.'
    ],
    additionalInfo: "You'll join an agile team of engineers, designers, and product managers, contributing to features, sharing knowledge, and growing within a supportive environment."
  });

  const steps = [
    { id: 1, label: 'Post job', active: false },
    { id: 2, label: 'CV Upload', active: false },
    { id: 3, label: 'VeriTalent AI Card ID', active: false },
  ];

  const handleBack = () => {
    console.log('Going back');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
  };

  const handleNext = () => {
    console.log('Proceeding to screening criteria:', formData);
  };

  return (
    <div className="">
      <div className="">
        {/* Tabs
        <div className="bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  step.id === currentStep
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Progress Steps
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-4xl">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step <= 2
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                </div>
                {index < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step < 2 ? 'bg-cyan-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div> */}

        {/* Form Content */}
        <div className="bg-white p-2 lg:p-8 rounded-b-lg">
          <Text variant="SubHeadings" as="h2" className="text-2xl mb-6" color="#111827">
            Job Description
          </Text>

          {/* About the Role */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-gray-900">
              About the Role
            </label>
            <textarea
              rows={4}
              value={formData.aboutRole}
              onChange={(e) => setFormData({ ...formData, aboutRole: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-brand-primary outline-none resize-none"
            />
          </div>

          {/* Key Responsibilities and Required Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Responsibilities */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-900">
                Key Responsibilities
              </label>
              <div className="space-y-2">
                {formData.keyResponsibilities.map((responsibility, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    {responsibility}
                  </div>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-gray-900">
                Required Skills
              </label>
              <div className="space-y-2">
                {formData.requiredSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add More Info */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-gray-900">
              Add More Info(e.g Team context)
            </label>
            <textarea
              rows={4}
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-brand-primary outline-none resize-none"
            />
          </div>

          {/* Action Buttons
          <div className="flex items-center justify-between pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-transparent px-0"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Save Draft
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 py-2 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Next: Screening Criteria
              </Button>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}