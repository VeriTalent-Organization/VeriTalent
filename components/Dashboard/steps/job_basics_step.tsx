'use client'
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Text } from '@/components/reuseables/text';
import FormComponent from '@/components/forms/form'; // Adjust path as needed

interface JobBasicsStepProps {
    onNext?: () => void;
    onBack?: () => void;
    canBack?: boolean;
}

export default function JobBasicsStep({ onNext, onBack, canBack }: JobBasicsStepProps) {
    const handleSubmit = (data: Record<string, string>) => {
        console.log('Form data:', data);
        // Handle form submission here
        onNext?.();
    };

    const formFields = [
        {
            name: 'jobId',
            label: 'Job ID',
            placeholder: 'Job Title',
            type: 'text',
            row: 'row1',
            colSpan: 6,
        },
        {
            name: 'companyName',
            label: 'Company Name',
            placeholder: 'Company Name',
            type: 'text',
            row: 'row1',
            colSpan: 6,
        },
        {
            name: 'employmentType',
            label: 'Employment Type',
            placeholder: 'Full Time',
            type: 'text',
            row: 'row2',
            colSpan: 6,
            dropdown: {
                options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'],
                defaultValue: 'Full Time',
            },
        },
        {
            name: 'location',
            label: 'Location',
            placeholder: 'Location',
            type: 'text',
            row: 'row2',
            colSpan: 6,
            dropdown: {
                options: ['Remote', 'Lagos, Nigeria', 'Abuja, Nigeria', 'Port Harcourt, Nigeria', 'Hybrid'],
                defaultValue: 'Remote',
            },
        },
        {
            name: 'otherInfo',
            label: 'Other Info (Optional)',
            placeholder: 'Additional info',
            type: 'textarea',
            rows: 4,
            colSpan: 12,
        },
        {
            name: 'applicationDeadline',
            label: 'Application Deadline',
            placeholder: '16/09/2025',
            type: 'text',
            colSpan: 6,
            icons: [
                {
                    icon: <Calendar className="w-5 h-5 text-gray-400" />,
                    position: 'inline-end' as const,
                    type: 'icon' as const,
                },
            ],
        },
    ];

    return (
        <div className="bg-white p-1 lg:p-8 rounded-b-lg space-y-8">
            <Text variant="SubHeadings" as="h2" className="text-2xl mb-6" color="#111827">
                Job Basics
            </Text>

            <FormComponent
                fields={formFields}
                submitButtonText="Next"
                submitButtonStyle="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                submitButtonPosition="right"
                showSubmitButton={false}
                // submitFunction={handleSubmit}
            />
        </div>
    );
}