import React from 'react';
import { Text } from '@/components/reuseables/text';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import FormComponent from '@/components/forms/form';

const EmployerProfileStep = () => {
  const { user, setUser } = useCreateUserStore();

  const handleSubmit = (data: Record<string, string>) => {
    setUser({
      professional_status: data.professional_status,
      current_designation: data.current_designation,
      organisation_name: data.organisation_name,
      location: data.location,
    });
    console.log('Employer profile data saved to store:', data);
    // Navigate to dashboard or next step
  };

  const formFields = [
    {
      name: 'professional_status',
      label: 'Professional Status',
      placeholder: 'Select your status',
      dropdown: {
        options: [
          'Recruiter',
          'HR Manager',
          'Hiring Manager',
          'Talent Acquisition',
          'CEO/Founder',
          'Other',
        ],
        defaultValue: 'Select',
        onSelect: (value: string) => {
          console.log('Professional status selected:', value);
        },
      },
    },
    {
      name: 'current_designation',
      label: 'Current Designation',
      placeholder: 'e.g Senior recruiter, HR Manager',
      icons: [
        {
          icon: <Briefcase size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'organisation_name',
      label: 'Organisation / Company Name',
      placeholder: 'e.g Smith recruitment Agency',
      icons: [
        {
          icon: <Building2 size={18} />,
          position: 'inline-start' as const,
          type: 'icon' as const,
        },
      ],
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'e.g Lekki, Lagos',
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
    <div className="flex items-center justify-center flex-col gap-8">
      <div className="text-center max-w-xl">
        <Text as="h1" variant="Heading" className="text-2xl md:text-3xl">
          Complete Your Employer Profile
        </Text>
        <Text as="p" variant="SubText" className="mt-2 text-gray-600">
          Complete your profile and start posting jobs, screening candidates and so on.
        </Text>
      </div>

      <div className="w-full max-w-md">
        <FormComponent
          fields={formFields}
          submitButtonText="Proceed to Dashboard"
          submitButtonStyle="w-full bg-brand-primary hover:bg-brand-primary/90"
          submitFunction={handleSubmit}
        />

        <div className="mt-6 text-center">
          <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 mx-auto">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileStep;