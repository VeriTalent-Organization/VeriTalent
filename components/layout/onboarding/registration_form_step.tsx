import React from 'react';

import { Text } from '@/components/reuseables/text';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import FormComponent from '@/components/forms/form';

const RegistrationFormStep = () => {
  const { user, setUser } = useCreateUserStore();

  const handleSubmit = (data: Record<string, string>) => {
    setUser({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      country: data.country,
    });
    console.log('Form data saved to store:', data);
  };

  const formFields = [
    {
      name: 'full_name',
      label: 'Full Name',
      placeholder: 'Sam Doe',
      icons: [
        {
          icon: <User size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'sam.doe@example.com',
      type: 'email',
      icons: [
        {
          icon: <Mail size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Create a strong password',
      type: 'password',
      description: 'Use 8 or more characters with a mix of letters and numbers.',
      icons: [
        {
          icon: <Lock size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'country',
      label: 'Country / Location',
      placeholder: 'Select your country',
      icons: [
        {
          icon: <MapPin size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
      dropdown: {
        options: ['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Ghana', 'South Africa', 'Kenya'],
        defaultValue: 'Select',
        onSelect: (value: string) => {
          console.log('Country selected:', value);
        },
      },
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-8">
      <div className="text-center">
        <Text as="h1" variant="Heading">
          Join <span className="text-brand-primary">VeriTalent</span>
        </Text>
        <Text as="p" variant="SubText" className="mt-2 text-gray-600 w-160 leading-6">
          Whether you're a Talent, an Independent Recruiter/Manager, or represent an Organisation, create your free VeriTalent account and kick things off!
        </Text>
      </div>

      <div className="w-full max-w-md">
        <FormComponent
          fields={formFields}
          submitButtonText="Next →"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90"
          submitFunction={handleSubmit}
        />

        <div className="flex items-start gap-2 mt-6">
          <Checkbox
            id="terms"
            checked={user.has_agreed_to_terms}
            onCheckedChange={(checked: boolean) => {
              setUser({ has_agreed_to_terms: checked as boolean });
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 cursor-pointer"
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
          <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 mx-auto">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormStep;