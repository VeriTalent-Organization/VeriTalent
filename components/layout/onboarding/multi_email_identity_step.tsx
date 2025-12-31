'use client';

import React, { useState } from 'react';
import { Mail, Plus, Check, Shield } from 'lucide-react';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

interface MultiEmailIdentityStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

type OnboardingStepComponent = React.FC<MultiEmailIdentityStepProps> & {
  hideParentButtons?: boolean
}

const MultiEmailIdentityStep: OnboardingStepComponent = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore();
  const [veritalentId] = useState(() => {
    if (user?.veritalent_id) return user.veritalent_id;
    return `VT/${Math.floor(Math.random() * 10000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  });
  const [linkedEmails, setLinkedEmails] = useState([
    { email: user?.email || '', primary: true, verified: true, type: 'Personal' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);

  const handleAddEmail = () => {
    if (newEmail && !linkedEmails.find(e => e.email === newEmail)) {
      setLinkedEmails([
        ...linkedEmails,
        { email: newEmail, primary: false, verified: false, type: 'Additional' }
      ]);
      setNewEmail('');
      setIsAddingEmail(false);
    }
  };

  const handleSetPrimary = (email: string) => {
    setLinkedEmails(
      linkedEmails.map(e => ({
        ...e,
        primary: e.email === email
      }))
    );
  };

  const handleRemoveEmail = (email: string) => {
    if (linkedEmails.length > 1 && !linkedEmails.find(e => e.email === email)?.primary) {
      setLinkedEmails(linkedEmails.filter(e => e.email !== email));
    }
  };

  const handleProceed = () => {
    // Save linked emails to user store
    updateUser({
      linked_emails: linkedEmails.map(e => e.email),
      veritalent_id: veritalentId
    });
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Multi Email and Identity Management
        </h1>
        <p className="text-gray-600">Manage multiple email addresses linked to your VeriTalent account</p>
      </div>

      {/* Success Alert */}
      <div className="mb-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-green-800">
            Account created successfully!
          </p>
          <p className="text-sm text-green-700 mt-1">
            Your unique VeriTalent ID ({veritalentId}) has been generated.
          </p>
        </div>
      </div>

      {/* VeriTalent ID Display */}
      <div className="mb-8">
        <p className="text-gray-700 font-medium mb-2">Your VeriTalent ID</p>
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
          <p className="font-mono font-bold text-lg text-gray-900">{veritalentId}</p>
        </div>
      </div>

      <div className="border-t pt-8 mb-8">
        {/* Linked Emails Section */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Linked Email Addresses</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Add multiple emails to enable seamless transitions across personal and institutional roles. You can log in using any verified email.
        </p>

        {/* Email List */}
        <div className="space-y-3 mb-6">
          {linkedEmails.map((emailData, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 break-all">{emailData.email}</p>
                  {emailData.type && (
                    <p className="text-xs text-gray-500 mt-1">{emailData.type}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                {emailData.primary && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    Primary
                  </span>
                )}
                {emailData.verified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
                {!emailData.primary && linkedEmails.length > 1 && (
                  <button
                    onClick={() => handleRemoveEmail(emailData.email)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                )}
                {!emailData.primary && (
                  <button
                    onClick={() => handleSetPrimary(emailData.email)}
                    className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium"
                  >
                    Set Primary
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Email Section */}
        {!isAddingEmail ? (
          <button
            onClick={() => setIsAddingEmail(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add another email Address
          </button>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <button
                onClick={handleAddEmail}
                disabled={!newEmail}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Add Email
              </button>
              <button
                onClick={() => {
                  setIsAddingEmail(false);
                  setNewEmail('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mb-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Login Flexibility</h3>
          <p className="text-sm text-blue-800">
            You can log in using any of your verified email addresses. Your VeriTalent ID ({veritalentId}) remains consistent across all your emails, maintaining one unified user record.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            Back
          </button>
        )}
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-semibold transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

(MultiEmailIdentityStep).hideParentButtons = true;

export default MultiEmailIdentityStep;
