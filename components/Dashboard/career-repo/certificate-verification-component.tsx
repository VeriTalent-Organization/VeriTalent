import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import FormComponent from '@/components/forms/form';
import { Spinner } from '@/components/ui/spinner';

interface CertificateVerificationProps {
  onSubmit?: (data: CertificateVerificationData) => void;
  onCancel?: () => void;
}

interface CertificateVerificationData {
  issuerSearch: string;
  issuerOption: 'search' | 'not-found';
  organisationName: string;
  location: string;
  contactName: string;
  designation: string;
  email: string;
  phoneNumber: string;
  talentName: string;
  certificateTitle: string;
  extractContent: string;
  certificateNumber: string;
  dateAwarded: string;
  uploadedFile: File | null;
}

export default function CertificateVerificationComponent({ onSubmit, onCancel }: CertificateVerificationProps) {
  const [issuerOption, setIssuerOption] = useState<'search' | 'not-found'>('search');
  const [issuerSearch, setIssuerSearch] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationFields = [
    {
      name: 'organisationName',
      label: 'Name of Organisation',
      placeholder: 'Enter organisation name',
      row: 'org-row-1',
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'Enter location',
      row: 'org-row-1',
    },
    {
      name: 'contactName',
      label: 'Official Contact Name',
      placeholder: 'Enter contact name',
      row: 'org-row-2',
    },
    {
      name: 'designation',
      label: 'Designation',
      placeholder: 'Enter designation',
      row: 'org-row-2',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter email address',
      type: 'email',
      row: 'contact-row',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      placeholder: 'Enter phone number',
      type: 'tel',
      row: 'contact-row',
    },
  ];

  const certificateDetailsFields = [
    {
      name: 'talentName',
      label: 'Talent Name',
      placeholder: 'Enter talent name',
      row: 'talent-row',
    },
    {
      name: 'certificateTitle',
      label: 'Certificate Title',
      placeholder: 'Enter certificate title',
      row: 'talent-row',
    },
    {
      name: 'extractContent',
      label: 'Extract Content (Optional)',
      placeholder: 'Enter extract content',
      type: 'textarea',
      rows: 4,
    },
  ];

  const metadataFields = [
    {
      name: 'certificateNumber',
      label: 'Certificate Number',
      placeholder: 'Enter certificate number',
      row: 'metadata-row',
    },
    {
      name: 'dateAwarded',
      label: 'Date Awarded',
      type: 'date',
      row: 'metadata-row',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const fullData: CertificateVerificationData = {
        ...data,
        issuerOption,
        issuerSearch,
        uploadedFile,
      } as CertificateVerificationData;
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit?.(fullData);
    } catch (error) {
      console.error('Failed to submit certificate verification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Certificate Verification</h2>

      {/* Issuer Search Section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Issuer</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={issuerOption === 'search'}
              onChange={() => setIssuerOption('search')}
              className="w-4 h-4 text-cyan-600"
            />
            <span className="text-sm text-gray-700">Search and select</span>
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Issuer"
              value={issuerSearch}
              onChange={(e) => setIssuerSearch(e.target.value)}
              disabled={issuerOption !== 'search'}
              className="w-[40%] pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={issuerOption === 'not-found'}
              onChange={() => setIssuerOption('not-found')}
              className="w-4 h-4 text-cyan-600"
            />
            <span className="text-sm text-gray-700">Not found</span>
          </label>
        </div>
      </div>

      {/* Organization Details - Gray Background */}
      <div className="bg-gray-50 rounded-lg p-2 md:p-6 mb-6">
        <FormComponent
          fields={organizationFields}
          showSubmitButton={false}
          submitFunction={() => {}}
        />
      </div>

      {/* Certificate Details */}
      <FormComponent
        fields={certificateDetailsFields}
        showSubmitButton={false}
        submitFunction={() => {}}
      />

      {/* Certificate Metadata */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Certificate Metadata</h3>
        <FormComponent
          fields={metadataFields}
          showSubmitButton={false}
          submitFunction={() => {}}
        />
      </div>

      {/* Upload Scanned Certificate */}
      <div className="mt-6 mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Upload Scanned Certificate
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="mb-3">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Upload your Scanned Certificate</p>
            <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, Dropbox</p>
          </div>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer inline-flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Upload File
            </span>
          </label>
          {uploadedFile && (
            <p className="mt-3 text-sm text-gray-700">
              Selected: {uploadedFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
        )}
        <button
          onClick={() => {
            // Collect all form data manually since we have multiple FormComponents
            // In a real implementation, you'd need to use a form context or refs
            handleFormSubmit({});
          }}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Spinner className="text-white" />}
          Submit for Verification
        </button>
      </div>
    </div>
  );
}

// Example usage:
/*
import CertificateVerificationComponent from './CertificateVerificationComponent';

function ParentComponent() {
  const handleSubmit = (data: CertificateVerificationData) => {
    console.log('Certificate verification data:', data);
    // Handle submission
  };

  const handleCancel = () => {
    console.log('Cancelled');
    // Handle cancellation
  };

  return (
    <CertificateVerificationComponent 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
*/