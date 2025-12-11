import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function CandidateSelectionModal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Sam Sulek', fitScore: '60%', selected: true },
    { id: 2, name: 'Pariola Ajayi', fitScore: '57%', selected: false },
    { id: 3, name: 'Peace Olayemi', fitScore: '40%', selected: true }
  ]);

  const selectedCount = candidates.filter(c => c.selected).length;

  const toggleCandidate = (id: number) => {
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, selected: !c.selected } : c
    ));
  };

  const selectAll = () => {
    const allSelected = candidates.every(c => c.selected);
    setCandidates(candidates.map(c => ({ ...c, selected: !allSelected })));
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Candidate Selection</h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search and Select All */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={selectAll}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              Select All
            </button>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Applicant Names
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Fit Score
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Select & Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={`border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {candidate.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {candidate.fitScore}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCandidate(candidate.id)}
                        className="flex items-center justify-center"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${candidate.selected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}>
                          {candidate.selected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <button className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              {selectedCount} Selected
            </button>
            <button className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}