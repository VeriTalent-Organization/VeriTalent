import React from 'react';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export default function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-gray-100">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 z-0 mx-4 sm:mx-10" /> 

        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className="relative flex flex-col items-center bg-white px-1 sm:px-2"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ring-2 sm:ring-4 ring-white
                ${index <= currentStep
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-200 text-gray-400'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}