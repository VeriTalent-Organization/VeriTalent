"use client";

import { useState, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import { organizationsService } from '@/lib/services/organizationsService';

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

export default function DocumentVerificationModal({
  isOpen,
  onClose,
  onVerificationComplete,
}: DocumentVerificationModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>('cac-certificate');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'cac-certificate', label: 'CAC Registration Certificate' },
    { value: 'business-license', label: 'Business License' },
    { value: 'tax-certificate', label: 'Tax Clearance Certificate' },
    { value: 'incorporation-documents', label: 'Incorporation Documents' },
    { value: 'other', label: 'Other Official Documents' },
  ];

  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (!allowedFileTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only PDF, JPEG, PNG allowed.`);
      } else if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError(null);
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one document');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setStatus('uploading');
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await organizationsService.uploadVerificationDocuments(selectedFiles, documentType);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setStatus('success');
        setTimeout(() => {
          onVerificationComplete();
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to upload documents');
      }
    } catch (err: any) {
      console.error('Document upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload documents');
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFiles([]);
    setDocumentType('cac-certificate');
    setStatus('idle');
    setError(null);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upload Verification Documents</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload official documents to verify your organization's legitimacy. Documents will be reviewed by our team.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documents
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPEG, PNG up to 10MB each
                  </p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Upload Documents
              </button>
            </div>
          )}

          {status === 'uploading' && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Uploading Documents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please wait while we upload your documents...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{uploadProgress}% complete</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Documents Uploaded!</h3>
              <p className="text-sm text-gray-600">
                Your documents have been submitted for review. We'll notify you once verification is complete.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Upload Failed</h3>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatus('idle')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}