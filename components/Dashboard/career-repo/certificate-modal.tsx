import { X } from 'lucide-react';
import React from 'react'

interface CertificateModalProps {
  onClose: () => void;
}

const CertificateModal = ({ onClose }: CertificateModalProps) => {

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
            <h2 className="text-xl font-semibold text-gray-900">Certificate</h2>
            <span className="text-sm text-gray-500">Listing</span>
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
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
              Check Verification Link
            </span>
          </div>

          {/* Certificate Title and Issuer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Title
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Certificate
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer/Organisation Name
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Google Digital Garage
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TimeLine
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              Jan 2023 - Mar 2024
            </div>
          </div>

          {/* Other data associated to the record */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other data associated to the record
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 text-sm space-y-1">
              <p>Holder Name: Jane Doe</p>
              <p>Record Title: Digital Marketing Certificate</p>
              <p>Certificate Number: VT-CERT-2025-00987</p>
              <p>Issued: March 10, 2024</p>
            </div>
          </div>

          {/* Digital Verification Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Verification Link
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              https://verify.ABC.io/cred/VT-9F3A7X
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button className="px-8 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificateModal;