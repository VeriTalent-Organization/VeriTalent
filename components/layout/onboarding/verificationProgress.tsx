import React from 'react';
import { CheckCircle, FileText, ArrowLeft } from 'lucide-react';

export default function VerificationProgress() {
  return (
    <div className="min-h-screen flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Verification in Progress
          </h1>

          {/* Email domain Verification */}
          <div className="border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex flex-col items-start md:flex-row gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Email domain Verification
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Verifying @corpcompany.com
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm text-teal-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Verification */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex flex-col items-start md:flex-row gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Manual Verification
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Our team will review your organisation details within 24-48 hours.
                </p>
                <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                  Pending review
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Box */}
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 mb-6">
            <h3 className="text-base font-semibold text-teal-900 mb-3">
              What&apos;s Next?
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-teal-800">
                • Check your email for verification instructions
              </li>
              <li className="text-sm text-teal-800">
                • You&apos;ll receive a notification once verification is complete
              </li>
              <li className="text-sm text-teal-800">
                • You can start using basic features while verification is pending
              </li>
            </ul>
          </div>

          {/* Proceed Button */}
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-lg transition-colors mb-4">
            Proceed to Dashboard
          </button>

          {/* Back Button */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}