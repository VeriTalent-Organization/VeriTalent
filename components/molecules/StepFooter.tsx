import React from 'react';

interface StepFooterProps {
  onBack: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  canGoBack: boolean;
  isLastStep: boolean;
  nextLabel?: string;
  finalActionLabel?: string;
  showSaveDraft?: boolean;
}

export default function StepFooter({
  onBack,
  onNext,
  onSaveDraft,
  canGoBack,
  isLastStep,
  nextLabel = "Next",
  finalActionLabel = "Submit",
  showSaveDraft = false
}: StepFooterProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-gray-100">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        Back
      </button>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {showSaveDraft && (
          <button 
            onClick={onSaveDraft}
            className="w-full sm:w-auto px-6 py-3 border border-brand-primary text-brand-primary rounded-lg hover:bg-cyan-50 transition font-medium text-sm sm:text-base order-2 sm:order-1"
          >
            Save Draft
          </button>
        )}

        {isLastStep ? (
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-sm text-sm sm:text-base order-1 sm:order-2"
          >
            {finalActionLabel}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-sm text-sm sm:text-base order-1 sm:order-2"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}