"use client";

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Linkedin } from 'lucide-react';
import { organizationsService } from '@/lib/services/organizationsService';

interface LinkedInVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLinkedInPage?: string;
  onVerificationComplete: () => void;
}

export default function LinkedInVerificationModal({
  isOpen,
  onClose,
  currentLinkedInPage,
  onVerificationComplete,
}: LinkedInVerificationModalProps) {
  const [isInitiating, setIsInitiating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'verifying' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleInitiateVerification = async () => {
    try {
      setIsInitiating(true);
      setError(null);
      setStatus('redirecting');

      const response = await organizationsService.initiateLinkedInVerification();

      if (response.success && response.data.authorizationUrl) {
        // Redirect to LinkedIn OAuth
        window.location.href = response.data.authorizationUrl;
      } else {
        throw new Error(response.message || 'Failed to initiate LinkedIn verification');
      }
    } catch (err: any) {
      console.error('LinkedIn verification initiation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to initiate verification');
      setStatus('error');
      setIsInitiating(false);
    }
  };

  const resetModal = () => {
    setStatus('idle');
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Verify LinkedIn Company Page</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Linkedin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">LinkedIn Company Verification</h3>
                    <p className="text-sm text-blue-800">
                      Verify ownership of your organization's LinkedIn company page. You'll be redirected to LinkedIn to authorize access.
                    </p>
                  </div>
                </div>
              </div>

              {currentLinkedInPage && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Current LinkedIn Page:</span>
                    <br />
                    <a
                      href={currentLinkedInPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline break-all"
                    >
                      {currentLinkedInPage}
                    </a>
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleInitiateVerification}
                disabled={isInitiating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInitiating && <Loader2 className="w-4 h-4 animate-spin" />}
                <Linkedin className="w-4 h-4" />
                Continue with LinkedIn
              </button>
            </div>
          )}

          {status === 'redirecting' && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Redirecting to LinkedIn</h3>
              <p className="text-sm text-gray-600">
                You'll be redirected to LinkedIn to authorize access to your company page...
              </p>
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Company Page</h3>
              <p className="text-sm text-gray-600">
                We're verifying your LinkedIn company page ownership...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">LinkedIn Page Verified!</h3>
              <p className="text-sm text-gray-600">
                Your LinkedIn company page has been successfully verified.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Verification Failed</h3>
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