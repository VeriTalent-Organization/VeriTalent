import React, { useState } from 'react'
import { Spinner } from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

interface CertificateModalProps {
  onClose: () => void;
}

const CertificateModal = ({ onClose }: CertificateModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      // TODO: Replace with actual API call or navigation to edit page
      console.log("Edit certificate");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to edit:", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Certificate"
      size="lg"
      position="bottom"
    >
      {/* Modal Body */}
      <div className="p-4 sm:p-6">        {/* Modal Body */}
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
        <div className="flex justify-end p-6 border-t sticky bottom-0 bg-gray-50">
          <button 
            onClick={handleEdit}
            disabled={isEditing}
            className="px-8 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isEditing && <Spinner className="text-white" />}
            Edit
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CertificateModal;