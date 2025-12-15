import React, { useState }from 'react'
import { int } from 'zod';

interface AddExistingRecordFormProps {
  onBack: () => void;
}

const AddExistingRecordForm = ({ onBack }: AddExistingRecordFormProps) => {
  const [recordType, setRecordType] = useState('Certificate');
  const [certificateTitle, setCertificateTitle] = useState('');
  const [verificationOption, setVerificationOption] = useState('not-verified');
  const [verificationLink, setVerificationLink] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [timeline, setTimeline] = useState('');
  const [additionalData, setAdditionalData] = useState('');

  return (
    <div className="flex-1 w-full bg-gray-50">
      <div className="w-full bg-white  rounded-lg shadow-sm p-2 md:p-6">

        {/* Form */}
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Add Existing Verified Career Record (Listing)
          </h2>

          <div className="space-y-6">
            {/* Types of Record */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Types of Record
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700"
              >
                <option>Certificate</option>
                <option>Work Reference</option>
                <option>Education</option>
                <option>Award</option>
              </select>
            </div>

            {/* Certificate Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Certificate Title
              </label>
              <input
                type="text"
                value={certificateTitle}
                onChange={(e) => setCertificateTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Verification Options */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="verification"
                  value="link"
                  checked={verificationOption === 'link'}
                  onChange={(e) => setVerificationOption(e.target.value)}
                  className="mt-1 w-4 h-4 text-brand-primary"
                />
                <span className="text-sm text-gray-700">
                  Enter the digital Verification link of the record here
                </span>
              </label>

              {verificationOption === 'link' && (
                <input
                  type="url"
                  value={verificationLink}
                  onChange={(e) => setVerificationLink(e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ml-7"
                />
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="verification"
                  value="request"
                  checked={verificationOption === 'request'}
                  onChange={(e) => setVerificationOption(e.target.value)}
                  className="mt-1 w-4 h-4 text-brand-primary"
                />
                <span className="text-sm text-gray-700">
                  Go to the new request and initiate verification or reference if needed
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="verification"
                  value="not-verified"
                  checked={verificationOption === 'not-verified'}
                  onChange={(e) => setVerificationOption(e.target.value)}
                  className="mt-1 w-4 h-4 text-brand-primary"
                />
                <span className="text-sm text-gray-700">
                  Continue with a not-verified status for the record
                </span>
              </label>
            </div>

            {/* Issuer/Organisation Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Issuer/ Organisation Name
              </label>
              <input
                type="text"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Timeline
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., Jan 2023 - Dec 2023"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Additional Data */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Add other data associated to the record
              </label>
              <textarea
                value={additionalData}
                onChange={(e) => setAdditionalData(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              />
            </div>

            
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between md:justify-end gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Submit as listing
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddExistingRecordForm