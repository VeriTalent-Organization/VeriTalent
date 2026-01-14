import React, { useState } from 'react';
import { X, Upload, FileText, Calendar, Building2, AlertCircle } from 'lucide-react';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certificateData: CertificateFormData) => void;
}

export interface CertificateFormData {
  certificateFile: File | null;
  certificateType: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  description: string;
}

const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    certificateFile: null,
    certificateType: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CertificateFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, certificateFile: 'Please upload a PDF or image file (JPG, PNG)' }));
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, certificateFile: 'File size must be less than 5MB' }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, certificateFile: file }));
    setErrors(prev => ({ ...prev, certificateFile: undefined }));
  };

  const handleInputChange = (field: keyof CertificateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CertificateFormData, string>> = {};

    if (!formData.certificateFile) {
      newErrors.certificateFile = 'Certificate file is required';
    }
    if (!formData.certificateType.trim()) {
      newErrors.certificateType = 'Certificate type is required';
    }
    if (!formData.issuingOrganization.trim()) {
      newErrors.issuingOrganization = 'Issuing organization is required';
    }
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        certificateFile: null,
        certificateType: '',
        issuingOrganization: '',
        issueDate: '',
        expiryDate: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting certificate verification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Request Certificate Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Certificate File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary transition">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="certificate-file"
              />
              <label htmlFor="certificate-file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.certificateFile ? formData.certificateFile.name : 'Click to upload certificate (PDF, JPG, PNG)'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
              </label>
            </div>
            {errors.certificateFile && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.certificateFile}
              </p>
            )}
          </div>

          {/* Certificate Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Type *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.certificateType}
                onChange={(e) => handleInputChange('certificateType', e.target.value)}
                placeholder="e.g., Professional Certification, Degree Certificate, License"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            {errors.certificateType && (
              <p className="text-red-500 text-sm mt-1">{errors.certificateType}</p>
            )}
          </div>

          {/* Issuing Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Organization *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.issuingOrganization}
                onChange={(e) => handleInputChange('issuingOrganization', e.target.value)}
                placeholder="e.g., Microsoft, Google, University of XYZ"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            {errors.issuingOrganization && (
              <p className="text-red-500 text-sm mt-1">{errors.issuingOrganization}</p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              {errors.issueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional details about this certificate..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Verification Process</p>
                <p>Your certificate will be reviewed by our verification team. This process typically takes 2-3 business days. You'll receive a notification once verification is complete.</p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-brand-primary hover:bg-cyan-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateVerificationModal;