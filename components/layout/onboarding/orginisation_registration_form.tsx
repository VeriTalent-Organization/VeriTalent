import React from 'react';
import { Mail, Globe } from 'lucide-react';
import FormComponent from '@/components/forms/form';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Text } from '@/components/reuseables/text';

interface OrganizationRegistrationFormStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

const OrganizationRegistrationFormStep: React.FC<OrganizationRegistrationFormStepProps> & {
  hideParentButtons: boolean;
} = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore();

  // Safety check — should never be null here, but protects from crashes
  if (!user) {
    return (
      <div className="text-center py-10">
        <Text variant="SubText">Loading...</Text>
      </div>
    );
  }

  const handleSubmit = (data: Record<string, string>) => {
    // Validate LinkedIn URL if provided
    if (data.website && data.website.trim()) {
      try {
        new URL(data.website);
        // Valid URL
      } catch {
        alert('Please enter a valid URL for LinkedIn/Website (e.g., https://linkedin.com/company/abc)');
        return;
      }
    }

    // Save organization-specific data using correct field names from your store
    updateUser({
      organization_name: data.organisation_name,
      organisation_rc_number: data.rc_number,
      organization_domain: data.email_domain,
      organization_linkedin_page: data.website || '',
    });

    console.log('Organization registration data saved:', data);

    onNext();
  };

  const formFields = [
    {
      name: 'organisation_name',
      label: 'Organisation Name',
      placeholder: 'e.g. TechCorp Inc.',
    },
    {
      name: 'rc_number',
      label: 'RC Number',
      placeholder: 'e.g. RC455568',
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
      label: 'Website (LinkedIn or Official)',
      placeholder: 'https://linkedin.com/company/techcorp',
      description: 'Must be a complete URL starting with https://',
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
        <FormComponent
          fields={formFields}
          submitButtonText="Next →"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90 py-3 rounded-lg font-medium"
          submitFunction={handleSubmit}
        />

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

// This step has its own Next button → hide parent's
OrganizationRegistrationFormStep.hideParentButtons = true;

export default OrganizationRegistrationFormStep;