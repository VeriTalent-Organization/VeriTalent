import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';

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
  const [formData, setFormData] = useState<CertificateVerificationData>({
    issuerSearch: '',
    issuerOption: 'search',
    organisationName: '',
    location: '',
    contactName: '',
    designation: '',
    email: '',
    phoneNumber: '',
    talentName: '',
    certificateTitle: '',
    extractContent: '',
    certificateNumber: '',
    dateAwarded: '',
    uploadedFile: null
  });
  

  const handleInputChange = (field: keyof CertificateVerificationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, uploadedFile: file }));
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Certificate Verification</h2>

      {/* Issuer Search */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Issuer</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={formData.issuerOption === 'search'}
              onChange={() => handleInputChange('issuerOption', 'search')}
              className="w-4 h-4 text-brand-primary"
            />
            <span className="text-sm text-gray-700">Search and select</span>
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Issuer"
              value={formData.issuerSearch}
              onChange={(e) => handleInputChange('issuerSearch', e.target.value)}
              disabled={formData.issuerOption !== 'search'}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="issuerOption"
              checked={formData.issuerOption === 'not-found'}
              onChange={() => handleInputChange('issuerOption', 'not-found')}
              className="w-4 h-4 text-brand-primary"
            />
            <span className="text-sm text-gray-700">Not found</span>
          </label>
        </div>
      </div>

      {/* Organization Details */}
      <div className="bg-gray-50 rounded-lg p-2 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name of Organisation
            </label>
            <input
              type="text"
              value={formData.organisationName}
              onChange={(e) => handleInputChange('organisationName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Official Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Talent Name
          </label>
          <input
            type="text"
            value={formData.talentName}
            onChange={(e) => handleInputChange('talentName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Certificate Title
          </label>
          <input
            type="text"
            value={formData.certificateTitle}
            onChange={(e) => handleInputChange('certificateTitle', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Extract Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Extract Content (Optional)
        </label>
        <textarea
          value={formData.extractContent}
          onChange={(e) => handleInputChange('extractContent', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
        />
      </div>

      {/* Certificate Metadata */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Certificate Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Certificate Number
            </label>
            <input
              type="text"
              value={formData.certificateNumber}
              onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date Awarded
            </label>
            <input
              type="date"
              value={formData.dateAwarded}
              onChange={(e) => handleInputChange('dateAwarded', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Upload Scanned Certificate */}
      <div className="mb-6">
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
            <span className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer inline-flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Upload File
            </span>
          </label>
          {formData.uploadedFile && (
            <p className="mt-3 text-sm text-gray-700">
              Selected: {formData.uploadedFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
}
