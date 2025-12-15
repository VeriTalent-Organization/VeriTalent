import React, { useState } from 'react';

import { Text } from '@/components/reuseables/text';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import FormComponent from '@/components/forms/form';

interface RegistrationFormStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

const RegistrationFormStep: React.FC<{ onNext?: () => void; onBack?: () => void }> & { hasNextButton?: boolean } = ({ onNext, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user, setUser } = useCreateUserStore();

  const handleSubmit = (data: Record<string, string>) => {
    setUser({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      country: data.country,
    });
    
    console.log('Form data saved to store:', data);
    if (onNext) {
      onNext();
    }
    
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

    // follow this flow for adding rows to the form
//     {
//   name: "dob",
//   label: "Date of Birth",
//   type: "date",
//   row: "demographics",
// },

// {
//   name: "age",
//   label: "Age",
//   type: "number",
//   row: "demographics",
// },
// {
//   name: "gender",
//   label: "Gender",
//   dropdown: {
//     options: ["Male", "Female"],
//   },
//   row: "demographics",
// }
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center max-w-3xl">
        <Text as="h1" variant="Heading" className="text-2xl sm:text-3xl lg:text-4xl">
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
RegistrationFormStep.hasNextButton = true;

export default RegistrationFormStep;