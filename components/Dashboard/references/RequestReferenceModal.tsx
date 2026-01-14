'use client';

import React, { useState } from 'react';
import { X, Send, User, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { referencesService, RequestReferenceDto } from '@/lib/services/referencesService';

interface RequestReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const referenceTypes = [
  { value: 'work', label: 'Work Reference', description: 'From a previous employer or colleague' },
  { value: 'academic', label: 'Academic Reference', description: 'From a professor or academic institution' },
  { value: 'community', label: 'Community Reference', description: 'From community service or volunteer work' },
  { value: 'performance', label: 'Performance Reference', description: 'Specific performance or achievement' },
  { value: 'membership', label: 'Membership Reference', description: 'From professional organizations' },
  { value: 'studentship', label: 'Studentship Reference', description: 'From educational programs' },
  { value: 'acknowledgement', label: 'Acknowledgement Reference', description: 'General acknowledgement' },
];

export default function RequestReferenceModal({ isOpen, onClose, onSuccess }: RequestReferenceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issuerEmail: '',
    type: '',
    title: '',
    message: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.issuerEmail || !formData.type || !formData.title) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use a placeholder issuerUserId since we need to look up the user by email
      // In a real implementation, you'd need an endpoint to find users by email
      const requestData: RequestReferenceDto = {
        issuerUserId: 'placeholder-user-id', // This would be resolved from email
        type: formData.type as RequestReferenceDto['type'],
        title: formData.title,
        message: formData.message || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      await referencesService.request(requestData);

      alert('Reference request sent successfully!');
      onSuccess?.();
      onClose();

      // Reset form
      setFormData({
        issuerEmail: '',
        type: '',
        title: '',
        message: '',
        startDate: '',
        endDate: '',
      });

    } catch (error) {
      console.error('Failed to request reference:', error);
      alert('Failed to send reference request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Request Reference</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Issuer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Provider Email *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.issuerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuerEmail: e.target.value }))}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The person who will provide your reference
              </p>
            </div>

            {/* Reference Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Type *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reference type" />
                </SelectTrigger>
                <SelectContent>
                  {referenceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Title *
              </label>
              <Input
                type="text"
                placeholder="e.g., Senior Software Engineer at TechCorp"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  placeholder="Add a personal message to your reference request..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="pl-10 min-h-[80px]"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional: Include context about your work together
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}