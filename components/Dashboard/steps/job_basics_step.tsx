'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function JobBasicsStep() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        employmentType: '',
        location: '',
        otherInfo: '',
        applicationDeadline: '16/09/2025'
    });
    
  return (
    <div className="bg-white p-8 rounded-b-lg space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Job Basics</h2>

        <div className="grid grid-cols-2 gap-6">
            {/* Job ID */}
            <div className="space-y-2">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-900">
                Job ID
                </label>
                <Input
                id="jobTitle"
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full"
                />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
                Company Name
                </label>
                <Input
                id="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full"
                />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-900">
                Employment Type
                </label>
                <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Full Time" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                Location
                </label>
                <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                    <SelectItem value="abuja">Abuja, Nigeria</SelectItem>
                    <SelectItem value="port-harcourt">Port Harcourt, Nigeria</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>

        {/* Other Info */}
        <div className="space-y-2">
            <label htmlFor="otherInfo" className="block text-sm font-medium text-gray-900">
                Other Info (Optional)
            </label>
            <textarea
                id="otherInfo"
                rows={4}
                placeholder="Additional info"
                value={formData.otherInfo}
                onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none resize-none"
            />
        </div>

        {/* Application Deadline */}
        <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-900">
                Application Deadline
            </label>
            <div className="relative max-w-xs">
                <Input
                id="deadline"
                type="text"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    </div>
  );
}
