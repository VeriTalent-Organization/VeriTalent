"use client";

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { organizationsService } from '@/lib/services/organizationsService';

interface DomainVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDomain?: string;
  onVerificationComplete: () => void;
}

export default function DomainVerificationModal({
  isOpen,
  onClose,
  currentDomain,
  onVerificationComplete,
}: DomainVerificationModalProps) {
  const [domain, setDomain] = useState(currentDomain || '');
  const [isInitiating, setIsInitiating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'initiated' | 'checking' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [dnsInstructions, setDnsInstructions] = useState<string | null>(null);

  const handleInitiateVerification = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain');
      return;
    }

    try {
      setIsInitiating(true);
      setError(null);
      setStatus('initiated');

      const response = await organizationsService.initiateDomainVerification(domain.trim());

      if (response.success) {
        setDnsInstructions(response.data.dnsInstructions || 'Add the TXT record to your DNS settings and click "Check Verification"');
        setStatus('checking');
      } else {
        throw new Error(response.message || 'Failed to initiate domain verification');
      }
    } catch (err: any) {
      console.error('Domain verification initiation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to initiate verification');
      setStatus('error');
    } finally {
      setIsInitiating(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true);
      setError(null);

      const response = await organizationsService.checkDomainVerification();

      if (response.success && response.data.verified) {
        setStatus('success');
        setTimeout(() => {
          onVerificationComplete();
          onClose();
        }, 2000);
      } else {
        setError('Domain verification failed. Please ensure the TXT record is correctly added to your DNS settings.');
        setStatus('error');
      }
    } catch (err: any) {
      console.error('Domain verification check error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to check verification');
      setStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  const resetModal = () => {
    setDomain(currentDomain || '');
    setStatus('idle');
    setError(null);
    setDnsInstructions(null);
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
            <h2 className="text-xl font-semibold text-gray-900">Verify Domain Ownership</h2>
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
                Verify ownership of your organization's domain by adding a TXT record to your DNS settings.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain to Verify
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleInitiateVerification}
                disabled={isInitiating || !domain.trim()}
                className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInitiating && <Loader2 className="w-4 h-4 animate-spin" />}
                Initiate Verification
              </button>
            </div>
          )}

          {status === 'initiated' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">DNS Record Required</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Add the following TXT record to your DNS settings for domain <strong>{domain}</strong>:
                    </p>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-semibold">@</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-semibold">TXT</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Value:</span>
                          <span className="ml-2 font-semibold break-all">
                            veritalent-verify={dnsInstructions || 'verification-token-here'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-blue-800 mt-3">
                      DNS changes may take up to 24 hours to propagate. Click "Check Verification" once you've added the record.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatus('idle')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCheckVerification}
                  disabled={isChecking}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking && <Loader2 className="w-4 h-4 animate-spin" />}
                  Check Verification
                </button>
              </div>
            </div>
          )}

          {status === 'checking' && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Checking Verification</h3>
              <p className="text-sm text-gray-600">
                We're checking your DNS records for the verification TXT record...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Domain Verified!</h3>
              <p className="text-sm text-gray-600">
                Your domain {domain} has been successfully verified.
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
                  onClick={() => setStatus('initiated')}
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