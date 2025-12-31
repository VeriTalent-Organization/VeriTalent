import React from 'react';
import { MapPin, Shield } from 'lucide-react';
import FormComponent from '@/components/forms/form';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Text } from '@/components/reuseables/text';

interface OrganizationDetailsFormStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

const OrganizationDetailsFormStep: React.FC<OrganizationDetailsFormStepProps> & {
  hideParentButtons: boolean;
} = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore();

  // Safety guard — should never be null here, but prevents crashes
  if (!user) {
    return (
      <div className="text-center py-10">
        <Text variant="SubText">Loading...</Text>
      </div>
    );
  }

  const handleSubmit = (data: Record<string, string>) => {
    console.log('[OrgForm2] Form data received:', data);
    
    const updateData = {
      organisation_industry: data.industry,        // ← Correct field name
      organisation_size: data.organisation_size,
      organisation_location: data.address,          // ← Maps to location in store
    };
    
    console.log('[OrgForm2] Updating user store with:', updateData);
    
    updateUser(updateData);

    console.log('[OrgForm2] Organization details saved');

    onNext();
  };

  const formFields = [
    {
      name: 'industry',
      label: 'Industry',
      placeholder: 'Select industry',
      dropdown: {
        options: [
          'Technology',
          'Healthcare',
          'Finance',
          'Education',
          'Manufacturing',
          'Retail',
          'Consulting',
          'Other',
        ],
        defaultValue: 'Select industry',
      },
    },
    {
      name: 'organisation_size',
      label: 'Organisation Size',
      placeholder: 'Select size',
      dropdown: {
        options: [
          '1-10 employees',
          '11-50 employees',
          '51-200 employees',
          '201-500 employees',
          '501-1000 employees',
          '1000+ employees',
        ],
        defaultValue: 'Select size',
      },
    },
    {
      name: 'address',
      label: 'Organisation Address',
      placeholder: 'Enter full organisation address',
      icons: [
        {
          icon: <MapPin size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center">
        <Text variant="Heading" as="h1" className="mb-2 text-2xl sm:text-3xl lg:text-4xl">
          Join <span className="text-brand-primary">VeriTalent</span>
        </Text>

        <Text
          variant="SubText"
          className="mt-2 max-w-2xl mx-auto leading-6 text-sm sm:text-base px-4"
          color="rgba(0,0,0,0.6)"
        >
          Register your organisation to manage internal talents / to screen and hire the best-fit talents.
        </Text>
      </div>

      <div className="w-full max-w-md">
        <FormComponent
          fields={formFields}
          submitButtonText="Next →"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90 py-3 rounded-lg font-medium"
          submitFunction={handleSubmit}
        />

        {/* Verification Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <Text
                variant="SubText"
                as="h3"
                className="mb-1 font-semibold text-sm sm:text-base"
                color="#1e3a8a"
              >
                Verification Process
              </Text>

              <Text variant="SubText" color="#1d4ed8">
                After registration, we&apos;ll verify your organisation through email domain verification and may require additional documentation for manual verification.
              </Text>
            </div>
          </div>
        </div>

        {/* Terms Checkbox (optional — you can connect to store if needed) */}
        <div className="flex items-start gap-2 mt-6">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary shrink-0"
          />
          <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-relaxed">
            I agree to the{' '}
            <span className="text-brand-primary hover:underline">Terms of Service</span> and{' '}
            <span className="text-brand-primary hover:underline">Privacy Policy</span>.
          </label>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm sm:text-base flex items-center gap-2 mx-auto transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

// This step has its own Next button
OrganizationDetailsFormStep.hideParentButtons = true;

export default OrganizationDetailsFormStep;