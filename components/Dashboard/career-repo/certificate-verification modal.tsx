import { X } from 'lucide-react';
import React from 'react'

interface CertificateVerificationModalProps {
  onClose: () => void;
}

const CertificateVerificationModal = ({ onClose }: CertificateVerificationModalProps) => {

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end p-4 justify-center">
      {/* Backdrop click closes modal */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[87vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Certificate Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full font-medium">
              Provisional
            </span>
          </div>

          {/* Issuer and Talent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                University of Lagos
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talent Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Jane Doe
              </div>
            </div>
          </div>

          {/* Certificate Title and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Title
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                B.Sc. Computer Science
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Metadata:
              </label>
              <div className="space-y-2">
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Certificate Number: UNILAG/2025/1234
                </div>
                <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  Date Awarded: July 2023
                </div>
              </div>
            </div>
          </div>

          {/* Context Extract */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context Extract
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm space-y-1">
              <p>Holder Name: Jane Doe</p>
              <p>Certificate Title: B.Sc. Computer Science</p>
              <p>Certificate Number: UNILAG/2023/1234</p>
              <p>Date Awarded: July 2023</p>
              <p>Grade: Second Class Upper</p>
              <p>Issuing Institution: University of Lagos.</p>
            </div>
          </div>

          {/* Upload Scanned Certificate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Scanned Certificate
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">Scanned Certificate Uploaded</p>
                <button className="text-brand-primary text-sm font-medium hover:text-cyan-700">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Verification & Audit Trail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification & Audit Trail
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg">
              <a
                href="#"
                className="text-brand-primary hover:text-cyan-700 font-medium"
              >
                Blockchain Hash
              </a>
              <span className="text-gray-500 text-sm ml-2">
                (0•7a8bB...3ca0)
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Request Created: 22/07/2024</p>
            <p>Issuance: 30/07/2024 (Provisional)</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Share
          </button>
          <button className="flex-1 px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificateVerificationModal;