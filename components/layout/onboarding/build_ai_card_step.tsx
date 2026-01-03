'use client';

import React, { useState, useRef } from 'react';
import { Cloud, Linkedin, FileText } from 'lucide-react';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

interface BuildAICardStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}


type OnboardingStepComponent = React.FC<BuildAICardStepProps> & {
  hideParentButtons?: boolean
}

const BuildAICardStep: OnboardingStepComponent = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkedLinkedIn, setLinkedLinkedIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const [veritalentId] = useState(() => {
    if (user?.veritalent_id) return user.veritalent_id;
    return `VT/${Math.floor(Math.random() * 10000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  });

  // Handle file drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setUploadedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleLinkedInConnect = async () => {
    setIsUploading(true);
    // Simulate LinkedIn connection
    setTimeout(() => {
      setLinkedLinkedIn(true);
      setIsUploading(false);
      updateUser({
        linkedin_connected: true,
        veritalent_id: veritalentId
      });
    }, 1500);
  };

  const handleProceedToDashboard = () => {
    if (uploadedFile || linkedLinkedIn) {
      updateUser({
        cv_uploaded: uploadedFile ? true : false,
        linkedin_connected: linkedLinkedIn,
        veritalent_id: veritalentId,
        cv_file: uploadedFile || undefined,
        cv_source: uploadedFile ? 'upload' : linkedLinkedIn ? 'linkedin' : undefined
      });
      onNext();
    }
  };

  const isComplete = uploadedFile || linkedLinkedIn;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Build your VeriTalent AI Card
        </h1>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <FileText className="w-5 h-5 text-gray-600 shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Your VeriTalent ID</p>
            <p className="font-mono font-bold text-gray-900">{veritalentId}</p>
          </div>
        </div>

        <p className="text-gray-700 text-base sm:text-lg">
          Upload your CV or import from LinkedIn to generate your AI-powered career profile
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Upload CV Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Upload CV</h2>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition ${
              dragActive
                ? 'border-brand-primary bg-brand-primary/5'
                : 'border-gray-300 hover:border-brand-primary hover:bg-gray-50'
            } ${uploadedFile ? 'bg-green-50 border-green-300' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload CV"
            />

            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium mt-2"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Cloud className="w-12 h-12 text-gray-400" />
                <p className="font-semibold text-gray-900">Click to Upload or drag and drop</p>
                <p className="text-sm text-gray-600">PDF, DOC or DOCX (MAX. 10MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-600 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* LinkedIn Section */}
        <div className="p-6 sm:p-8 border border-blue-200 bg-blue-50 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Import from linkedin</h2>
          <p className="text-gray-700 mb-6">
            Instantly sync your profile, experience, and skills
          </p>
          
          {linkedLinkedIn ? (
            <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-300 rounded-lg">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-green-800">LinkedIn profile connected successfully!</p>
            </div>
          ) : (
            <button
              onClick={handleLinkedInConnect}
              disabled={isUploading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
            >
              <Linkedin className="w-5 h-5" />
              {isUploading ? 'Connecting...' : 'Connect linkedin'}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-brand-primary font-bold">•</span>
              <span>Your CV will be parsed by our AI to extract key information</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-primary font-bold">•</span>
              <span>Your VeriTalent AI Card will be generated with skills, experience, and competency signals</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-primary font-bold">•</span>
              <span>You can request references and connect with employers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            Back
          </button>
        )}
        <button
          onClick={handleProceedToDashboard}
          disabled={!isComplete || isUploading}
          className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
        >
          Proceed to Dashboard
        </button>
      </div>
    </div>
  );
};

(BuildAICardStep).hideParentButtons = true;

export default BuildAICardStep;
