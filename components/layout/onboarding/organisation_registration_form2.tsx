import React from 'react';
import { MapPin, Shield } from 'lucide-react';
import FormComponent from '@/components/forms/form';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { set } from 'zod';
import { Text } from "@/components/reuseables/text";

const OrganizationDetailsFormStep: React.FC<{ onNext?: () => void; onBack?: () => void }> & { hasNextButton?: boolean } = ({ onNext, onBack }) => {
  const { user, setUser } = useCreateUserStore();
  const handleSubmit = (data: Record<string, string>) => {

    setUser({
      industry: data.industry,
      organisation_size: data.organisation_size,
      address: data.address,
    })

    console.log('Form data:', data);
    if (onNext) {
      onNext();
    }
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
          'Other'
        ],
        defaultValue: 'Select industry',
        onSelect: (value: string) => {
          console.log('Industry selected:', value);
        },
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
          '1000+ employees'
        ],
        defaultValue: 'Select size',
        onSelect: (value: string) => {
          console.log('Organisation size selected:', value);
        },
      },
    },
    {
      name: 'address',
      label: 'Address',
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
        {/* Form Component */}
        <FormComponent
          fields={formFields}
          submitButtonText="Next →"
          submitButtonStyle="w-full bg-brand-primary hover:bg-cyan-700"
          submitFunction={handleSubmit}
        />

        {/* Verification Process Info */}
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

              <Text
                variant="SubText"
                className=""
                color="#1d4ed8"
              >
                After registration, we&apos;ll verify your organisation through email domain
                verification and may require additional documentation for manual verification.
              </Text>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 mt-6">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary shrink-0"
          />
          <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-relaxed">
            I agree to the <span className="text-brand-primary hover:underline">Terms of Service</span> and{' '}
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

OrganizationDetailsFormStep.hasNextButton = true;

export default OrganizationDetailsFormStep;