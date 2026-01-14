"use client";

import { useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerify,
  onResendCode,
  isLoading = false,
  error
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;

    try {
      await onVerify(verificationCode);
      setVerificationCode('');
      onClose();
    } catch (err) {
      // Error is handled by parent component
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await onResendCode();
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-900">Verify Email</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              We've sent a verification code to:
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleVerify}
                disabled={!verificationCode.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}