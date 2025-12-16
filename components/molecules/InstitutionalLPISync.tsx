import React, { useState } from "react";

interface InstitutionalLPISyncProps {
  onBack: () => void;
}

export default function InstitutionalLPISync({ onBack }: InstitutionalLPISyncProps) {
  const [institutions, setInstitutions] = useState<string[]>([]);

  const addInstitution = () => {
    setInstitutions([...institutions, ""]);
  };

  const removeInstitution = (index: number) => {
    setInstitutions(institutions.filter((_, i) => i !== index));
  };

  const updateInstitution = (index: number, value: string) => {
    const newInstitutions = [...institutions];
    newInstitutions[index] = value;
    setInstitutions(newInstitutions);
  };

  return (
    <div>
      {/* Header with back navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-brand-primary hover:text-cyan-700 mb-4 flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Reports
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Institutions In-Sync</h2>
      </div>

      {/* Connected Institutions Section */}
      <div className="mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
          Connected Institutions
        </h3>

        {/* Empty state boxes */}
        {institutions.length === 0 ? (
          <>
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              {/* Empty placeholder */}
            </div>
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              {/* Empty placeholder */}
            </div>
          </>
        ) : (
          institutions.map((institution, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 bg-white">
              <input
                type="text"
                value={institution}
                onChange={(e) => updateInstitution(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm sm:text-base"
                placeholder="Enter institution name..."
              />
            </div>
          ))
        )}

        {/* Add More Button */}
        <button
          onClick={addInstitution}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-cyan-50 transition-colors font-medium text-sm sm:text-base"
        >
          Add More
        </button>
      </div>

      {/* Note Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-900 mb-2">Note:</p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-cyan-700 space-y-1">
          <li>Syncing and sharing of reports requires institutional approval or acceptance.</li>
          <li>Ensure your institutional identity verifying Email is linked to your VeriTalent ID as a form of your consent to the institution.</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm sm:text-base">
          Submit
        </button>
      </div>
    </div>
  );
}