"use client";

import React from "react";
import { X } from "lucide-react";

interface WorkReferenceModalProps {
  onClose: () => void;
}

const WorkReferenceModal = ({ onClose }: WorkReferenceModalProps) => {
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
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Work Reference</h2>
            <span className="text-sm text-gray-500">Historical</span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-2 md:p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
              Pending
            </span>
          </div>

          {/* Issuer and Talent Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                ABC Corp
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

          {/* Role & Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role & Department
            </label>
            <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
              Developer, Engineering
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <div className="space-y-2">
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Internship
              </div>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Onsite
              </div>
            </div>
          </div>

          {/* Employment Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Period (Start)
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Jan 2018
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Period (End)
              </label>
              <div className="px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700">
                Jun 2018
              </div>
            </div>
          </div>

          {/* Responsibilities & Accomplishments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities & Accomplishments
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              <p>Developed API services</p>
              <p>Led 5 person dev team</p>
              <p>Implemented CI/CD pipeline</p>
            </div>
          </div>

          {/* Reference Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Verification & Audit Trail
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
            <p>Request Created: 01/12/2022</p>
            <p>Issuance: 02/01/2023</p>
            <p>Updated(1): 10/10/2023</p>
            <p>Updated(2): 23/01/2024</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-2 md:p-6 border-t bg-gray-50">
          <button className="flex-1 px-2 md:px-6 py-2.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-cyan-700">
            Share
          </button>
          <button className="flex-1 px-2 md:px-6 text-sm py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700">
            Download
          </button>
          <button className="flex-1 px-2 text-sm md:px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-cyan-700">
            Request Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkReferenceModal;
