import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PostJobForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    employmentType: '',
    location: '',
    otherInfo: '',
    applicationDeadline: '16/09/2025'
  });

  const steps = [
    { id: 1, label: 'Post job', active: true },
    { id: 2, label: 'CV Upload', active: false },
    { id: 3, label: 'VeriTalent AI Card ID', active: false },
  ];

  const handleNext = () => {
    console.log('Form data:', formData);
    // Handle next step logic
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
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
        </div>

        {/* Progress Steps */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-4xl">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step === 1
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                </div>
                {index < 4 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200 rounded"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-8 rounded-b-lg space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Job Basics</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Job ID */}
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-900">
                Job ID
              </label>
              <Input
                id="jobTitle"
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
                Company Name
              </label>
              <Input
                id="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-900">
                Employment Type
              </label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Full Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                Location
              </label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                  <SelectItem value="abuja">Abuja, Nigeria</SelectItem>
                  <SelectItem value="port-harcourt">Port Harcourt, Nigeria</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Other Info */}
          <div className="space-y-2">
            <label htmlFor="otherInfo" className="block text-sm font-medium text-gray-900">
              Other Info (Optional)
            </label>
            <textarea
              id="otherInfo"
              rows={4}
              placeholder="Additional info"
              value={formData.otherInfo}
              onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Application Deadline */}
          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-900">
              Application Deadline
            </label>
            <div className="relative max-w-xs">
              <Input
                id="deadline"
                type="text"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
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
              Next: Job description
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}