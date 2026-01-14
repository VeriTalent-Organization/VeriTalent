import React from 'react';
import { Metadata } from 'next';
import NotificationCenter from '@/components/Dashboard/NotificationCenter';

export const metadata: Metadata = {
  title: 'Notifications | VeriTalent',
  description: 'View all your notifications and updates',
};

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your reference requests, applications, and other important activities.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <NotificationCenter className="w-full" />
          </div>
        </div>

        {/* Future: Add more detailed notification management here */}
        <div className="mt-8 text-center text-gray-500">
          <p>More detailed notification management features coming soon.</p>
        </div>
      </div>
    </div>
  );
}
