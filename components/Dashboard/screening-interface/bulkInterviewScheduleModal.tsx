import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BulkInterviewScheduleCompact() {
  const [interviewMode, setInterviewMode] = useState('virtual');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('April 20, 2025');
  const [startTime, setStartTime] = useState('01:15am');
  const [endTime, setEndTime] = useState('01:45am');
  const [endDate, setEndDate] = useState('April 20, 2025');
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1)); // April 2025

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Interview Schedule</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Candidate Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Schedule interview with Sam Sulek</h3>
            </div>

            {/* Interview Mode Selection */}
            <div className="ml-5 space-y-3 mb-4">
              <button
                onClick={() => setInterviewMode('virtual')}
                className="flex items-center gap-3 text-gray-700"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${interviewMode === 'virtual' ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                  {interviewMode === 'virtual' && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">Virtual Interview mode</span>
              </button>

              <button
                onClick={() => setInterviewMode('in-person')}
                className="flex items-center gap-3 text-gray-700"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${interviewMode === 'in-person' ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                  {interviewMode === 'in-person' && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">In-person Interview mode</span>
              </button>
            </div>

            {/* Location Input */}
            {interviewMode === 'in-person' && (
              <div className="ml-5 mt-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={startDate}
                readOnly
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={startTime}
                readOnly
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-blue-600 font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="text"
                value={endTime}
                readOnly
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-blue-600 font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={endDate}
                readOnly
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Layout with Calendar and Notes side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h4 className="text-base font-semibold text-gray-900">{monthName}</h4>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="text-center text-xs font-medium text-gray-600 py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${day === null
                        ? 'invisible'
                        : day === 20
                          ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes and Actions */}
            <div className="flex flex-col">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Additional Notes</h4>
              <textarea
                placeholder="Optional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-500 text-sm mb-4"
              />

              {/* Action Buttons */}
              <div className="flex gap-3 sticky bottom-0">
                <button className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                  Cancel
                </button>
                <button className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}