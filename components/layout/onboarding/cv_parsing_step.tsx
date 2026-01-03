'use client';

import React, { useState } from 'react';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import CVParsingComponent from '@/components/Dashboard/cv-parsing/CVParsingComponent';
import { ParsedCVData } from '@/lib/services/cvParsingService';

interface CVParsingStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

type OnboardingStepComponent = React.FC<CVParsingStepProps> & {
  hideParentButtons?: boolean;
};

const CVParsingStep: OnboardingStepComponent = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore();
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);

  const handleComplete = (data: ParsedCVData) => {
    setParsedData(data);

    // Update user store with parsed CV data
    updateUser({
      parsed_cv_data: data,
      cv_parsed: true,
    });

    // Proceed to next step
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <CVParsingComponent
        onComplete={handleComplete}
        onBack={onBack}
        initialData={user?.parsed_cv_data}
      />
    </div>
  );
};

CVParsingStep.hideParentButtons = true;

export default CVParsingStep;