import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Video } from 'lucide-react';

export default function SchedulingModal() {
  const [startDate, setStartDate] = useState('April 20, 2025');
  const [startTime, setStartTime] = useState('01:15am');
  const [endTime, setEndTime] = useState('01:45am');
  const [endDate, setEndDate] = useState('April 20, 2025');
  const [callMode, setCallMode] = useState('video');
  const [scheduleMode, setScheduleMode] = useState('sequential');
  const [sendCalendarInvites, setSendCalendarInvites] = useState(true);
  const [sendReminder, setSendReminder] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Scheduling</h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Date and Time Selection */}
          <div className="flex items-center gap-3 mb-6">
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

          <div className="grid grid-cols-2 gap-6 mb-6">
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
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                      day === null
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

            {/* Right Column - Options */}
            <div className="space-y-6">
              {/* Call Mode */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Call Mode</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setCallMode('video')}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      callMode === 'video' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {callMode === 'video' && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm">Video</span>
                  </button>

                  <button
                    onClick={() => setCallMode('phone')}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      callMode === 'phone' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {callMode === 'phone' && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm">Phone</span>
                  </button>
                </div>
              </div>

              {/* Schedule Mode */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Schedule Mode</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setScheduleMode('sequential')}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      scheduleMode === 'sequential' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {scheduleMode === 'sequential' && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm">Schedule Sequentially</span>
                  </button>

                  <button
                    onClick={() => setScheduleMode('group')}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      scheduleMode === 'group' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {scheduleMode === 'group' && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm">Schedule same time (group)</span>
                  </button>
                </div>
              </div>

              {/* Platform */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Platform</h4>
                <button className="w-full px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-blue-600 font-medium hover:bg-gray-50 transition-colors">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">zoom</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
            
            <div className="space-y-3 mb-4">
              <button
                onClick={() => setSendCalendarInvites(!sendCalendarInvites)}
                className="flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  sendCalendarInvites 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {sendCalendarInvites && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">Send calendar invites to candidates</span>
              </button>

              <button
                onClick={() => setSendReminder(!sendReminder)}
                className="flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  sendReminder 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {sendReminder && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">Send reminder 24 hours before</span>
              </button>
            </div>

            <textarea
              placeholder="Custom messages for candidates"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-500 text-sm"
              rows={3}
            />
          </div>

          {/* Action Button */}
          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Interviews
          </button>
        </div>
      </div>
    </div>
  );
}