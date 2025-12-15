import React from 'react';
import { Mail, Globe } from 'lucide-react';
import FormComponent from '@/components/forms/form';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { set } from 'zod';
import { Text } from '@/components/reuseables/text';

interface OrganizationRegistrationFormStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

const OrganizationRegistrationFormStep: React.FC<{ onNext?: () => void; onBack?: () => void }> & { hasNextButton?: boolean } = ({ onNext, onBack }) => {
  const { user, setUser } = useCreateUserStore();
  const handleSubmit = (data: Record<string, string>) => {

    setUser({
      organisation_name: data.organisation_name,
      rc_number: data.rc_number,
      email_domain: data.email_domain,
      website: data.website,
    });

    console.log('Form data:', data);
    if (onNext) {
      onNext();
    }
  };

  const formFields = [
    {
      name: 'organisation_name',
      label: 'Organisation Name',
      placeholder: 'e.g TechCorp inc.',
    },
    {
      name: 'rc_number',
      label: 'RC Number',
      placeholder: 'e.g RC455568',
    },
    {
      name: 'email_domain',
      label: 'Official Email Domain',
      placeholder: 'corpcompany.com',
      description: 'Domain used for email verification',
      icons: [
        {
          icon: <Mail size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'website',
      label: 'Website',
      placeholder: 'www.corpcompany.com',
      icons: [
        {
          icon: <Globe size={18} />,
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

OrganizationRegistrationFormStep.hasNextButton = true;

export default OrganizationRegistrationFormStep;