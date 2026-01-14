import React from 'react';

import { Text } from '@/components/reuseables/text';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { userTypes } from '@/types/user_type';
import { Mail, Lock, User, MapPin, Building, Briefcase } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import FormComponent from '@/components/forms/form';

interface RegistrationFormStepProps {
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

const RegistrationFormStep: React.FC<RegistrationFormStepProps> & {
  hideParentButtons: boolean;
} = ({ onNext, onBack }) => {
  const { user, updateUser } = useCreateUserStore(); // Use updateUser for partial updates

  // Safe guard: if user is null, show nothing or fallback (shouldn't happen here, but safe)
  if (!user) {
    return (
      <div className="text-center py-10">
        <Text variant="SubText">Loading...</Text>
      </div>
    );
  }

  const handleSubmit = (data: Record<string, string>) => {
    // Save common fields to store
    updateUser({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      country: data.country,
    });

    // Save recruiter-specific fields when present
    if (user.user_type === userTypes.INDEPENDENT_RECRUITER) {
      updateUser({
        current_designation: data.professionalDesignation,
        professional_status: data.professionalStatus,
        organisation_name: data.recruiterOrganizationName,
      });
    }

    // Save organization-specific fields when present
    if (user.user_type === userTypes.ORGANISATION) {
      updateUser({
        organization_name: data.organizationName,
        organization_domain: data.organizationDomain,
        organization_linkedin_page: data.organizationLinkedinPage,
        organisation_size: data.organisationSize,
        organisation_rc_number: data.organisationRcNumber,
        organisation_industry: data.organisationIndustry,
        organisation_location: data.organisationLocation,
      });
    }

    console.log('Registration form data saved to store:', data);

    // Proceed to next step
    onNext();
  };

  // Build conditional fields safely
  const conditionalFields = [];

  if (user.user_type === userTypes.INDEPENDENT_RECRUITER) {
    conditionalFields.push(
      {
        name: 'professionalDesignation',
        label: 'Professional Designation',
        placeholder: 'e.g. Senior Recruiter',
        icons: [{ icon: <Briefcase size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'professionalStatus',
        label: 'Professional Status',
        placeholder: 'e.g. Active',
        icons: [{ icon: <User size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'recruiterOrganizationName',
        label: 'Organization Name',
        placeholder: 'e.g. ABC Corp or Independent',
        icons: [{ icon: <Building size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      }
    );
  }

  if (user.user_type === userTypes.ORGANISATION) {
    conditionalFields.push(
      {
        name: 'organizationName',
        label: 'Organization Name',
        placeholder: 'e.g. ABC Corp',
        icons: [{ icon: <Building size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organizationDomain',
        label: 'Organization Domain',
        placeholder: 'e.g. abc.com',
        icons: [{ icon: <Mail size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organizationLinkedinPage',
        label: 'LinkedIn Page',
        placeholder: 'https://linkedin.com/company/abc',
        icons: [{ icon: <Building size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organisationSize',
        label: 'Organization Size',
        placeholder: 'e.g. 50-100',
        icons: [{ icon: <User size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organisationRcNumber',
        label: 'RC Number',
        placeholder: 'e.g. RC123456',
        icons: [{ icon: <Building size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organisationIndustry',
        label: 'Industry',
        placeholder: 'e.g. Technology',
        icons: [{ icon: <Briefcase size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      },
      {
        name: 'organisationLocation',
        label: 'Organization Location',
        placeholder: 'e.g. Lagos, Nigeria',
        icons: [{ icon: <MapPin size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      }
    );
  }

  const formFields = [
    {
      name: 'full_name',
      label: 'Full Name',
      placeholder: 'Sam Doe',
      icons: [{ icon: <User size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
    },
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'sam.doe@example.com',
      type: 'email',
      icons: [{ icon: <Mail size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Create a strong password',
      type: 'password',
      description: 'Use 8 or more characters with a mix of letters and numbers.',
      icons: [{ icon: <Lock size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
    },
    {
      name: 'country',
      label: 'Country / Location',
      placeholder: 'Select your country',
      icons: [{ icon: <MapPin size={18} />, position: 'inline-start' as const, type: 'icon' as const }],
      dropdown: {
        options: ['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Ghana', 'South Africa', 'Kenya'],
        defaultValue: 'Select',
      },
    },
    ...conditionalFields,
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center max-w-3xl">
        <Text as="h1" variant="SubHeadings" className="text-2xl sm:text-3xl lg:text-4xl">
          Join <span className="text-brand-primary">VeriTalent</span>
        </Text>
        <Text
          as="p"
          variant="SubText"
          className="mt-2 text-gray-600 leading-6 text-sm sm:text-base px-4 sm:px-0"
        >
          Whether you&apos;re a Talent, an Independent Recruiter/Manager, or represent an Organisation, create your free VeriTalent account and kick things off!
        </Text>
      </div>

      <div className="w-full max-w-md">
        <FormComponent
          fields={formFields}
          submitButtonText="Next →"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90 py-3 rounded-lg font-medium"
          submitFunction={handleSubmit}
        />

        <div className="flex items-start gap-2 mt-6">
          <Checkbox
            id="terms"
            checked={user.has_agreed_to_terms}
            onCheckedChange={(checked: boolean) => {
              updateUser({ has_agreed_to_terms: checked });
            }}
            className="mt-0.5 shrink-0"
          />
          <label
            htmlFor="terms"
            className="text-xs sm:text-sm text-gray-600 cursor-pointer leading-relaxed"
          >
            I agree to The{' '}
            <Link href="#" className="text-brand-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-brand-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

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

RegistrationFormStep.hideParentButtons = true;

export default RegistrationFormStep;